import Router from "@koa/router";
import type { Context } from "koa";
import type { IGoodCategory } from "../dto/ICategory.js";
import prisma from "../prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";
import type { Profile } from "../dto/IProfile.js";

const categoryRouter = new Router()

categoryRouter.post('/api/v1/good-categories/', async (ctx: Context) => {
    const category = ctx.request.body as IGoodCategory;

    try {
        const newCategory = await prisma.goodCategory.create({
            data: {
                title: category.title,
                description: category.description,
                parentId: category.parentId ?? null
            }
        });

        ctx.body = newCategory as IGoodCategory;
    } catch (error) {
        console.error('Добавление категории:', error);
        ctx.status = 500;
        ctx.body = { error: 'Ошибка добавления категории' };
    }
});

categoryRouter.get('/api/v1/good-categories/:id', async (ctx: Context) => {
    const id = parseInt(ctx.params.id);

    try {
        const category = await prisma.goodCategory.findUnique({
            where: { id }
        });

        ctx.body = category as IGoodCategory;
    } catch (error) {
        console.error('Поиск категории:', error);
        ctx.status = 500;
        ctx.body = { error: 'Ошибка поиска категории' };
    }
});

categoryRouter.get('/api/v1/profile/', authMiddleware, async (ctx: Context) => {
    try {
        const email = ctx.state.user.email;

        const user = await prisma.user.findUnique({ where: {email: email } });

        if(!user) {
            ctx.status = 500;
            ctx.body = { error: 'Ошибка верификации' };
            return;
        }

        const profile: Profile = {
            email: user.email,
            sname: user.sname ? user.sname : '',
            name: user.name ? user.name : ''
        };

        ctx.body = profile;
    } catch (error) {
        console.error('Поиск категории:', error);
        ctx.status = 500;
        ctx.body = { error: 'Ошибка поиска профиля' };
    }
});

export default categoryRouter;