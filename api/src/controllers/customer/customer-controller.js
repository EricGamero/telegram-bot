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

exports.findOne = async (req, res, next) => {
  try {
    const id = req.session.customer.id
    const data = await CustomerSQL.findByPk(id)

    if (!data) {
      const err = new Error()
      err.message = `No se puede encontrar el elemento con la id=${id}.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}
