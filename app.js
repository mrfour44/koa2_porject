require("module-alias/register"); // 增加别名包。解决import 路径繁琐问题
const Koa = require("Koa");
const parser = require("koa-bodyparser");
const InitManager = require("./core/init");
const catchError = require("./middlewares/exception");

const app = new Koa();
app.use(parser());
app.use(catchError);
InitManager.initCore(app);

app.listen(3001);
