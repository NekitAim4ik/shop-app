import Router from "@koa/router";
import type { Context } from "koa";
import type { IGoodCategory } from "../dto/ICategory.js";
import prisma from "../prisma.js";

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

export default categoryRouter;