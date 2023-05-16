const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")

const { signup, login, getUsers, deleteUser, setAdmin, unsetAdmin } = require("../controllers/userControllers")

router.post("/signup", async (req, res) => {
  await signup(req, res)
})

router.post("/login", async (req, res) => {
  await login(req, res)
})

router.get("/users", auth, async (req, res) => {
  await getUsers(req, res)
})

router.delete("/users/:mail_address", auth, async (req, res) => {
  await deleteUser(req, res)
})

router.put("/users/set-admin", auth, async (req, res) => {
  console.log("set-admin")
  await setAdmin(req, res)
})

router.put("/users/unset-admin", auth, async (req, res) => {
  console.log("unset-admin")
  await unsetAdmin(req, res)
})

module.exports = router
