const Router = require('koa-router')
const router = new Router();

router.post('/v1/:id/classic/latest', async(ctx, next) => {
  // param - 地址参数
  // header - 请求头
  // query - 查询参数
  // body - body的参数
  const param = ctx.params;
  const header = ctx.request.header;
  const query = ctx.request.query;
  const body = ctx.request.body;
  ctx.body = {key: 'classic'};
})
module.exports = router;