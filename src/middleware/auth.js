const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  console.log("auth.js: JWT_SECRET: " + process.env.JWT_SECRET)
  console.log("auth.js: token: " + req.cookies.token)
  try {
    const token = req.cookies.token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.userId
    req.auth = {
      userId: userId,
    }
    console.log("auth.js: " + req.auth.userId + " sent a request")
    next()
  } catch (error) {
    return res.status(401).json({ message: error })
  }
}
