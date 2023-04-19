const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postControllers")

router.get("/", async (req, res) => {
  await getPosts(req, res)
})

router.get("/:id", async (req, res) => {
  await getPost(req, res)
})

router.post("/", auth, async (req, res) => {
  await createPost(req, res)
})

router.put("/:id", auth, async (req, res) => {
  await updatePost(req, res)
})

router.delete("/:id", auth, async (req, res) => {
  await deletePost(req, res)
})

module.exports = router
