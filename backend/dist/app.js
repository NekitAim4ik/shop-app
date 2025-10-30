import 'dotenv/config';
import Koa from 'koa';
import authRouter from './routes/authRoutes.js';
import { bodyParser } from '@koa/bodyparser';
import connectRedis from './services/redisService.js';
import categoryRouter from './routes/categoriesRoutes.js';
const app = new Koa();
const port = 3000;
app.use(bodyParser());
app
    .use(authRouter.routes())
    .use(authRouter.allowedMethods())
    .use(categoryRouter.routes())
    .use(categoryRouter.allowedMethods());
await connectRedis();
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
//# sourceMappingURL=app.js.map