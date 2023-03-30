// import the required dependencies
const https = require("https")
const app = require("./app")
const fs = require("fs")

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
}

// pass the app object as the request listener (a function that is called whenever the server receives a request)
const server = https.createServer(options, app)

// set the port on which the server will listen for incoming requests
const port = process.env.PORT || 3000

// start the server and listen for incoming requests on the specified port
server.listen(port, () => {
  console.log(`Server is running and listening on port ${port}`)
  console.log(`https://localhost:${port}`)
})
