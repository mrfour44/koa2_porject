const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class User extends Model {

}

User.init({
  // 主键 关系型数据库
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nickname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING(128),
    unique: true
  },
  password: Sequelize.STRING,
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  }
}, { sequelize, tableName: 'user'}) // tableName 设置表的名字

module.exports = {
  User
}