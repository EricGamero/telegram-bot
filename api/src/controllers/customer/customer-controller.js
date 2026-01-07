// controllers/customer/customers-controller.js (Mongoose)
const sequelizeDb = require('../../models/sequelize')
const CustomerSQL = sequelizeDb.Customer

exports.create = async (req, res, next) => {
  try {
    console.log(req.body)
    const data = await CustomerSQL.create(req.body)
    req.redisClient.publish('new-customer', JSON.stringify(data))

    res.status(200).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}
