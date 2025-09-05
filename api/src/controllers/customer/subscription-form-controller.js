const mongooseDb = require('../../models/mongoose')
const SubscriptionForm = mongooseDb.SubscriptionForm

exports.findOne = async (req, res, next) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement.name = req.params.name

    const response = await SubscriptionForm.findOne(whereStatement)
      .lean()
      .exec()

    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
