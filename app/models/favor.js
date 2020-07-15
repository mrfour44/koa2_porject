const { sequelize } = require("../../core/db");
const { Sequelize, Model, Op } = require("sequelize");
const { Art } = require("./art");
class Favor extends Model {
  // 业务表
  // 点赞功能
  static async like(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      },
    });
    if (favor) {
      throw new global.errs.LikeError();
    }
    // sequelize 的transaction 事务。需要 return
    return sequelize.transaction(async (t) => {
      await Favor.create({ art_id, type, uid }, { transaction: t });
      const art = await Art.getData(art_id, type, false);
      await art.increment("fav_nums", { by: 1, transaction: t });
    });
  }
  // 取消点赞
  static async dislike(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      },
    });
    if (!favor) {
      throw new global.errs.DislikeError();
    }
    // Favor - 表  favor - 记录
    // sequelize 的transaction 事务。需要 return
    return sequelize.transaction(async (t) => {
      await favor.destroy({ force: false, transaction: t });
      const art = await Art.getData(art_id, type, false);
      // sequelize的坑，如果查询的时候用了scope，查询出来的记录进行decrement increment updated等操作的时候会出现sql错误
      // 所以Art模型的getData方法增加参数。来控制需不需要应用scope查询
      await art.decrement("fav_nums", { by: 1, transaction: t });
    });
  }
  static async userLikeIt(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        uid,
        art_id,
        type,
      },
    });
    return favor ? true : false;
  }
  static async getMyClassicFavors(uid) {
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          // type 剔除 400
          [Op.not]: 400,
        },
      },
    });
    if (!arts) {
      throw new global.errs.NotFound();
    }
    return await Art.getList(arts);
  }
}
Favor.init(
  {
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
  },
  {
    sequelize,
    tableName: "favor",
  }
);
module.exports = {
  Favor,
};
