const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");
class Auth {
  // static USER = 8
  // static ADMIN = 16
  // static SUPER_ADMIN = 32
  constructor(level) {
    // 实例属性 - 权限控制
    this.level = level || 1;
    // 类变量
    Auth.USER = 8;
    Auth.ADMIN = 16;
    Auth.SUPER_ADMIN = 32;
  }
  get m() {
    return async (ctx, next) => {
      const userToken = basicAuth(ctx.req);
      let errMsg = "token不合法";
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbbiden(errMsg);
      }
      try {
        var decode = jwt.verify(
          userToken.name,
          global.config.security.secretKey
        );
      } catch (error) {
        // token不合法
        // token过期
        if (error.name === "TokenExpiredError") {
          errMsg = "token已过期";
        }
        throw new global.errs.Forbbiden(errMsg);
      }
      if (decode.scope < this.level) {
        errMsg = "权限不足";
        throw new global.errs.Forbbiden(errMsg);
      }
      // uid scope
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      };
      await next();
    };
  }
  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = {
  Auth,
};
