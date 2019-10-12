const Sequelize = require('sequelize');
const { dbName, host, port, user, password } = require('../config/config').database;
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true,
  timezone: '+08:00',
  define: {
    // created_time update_time delete_time
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updateAt: 'update_at',
    deleteAt: 'delete_at',
    underscored: true
  } 
})

sequelize.sync()

module.exports = {
  sequelize
}
