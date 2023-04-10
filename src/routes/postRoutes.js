const express = require("express")
const router = express.Router()
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

router.post("/", async (req, res) => {
  await createPost(req, res)
})

router.put("/:id", async (req, res) => {
  await updatePost(req, res)
})

router.delete("/:id", async (req, res) => {
  await deletePost(req, res)
})

module.exports = router
