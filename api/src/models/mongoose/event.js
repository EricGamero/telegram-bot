module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      promotorId: Number,
      townId: Number,
      spotId: Number,
      categoryId: Number,
      title: String,
      description: String,
      isActive: {
        type: Boolean,
        default: true
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Customer = mongoose.model('Customer', schema, 'customers')
  return Customer
}
