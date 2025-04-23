// variable global con la ruta de index, el archivo donde se encuentra la variable
global.__basedir = __dirname
// se ejecuta primero el codigo dentro de app.js antes de seguir con el const PORT, en concreto
// variable app que transforma el server en api
const app = require('./src/app.js')
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT} `)
})
