const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")

const { signup, login, getUsers } = require("../controllers/userControllers")

router.post("/signup", async (req, res) => {
  await signup(req, res)
})

router.post("/login", async (req, res) => {
  await login(req, res)
})

router.get("/users", auth, async (req, res) => {
  await getUsers(req, res)
})

module.exports = router
