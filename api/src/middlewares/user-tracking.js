const userTrackingMiddleware = async (req, res, next) => {
  next()
  if (req.ip !== '::1') {
    const userIp = req.ip.replace('::ffff:', '')
    const response = await fetch(`http://ip-api.com/json/${userIp}`)
    const data = await response.json()
    console.log(data)
  }
}

module.exports = userTrackingMiddleware
