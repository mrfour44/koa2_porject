const Router = require('koa-router')
const requireDirectory = require('require-directory');

class InitManager {
  static initCore(app) {
    // 入口方法
    InitManager.app = app
    InitManager.initLoadRouters();
    InitManager.loadHttpException();
    InitManager.loadConfig();
  }
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js';
    const config = require(configPath);
    global.config = config;
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
  // 把全部错误类都挂在在全局变量中 解决经常导入require的问题
  static loadHttpException() {
    const errors = require('./http-exception')
    global.errs = errors
  }
}

module.exports = InitManager;
