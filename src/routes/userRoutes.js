const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")

const { signup, login, getUser, getUsers, deleteUser, setAdmin, unsetAdmin, suscribe, unsuscribe } = require("../controllers/userControllers")

router.post("/signup", async (req, res) => {
  await signup(req, res)
})

router.post("/login", async (req, res) => {
  await login(req, res)
})

router.get("/users/:mail_address", auth, async (req, res) => {
  await getUser(req, res)
})

router.get("/users", auth, async (req, res) => {
  await getUsers(req, res)
})

router.delete("/users/:mail_address", auth, async (req, res) => {
  await deleteUser(req, res)
})

router.put("/users/set-admin", auth, async (req, res) => {
  await setAdmin(req, res)
})

router.put("/users/unset-admin", auth, async (req, res) => {
  await unsetAdmin(req, res)
})

router.put("/users/suscribe", auth, async (req, res) => {
  await suscribe(req, res)
})

router.put("/users/unsuscribe", auth, async (req, res) => {
  await unsuscribe(req, res)
})

module.exports = router
