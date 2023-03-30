// Import required dependencies
const express = require("express")
const helmet = require("helmet")

// Create an Express application
const app = express()

// Express or module-specific middlewares
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  let uptimeObj = { uptime: process.uptime() }
  let uptimeStr = JSON.stringify(uptimeObj)
  res.send(uptimeStr)
})

module.exports = app
