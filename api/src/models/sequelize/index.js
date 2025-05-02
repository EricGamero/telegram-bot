'use strict'

const fs = require('fs')
const Sequelize = require('sequelize')
const path = require('path')
const basename = path.basename(__filename)
const sequelizeDb = {}
// conecta con las configuraciones de entorno sequelize
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {

  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
  pool: {
    max: 5,
    // usuarios simultaneos a los que se puede servir
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// Desde const sequelize = new hasta  idle: 10000 se conecta a la base de datos  este bloque se conecta a la base de datos

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    )
  })
  // carga todos los modelos
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      // variable para que se pueda conectar a base datos
      sequelize,
      // le sirve para dar tipos a los campos
      Sequelize.DataTypes
    )
    // clave user (modelname)
    sequelizeDb[model.name] = model
  })

// Desde fs.readdirSync hasta sequelizeDb[model.name] carga los modelos de sequelize con el truco mirar todos los archivos dentro de la carpeta donde se encuentra index.js y filtrar

Object.keys(sequelizeDb).forEach(modelName => {
  if (sequelizeDb[modelName].associate) {
    sequelizeDb[modelName].associate(sequelizeDb)
  }
})

// Desde Object.keys(sequelizeDb) a sequelizeDb[modelName].associate(sequelizeDb) carga las relaciones que tienen los modelos de sequelize entre ellos igual que en las tablas

sequelizeDb.sequelize = sequelize
sequelizeDb.Sequelize = Sequelize

module.exports = sequelizeDb
// exporta index.js para ser utilizado por los controladores
