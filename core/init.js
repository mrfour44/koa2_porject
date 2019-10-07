const Router = require('koa-router')
const requireDirectory = require('require-directory');

class InitManager {
  static initCore(app) {
    // 入口方法
    InitManager.app = app
    InitManager.initLoadRouters();
  }
  static initLoadRouters() {
    // 自动加载路由模块 process.cwd() 项目地址
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        // 自动注册路由模块
        InitManager.app.use(obj.routes());
      }
    }
  }
}

module.exports = InitManager;
