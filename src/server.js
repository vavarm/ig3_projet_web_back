// import the required dependencies
const http = require("http")
if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv")
  const result = dotenv.config()
  console.log(".env file loaded")
  if (result.error) {
    throw result.error
  }
}
const app = require("./app")
const sequelize = require("./config/database")

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established")
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err)
  })

// pass the app object as the request listener (a function that is called whenever the server receives a request)
const server = http.createServer(app)

// set the port on which the server will listen for incoming requests
const port = process.env.PORT || 3000

// start the server and listen for incoming requests on the specified port
server.listen(port, () => {
  console.log(`Server is running and listening on port ${port}`)
  console.log(`http://localhost:${port}/`)
})
