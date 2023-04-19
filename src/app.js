// Import required dependencies
const express = require("express")
const helmet = require("helmet")

// Create an Express application
const app = express()

// Express or module-specific middlewares
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/posts", require("./routes/postRoutes"))
app.use("/tags", require("./routes/tagRoutes"))
app.use("/auth", require("./routes/userRoutes"))

app.get("/", (req, res) => {
  let uptimeObj = { uptime: process.uptime() }
  let uptimeStr = JSON.stringify(uptimeObj)
  res.status(200).send(uptimeStr)
})

module.exports = app
