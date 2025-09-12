module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      email: {
        type: String,
        unique: true,
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Customer = mongoose.model('Customer', schema, 'customers')
  return Customer
}
