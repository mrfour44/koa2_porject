const { LinValidator, Rule } = require("../../core/lin-validator-v2");
const { User } = require("../models/user");
const { LoginType, ArtType } = require("../lib/enum");
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule("isInt", "需要正整数", { min: 1 })];
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.email = [new Rule("isEmail", "不符合Email规范")];
    this.password1 = [
      new Rule("isLength", "密码至少6个字符，最多32个字符", {
        min: 6,
        max: 32,
      }),
      new Rule(
        "matches",
        "密码不符合规范",
        "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]"
      ),
    ];
    this.password2 = this.password1;
    this.nickname = [
      new Rule("isLength", "昵称不符合长度规范", { min: 4, max: 32 }),
    ];
  }
  // 自定义校验规则 必须以validate开头.
  validatePassword(vals) {
    const pwd1 = vals.body.password1;
    const pwd2 = vals.body.password2;
    if (pwd1 !== pwd2) {
      throw Error("两个密码必须相同");
    }
  }

  // 自定义校验email 唯一性
  async validateEmail(vals) {
    const email = vals.body.email;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      throw Error("email已经存在");
    }
  }
}

class TokenValidator extends LinValidator {
  constructor() {
    super();
    this.account = [
      new Rule("isLength", "不符合账号规则", {
        min: 4,
        max: 32,
      }),
    ];
    this.secret = [
      new Rule("isOptional"),
      new Rule("isLength", "至少6个字符", {
        min: 6,
        max: 128,
      }),
    ];
  }
  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error("type是必须参数");
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error("type参数不合法");
    }
  }
}
function checkType(vals) {
  let type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error("type是必须参数");
  }
  // 参数转型 可以保存在 parsed里面。也可以保存在parsed.default
  type = parseInt(type);
  if (!LoginType.isThisType(type)) {
    throw new Error("type参数不合法");
  }
}
function checkArtType(vals) {
  let type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error("type是必须参数");
  }
  // 参数转型 可以保存在 parsed里面。也可以保存在parsed.default
  type = parseInt(type);
  if (!ArtType.isThisType(type)) {
    throw new Error("type参数不合法");
  }
}
// 用类来封装checkType LoginType ArtType
class Checker {
  constructor(type) {
    this.enumType = type;
  }
  check(vals) {
    let type = vals.body.type || vals.path.type;
    if (!type) {
      throw new Error("type是必须参数");
    }
    // 参数转型 可以保存在 parsed里面。也可以保存在parsed.default
    type = parseInt(type);
    if (!this.enumType.isThisType(type)) {
      throw new Error("type参数不合法");
    }
  }
}
class NotEmptyValidator extends LinValidator {
  constructor() {
    super();
    this.token = new Rule("isLength", "不允许未空", { min: 1 });
  }
}
class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.validateType = checkArtType;
    // const checker = new Checker(ArtType);
    // 修改this的指向 - 会导致 没有了linValidator 的能力
    // this.validateType = checker.check.bind(checker);
  }
}
class ClassicValidator extends LikeValidator {}
module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  ClassicValidator,
};
