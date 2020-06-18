const util = require("util");
const axios = require("axios");
const { User } = require("../models/user");
const { Auth } = require("../../middlewares/auth");
const { generateToken } = require("../../core/util");
class WXManager {
  static async codeToToken(code) {
    // code 小程序生成 微信
    // openid 唯一标识 鉴定
    // code appid appsecret url
    const url = util.format(
      global.config.wx.loginUrl,
      global.config.wx.appId,
      global.config.wx.appSecret,
      code
    );
    const result = await axios.get(url);
    if (result.status !== 200) {
      throw new global.errs.AuthFailed("openid获取失败");
    }
    const errcode = result.data.errcode;
    const errmsg = result.data.errmsg;
    // 如果正常的话，微信不会返回errcode
    if (errcode) {
      throw new global.errs.AuthFailed("openid获取失败" + errmsg);
    }
    // openid
    let user = await User.getUserByOpenid(result.data.openid);
    if (!user) {
      user = await User.registerByOpenid(result.data.openid);
    }
    return generateToken(user.id, Auth.USER);
  }
}
module.exports = {
  WXManager,
};
