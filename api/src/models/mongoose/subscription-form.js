module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      title: String,
      info: String,
      featured: String,
      start: String,
      instructions: String,
      buttonText: String,
      name: String,
      deletedAt: Date
    },
    { timestamps: true }
  )

  const SubscriptionForm = mongoose.model('SubscriptionForm', schema, 'subscription-forms')
  return SubscriptionForm
}
