const Router = require('koa-router')
const router = new Router({
  // 前缀
  prefix: '/v1/user'
});
const { RegisterValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { success } = require('../../lib/helper')
// 注册
// 参数 编写LinValidator 校验参数
router.post('/register', async (ctx) => {
  const v = await new RegisterValidator().validate(ctx)
  // sequelize
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickname')
  }
  const r = await User.create(user)
  // throw new global.errs.Success()
  success()
})

module.exports = router