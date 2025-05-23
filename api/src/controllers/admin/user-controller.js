exports.create = (req, res) => {
  console.log(req.body)
  res.send('POST request to the homepage')
}

exports.findAll = (req, res) => {
  console.log(req.userLanguage)
  res.send('GET request to the homepage')
}

exports.findOne = (req, res) => {
  console.log(req.params.id)
  res.send('GET request to the homepage')
}

exports.update = (req, res) => {
  console.log(req.params.id)
  console.log(req.body)
  res.send('PUT request to the homepage')
}

exports.delete = (req, res) => {
  console.log(req.params.id)
  res.send('DELETE request to the homepage')
}
