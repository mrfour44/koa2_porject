const bcrypt = require("bcryptjs");
const { sequelize } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");

class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new global.errs.AuthFailed("用户不存在");
    }
    const correct = bcrypt.compareSync(plainPassword, user.password);
    if (!correct) {
      throw new global.errs.AuthFailed("密码不正确");
    }
    return user;
  }
  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid,
      },
    });
    return user;
  }
  static async registerByOpenid(openid) {
    return await User.create({
      openid,
    });
  }
}

User.init(
  {
    // 主键 关系型数据库
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nickname: Sequelize.STRING,
    email: {
      type: Sequelize.STRING(128),
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      set(val) {
        const salt = bcrypt.genSaltSync(10);
        const pwd = bcrypt.hashSync(val, salt);
        this.setDataValue("password", pwd);
      },
    },
    openid: {
      type: Sequelize.STRING(64),
      unique: true,
    },
  },
  { sequelize, tableName: "user" }
); // tableName 设置表的名字

module.exports = {
  User,
};
