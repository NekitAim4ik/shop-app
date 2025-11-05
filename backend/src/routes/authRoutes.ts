import Router from '@koa/router';
import type { Context } from 'koa';
import sendOtp from '../services/mailService.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/jwtService.js';
import generateOtp from '../services/cryptoService.js';
import { storeOTP, verifyOtp, deleteOtp } from '../services/redisService.js';
import type { ILoginBody, ILoginConfirmBody } from '../dto/IAuth.js';
import prisma from '../prisma.js';
import type { JwtPayload } from 'jsonwebtoken';

const authRouter = new Router();

authRouter.get('/', (ctx: Context) => {
    ctx.body = 'Tts GET';
});

authRouter.post('/api/v1/auth/login/', async (ctx: Context) => {
    const loginBody = ctx.request.body as ILoginBody;

    const otp = generateOtp().toString();

    try {
        await storeOTP(loginBody.email, otp);
        await sendOtp(loginBody.email, otp);

        ctx.body = { message: `Отправлено письмо ${loginBody.email}` };
    } catch (error) {
        console.log(error);
        ctx.status = 500;
        ctx.body = { error: 'Ошибка отправки' };
    }
});

authRouter.post('/api/v1/auth/confirm/', async (ctx: Context) => {
    const loginConfirmBody = ctx.request.body as ILoginConfirmBody;

    try {
        const isValid = await verifyOtp(loginConfirmBody.email, loginConfirmBody.otp);

        if(isValid) {
            if (!prisma.user.findUnique({ where: {email: loginConfirmBody.email} })) {
                const user = await prisma.user.create({
                    data: {
                        email: loginConfirmBody.email
                    }
                });
            }

            const accessToken = generateAccessToken(loginConfirmBody.email);
            const refreshToken = generateRefreshToken(loginConfirmBody.email);

            await deleteOtp(loginConfirmBody.email);

            ctx.cookies.set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            ctx.body = { accessToken };
        } else {
            ctx.status = 401;
            ctx.body = { error: 'Недействительный или истекший OTP' };
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        ctx.status = 500;
        ctx.body = { error: 'Ошибка верификации OTP' };
    }
});

authRouter.post('/api/v1/auth/refresh/', async (ctx: Context) => {
    const refreshToken = ctx.cookies.get('refreshToken');

    if (!refreshToken) {
        ctx.status = 401;
        ctx.body = { error: 'Refresh token not found' };
        return;
    }

    try {
        const decoded = verifyRefreshToken(refreshToken) as JwtPayload;
        
        const newAccessToken = generateAccessToken(decoded.email);

        ctx.status = 200;
        ctx.body = {
            accessToken: newAccessToken
        };
    } catch (err) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid refresh token' };
    }
});

authRouter.post('/auth/logout/', async (ctx: Context) => {
  
    ctx.cookies.set('refreshToken', null, {
        maxAge: 0
    });

    ctx.status = 200;
    ctx.body = { message: 'Logged out successfully' };
});

export default authRouter;