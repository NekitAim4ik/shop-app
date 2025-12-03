import Router from '@koa/router';
import type { Context } from 'koa';
import sendOtp from '../services/mailService.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/jwtService.js';
import generateOtp, { hashPassword, verifyPassword } from '../services/cryptoService.js';
import { storeOTP, verifyOtp, deleteOtp, storeUser, getUser, storePass, getPass, deletePending } from '../services/redisService.js';
import type { ILoginBody, ILoginConfirmBody, IRegisterBody } from '../dto/IAuth.js';
import prisma from '../prisma.js';
import type { JwtPayload } from 'jsonwebtoken';
import type { User } from '../dto/IAuth.js';

const authRouter = new Router();

authRouter.get('/', (ctx: Context) => {
    ctx.body = 'Tts GET';
});

authRouter.post('/api/v1/auth/login/', async (ctx: Context) => {
    const loginBody = ctx.request.body as ILoginBody;

    const otp = generateOtp().toString();

    try {
        await storeOTP(loginBody.email, otp);
        await storePass(loginBody.email, loginBody.password);
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
            const user = await prisma.user.findUnique({ where: {email: loginConfirmBody.email }});

            if (!user) {

                const pendingData = await getUser(loginConfirmBody.email);
                if (!pendingData) {
                    ctx.status = 410; // Gone
                    ctx.body = { error: 'Сессия истекла' };
                    return;
                }

                const newUser = JSON.parse(pendingData);
                const password = await hashPassword(newUser.password);

                const user = await prisma.user.create({
                    data: {
                        email: newUser.email,
                        name: newUser.name,
                        sname: newUser.sname,
                        password: password
                    }
                });
            } else {
                const password = await getPass(loginConfirmBody.email);

                const isValPass = await verifyPassword(password!, user!.password);
                if (!isValPass) {
                    ctx.status = 401;
                    ctx.body = { error: 'Неверный email или пароль' };
                    return;
                }
            }

            const accessToken = generateAccessToken(loginConfirmBody.email);
            const refreshToken = generateRefreshToken(loginConfirmBody.email);

            await deleteOtp(loginConfirmBody.email);
            await deletePending(loginConfirmBody.email);

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

authRouter.post('/api/v1/auth/register/', async (ctx: Context) => {
    const registerBody = ctx.request.body as IRegisterBody;

    const otp = generateOtp().toString();
    
    try {
        await storeOTP(registerBody.email, otp);
        await storeUser(registerBody as User);
        await sendOtp(registerBody.email, otp);

        ctx.body = { message: `Отправлено письмо ${registerBody.email}` };
    } catch (error) {
        console.log(error);
        ctx.status = 500;
        ctx.body = { error: 'Ошибка отправки' };
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