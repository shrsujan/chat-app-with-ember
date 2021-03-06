import fs from 'fs'
import Sequelize from 'sequelize'
import path from 'path'
import config from '../config/config.js'
const basename = path.basename(module.filename)
let db = {}
let sequelize = {}

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  sequelize = new Sequelize(config[process.env.NODE_ENV].database, config[process.env.NODE_ENV].username, config[process.env.NODE_ENV].password, {
    logging: false,
    host: config[process.env.NODE_ENV].host
  })
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
