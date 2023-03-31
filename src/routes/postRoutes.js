const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.status(200).send("post1, post2, post3")
})

router.get("/:id", (req, res) => {
  const { id } = req.params
  if (!id || isNaN(id)) {
    res.status(400).send("Please provide a valid id")
  }
  res.status(200).send(`Post with id: ${id}`)
})

router.post("/", (req, res) => {
  const { title, content } = req.body
  if (!title || !content) {
    res.status(400).send("Please provide both title and content")
  }
  res
    .status(201)
    .send(`Post created with title: ${title} and content: ${content}`)
})

router.put("/content/:id", (req, res) => {
  const { id } = req.params
  const { content } = req.body
  if (!id || isNaN(id) || !content) {
    res.status(400).send("Please provide a valid id and content")
  }
  res.status(200).send(`Post updated with id: ${id} with content: ${content}`)
})

router.delete("/:id", (req, res) => {
  const { id } = req.params
  if (!id || isNaN(id)) {
    res.status(400).send("Please provide a valid id")
  }
  res.status(200).send(`Post deleted with id: ${id}`)
})

module.exports = router
