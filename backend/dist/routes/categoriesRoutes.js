import Router from "@koa/router";
import prisma from "../prisma.js";
const categoryRouter = new Router();
categoryRouter.post('/api/v1/good-categories/', async (ctx) => {
    const category = ctx.request.body;
    try {
        const newCategory = await prisma.goodCategory.create({
            data: {
                title: category.title,
                description: category.description,
                parentId: category.parentId ?? null
            }
        });
        ctx.body = newCategory;
    }
    catch (error) {
        console.error('Добавление категории:', error);
        ctx.status = 500;
        ctx.body = { error: 'Ошибка добавления категории' };
    }
});
categoryRouter.get('/api/v1/good-categories/:id', async (ctx) => {
    const id = parseInt(ctx.params.id);
    try {
        const category = await prisma.goodCategory.findUnique({
            where: { id }
        });
        ctx.body = category;
    }
    catch (error) {
        console.error('Поиск категории:', error);
        ctx.status = 500;
        ctx.body = { error: 'Ошибка поиска категории' };
    }
});
export default categoryRouter;
//# sourceMappingURL=categoriesRoutes.js.map