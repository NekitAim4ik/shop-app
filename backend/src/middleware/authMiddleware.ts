import type { Context } from 'koa';
import koaJwt from 'koa-jwt';
import { verifyAccessToken } from '../services/jwtService.js';

const jwtMiddleware = koaJwt({
    secret: process.env.JWT_ACCESS_SECRET as string,

    key: 'user',

    passthrough: false,

    getToken: (ctx: Context) => {
        const authHeader = ctx.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return null;
    }
});

async function authMiddleware(ctx:Context, next: any) {
    const authHeader = ctx.headers.authorization;

    if(!authHeader?.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = { error: 'Unauthorized', message: 'No token provided' };
        return;
    }

    const token = authHeader.slice(7);

    try {
        const decoded = verifyAccessToken(token);
        ctx.state.user = decoded;
        await next();
    } catch (err: any) {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                error: 'Unauthorized',
                message: 'Invalid or expired token'
            };
        } else {
            ctx.status = 500;
            ctx.body = {
                error: 'Internal Server Error',
                message: err.message
            };
        }
    }
}

export default authMiddleware;