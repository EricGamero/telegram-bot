// controllers/customer/customers-controller.js (Mongoose)
const sequelizeDb = require('../../models/sequelize')
const CustomerSQL = sequelizeDb.Customer
const mongooseDb = require('../../models/mongoose')
const CustomerMongoose = mongooseDb.Customer

exports.create = async (req, res, next) => {
  try {
    console.log(req.body)
    const data = await CustomerSQL.create(req.body)
    await CustomerMongoose.create(req.body)

    res.status(200).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}
