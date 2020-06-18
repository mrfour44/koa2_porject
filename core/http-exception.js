class HttpException extends Error {
  constructor(msg = "服务器错误", errorCode = 10000, code = 400) {
    super();
    this.msg = msg;
    this.errorCode = errorCode;
    this.code = code;
  }
}

class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 400;
    this.msg = msg || "参数错误";
    this.errorCode = errorCode || 10000;
  }
}

class Success extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 201;
    this.msg = msg || "ok";
    this.errorCode = errorCode || 0;
  }
}

class NotFound extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 404;
    this.msg = msg || "资源没找到";
    this.errorCode = errorCode || 10000;
  }
}

class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 401;
    this.msg = msg || "授权失败";
    this.errorCode = errorCode || 10004;
  }
}

class Forbbiden extends HttpException {
  constructor(msg, errorCode) {
    super();
    this.code = 403;
    this.msg = msg || "禁止访问";
    this.errorCode = errorCode || 10006;
  }
}

class LikeError extends HttpException {
  constructor() {
    super();
    this.code = 400;
    this.msg = "您已经点过赞了";
    this.error_code = 60001;
  }
}
class DislikeError extends HttpException {
  constructor() {
    super();
    this.code = 400;
    this.msg = "您已取消点赞";
    this.error_code = 60002;
  }
}
module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbbiden,
  LikeError,
  DislikeError,
};
