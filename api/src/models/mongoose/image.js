module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      fileName: String,
      isActive: {
        type: Boolean,
        default: true
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Image = mongoose.model('Image', schema, 'images')
  return Image
}
