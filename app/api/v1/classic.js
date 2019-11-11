const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/classic'
});
const { HttpException, ParameterException } =  require('../../../core/http-exception')
const { PositiveIntegerValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { ApiType } = require('../../lib/enum')
router.get('/latest', new Auth(ApiType.USER).m, async(ctx, next) => {
  // User 用户系统
  // 2部分 通用型 针对小程序
  // 账号 密码 附属信息：昵称 email 手机
  // 注册 登录


  // param - 地址参数
  // header - 请求头
  // query - 查询参数
  // body - body的参数
  // 权限 token 角色
  // 普通用户 管理员
  // 分级 scope
  // 8 - 普通用户 16 - 管理员
  ctx.body = ctx.auth.uid
})
module.exports = router;