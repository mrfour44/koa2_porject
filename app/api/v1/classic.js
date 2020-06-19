const Router = require("koa-router");
const { Flow } = require("@models/flow");
const { Art } = require("@models/art");
const { Favor } = require("@models/favor");
const router = new Router({
  prefix: "/v1/classic",
});
const {
  HttpException,
  ParameterException,
} = require("../../../core/http-exception");
const { PositiveIntegerValidator } = require("../../validators/validator");
const { Auth } = require("../../../middlewares/auth");
const { ApiType } = require("../../lib/enum");
router.get("/latest", new Auth(ApiType.USER).m, async (ctx, next) => {
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

  // 最新一期数据 index  = 1 2 max
  // 排序
  const flow = await Flow.findOne({
    order: [["index", "DESC"]],
  });
  const art = await Art.getData(flow.art_id, flow.type);
  const likeLatest = await Favor.userLikeIt(
    flow.art_id,
    flow.type,
    ctx.auth.uid
  );
  // art.dataValues.index = flow.index;
  // 直接挂在在art.index 上 不能返回到前端。 art是sequelize的一个模型。返回前端的是dataValues里面的内容 所以需要把index 挂载到dataValues
  art.setDataValue("index", flow.index);
  art.setDataValue("like_status", likeLatest);
  ctx.body = art;
});
// 获取下一期刊
router.get("/:index/next", new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "index",
  });
  const index = v.get("path.index");
  // 数据库查询 如果足够简单。可以写在路由中。如果业务查询复杂。需要写在models中
  const flow = await Flow.findOne({
    where: {
      index: index + 1,
    },
  });
  if (!flow) {
    throw new global.errs.NotFound();
  }
  const art = await Art.getData(flow.art_id, flow.type);
  const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
  art.setDataValue("index", flow.index);
  art.setDataValue("like_status", likeNext);
  ctx.body = art;
});
// 获取上一期刊
router.get("/:index/previous", new Auth().m, async (ctx) => {
  const v = new PositiveIntegerValidator().validate(ctx, {
    id: "index",
  });
  const index = v.get("path.index");
  const flow = await Flow.findOne({
    where: {
      index: index - 1,
    },
  });
  if (!flow) {
    throw new global.errs.NotFound();
  }
  const art = await Art.getData(flow.art_id, flow.type);
  const likePrevious = await Favor.userLikeIt(
    flow.art_id,
    flow.type,
    ctx.auth.uid
  );
  art.setDataValue("index", flow.index);
  art.setDataValue("like_status", likePrevious);
  ctx.body = art;
});
module.exports = router;
