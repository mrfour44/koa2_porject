const Router = require('koa-router')
const router = new Router();
const { HttpException } =  require('../../../core/http-exception')

router.post('/v1/:id/classic/latest', async(ctx, next) => {
  // param - 地址参数
  // header - 请求头
  // query - 查询参数
  // body - body的参数
  const param = ctx.params;
  const header = ctx.request.header;
  const query = ctx.request.query;
  const body = ctx.request.body;
  if (true) {
    const error = new HttpException('为什么错误', 10001, 400);
    throw error;
  }
  ctx.body = {key: 'classic'};
})
module.exports = router;