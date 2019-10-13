const { LinValidator, Rule } = require('../../core/lin-validator-v2');
const { User } = require('../models/user')
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要正整数', { min: 1 })
    ]
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [
      new Rule('isEmail', '不符合Email规范')
    ]
    this.password1 = [
      new Rule('isLength', '密码至少6个字符，最多32个字符', { min: 6, max: 32 }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]')
    ]
    this.password2 = this.password1
    this.nickname = [
      new Rule('isLength', '昵称不符合长度规范', { min: 4, max: 32 }),
    ]
  }
  // 自定义校验规则 必须以validate开头.
  validatePassword(vals) {
    const pwd1 = vals.body.password1
    const pwd2 = vals.body.password2
    if (pwd1 !== pwd2) {
      throw Error('两个密码必须相同')
    }
  }

  // 自定义校验email 唯一性
  async validateEmail(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: {
        email: email
      }
    })
    if (user) {
      throw Error('email已经存在')
    }
  }
}


module.exports = {
  PositiveIntegerValidator,
  RegisterValidator
}