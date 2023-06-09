// Import required dependencies
const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")

// Create an Express application
const app = express()

// Express or module-specific middlewares
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
}
app.use(cors(corsOptions))
app.use(helmet(
  {
    XFrameOptions: false
  }
))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Content-Security-Policy', `default-src 'self' ${process.env.CLIENT_URL}`)

  if (req.method === 'OPTIONS') {
    // Respond to preflight requests
    res.sendStatus(200);
  } else {
    next();
  }
})

// public folder
app.use(express.static(__dirname + '/../public'))
// Routes
app.use("/posts", require("./routes/postRoutes"))
app.use("/events", require("./routes/eventRoutes"))
app.use("/lessons", require("./routes/lessonRoutes"))
app.use("/tags", require("./routes/tagRoutes"))
app.use("/auth", require("./routes/userRoutes"))

app.get("/", (req, res) => {
  let uptimeObj = { uptime: process.uptime() }
  let uptimeStr = JSON.stringify(uptimeObj)
  res.status(200).send(uptimeStr)
})

module.exports = app
