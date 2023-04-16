const express = require("express")
const router = express.Router()

const { signup, login } = require("../controllers/userControllers")

router.post("/signup", async (req, res) => {
  await signup(req, res)
})

router.post("/login", async (req, res) => {
  await login(req, res)
})

module.exports = router
