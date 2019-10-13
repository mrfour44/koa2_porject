const Sequelize = require('sequelize');
const { dbName, host, port, user, password } = require('../config/config').database;
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true,
  timezone: '+08:00',
  define: { // 自定义表
    // created_time update_time delete_time
    timestamps: true, // 添加createdAt updateAt
    paranoid: true, // 添加 deleteAt 字段
    createdAt: 'created_at', // 改createdAt
    updateAt: 'update_at', // 改updateAt
    deleteAt: 'delete_at', // 改deleteAt
    underscored: true // 字段默认使用驼峰 underscored使用 ‘ - ’ 链接
  } 
})

// sequelize.sync({
//   force: true   // 表添加字段 会重新删点旧的表 重新创建新的表
// })
sequelize.sync()

module.exports = {
  sequelize
}
