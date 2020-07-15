const { Op } = require("sequelize");
const { flatten } = require("lodash");
const { Movie, Music, Sentence } = require("./classic");
class Art {
  constructor(art_id, type) {
    this.art_id = art_id;
    this.type = type;
  }
  // 类的实例方法
  async getDetail(uid) {
    const art = await Art.getData(this.art_id, this.type);
    if (!art) {
      throw new global.errs.NotFound();
    }
    const { Favor } = require("./favor");
    const like = await Favor.userLikeIt(this.art_id, this.type, uid);
    return {
      art,
      like_status: like,
    };
  }
  static async getList(artInfoList) {
    // artInfoList art的基本信息
    // in [ids]
    // 3种类型的art
    const artInfoObj = {
      100: [],
      200: [],
      300: [],
    };
    for (let artInfo of artInfoList) {
      // 不需要swich case 和 if来判断
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    const arts = [];
    for (let key in artInfoObj) {
      const ids = artInfoObj[key];
      if (ids.length === 0) {
        // 跳出这次循环 进行下一次循环 用continue
        continue;
      }
      key = parseInt(key);
      arts.push(await Art._getListByType(ids, key));
    }
    // [[], [], []] 二维数组展平一维数组 - flatten
    return flatten(arts);
  }
  static async _getListByType(ids, type) {
    let arts = [];
    const finder = {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    };
    const scope = "bh";
    switch (type) {
      case 100:
        arts = await Movie.scope(scope).findOne(finder);
        break;
      case 200:
        arts = await Music.scope(scope).findOne(finder);
        break;
      case 300:
        arts = await Sentence.scope(scope).findOne(finder);
        break;
      case 400:
        break;
      default:
        break;
    }
    return arts;
  }
  static async getData(art_id, type, useScope = true) {
    let art = null;
    const finder = {
      where: {
        id: art_id,
      },
    };
    const scope = useScope ? "bh" : null;
    switch (type) {
      case 100:
        art = await Movie.scope(scope).findOne(finder);
        break;
      case 200:
        art = await Music.scope(scope).findOne(finder);
        break;
      case 300:
        art = await Sentence.scope(scope).findOne(finder);
        break;
      case 400:
        break;
      default:
        break;
    }
    return art;
  }
}

module.exports = {
  Art,
};
