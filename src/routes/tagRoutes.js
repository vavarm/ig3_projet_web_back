const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")

const {
  getTags,
  createTag,
  deleteTag,
} = require("../controllers/tagControllers")

router.get("/", async (req, res) => {
  await getTags(req, res)
})

router.post("/", auth, async (req, res) => {
  await createTag(req, res)
})

router.delete("/:id", auth, async (req, res) => {
  await deleteTag(req, res)
})

module.exports = router
