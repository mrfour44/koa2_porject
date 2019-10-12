const Router = require('koa-router')
const router = new Router();
const { HttpException, ParameterException } =  require('../../../core/http-exception')
const { PositiveIntegerValidator } = require('../../validators/validator')

router.post('/v1/:id/classic/latest', async(ctx, next) => {
  // param - 地址参数
  // header - 请求头
  // query - 查询参数
  // body - body的参数
  const path = ctx.params;
  const header = ctx.request.header;
  const query = ctx.request.query;
  const body = ctx.request.body;

  const v = new PositiveIntegerValidator().validate(ctx);
  // const id = v.get('path.id', parsed=false)  ---参数parsed = false 不设置LinValidator 自动把参数转为整型
  const id = v.get('path.id')
  ctx.body = {
    id
  }
})
module.exports = router;