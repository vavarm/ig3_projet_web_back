const Post = require("../models/index").Post

// GET /posts

const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll()
    return res.status(200).json(posts)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// GET /posts/:id

const getPost = async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findByPk(id)
    if (post) {
      return res.status(200).json(post)
    }
    return res.status(404).json({ error: "Post not found" })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// POST /posts

const createPost = async (req, res) => {
  const data = req.body.data
  try {
    const post = await Post.create(data)
    return res.status(201).json(post)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// PUT /posts/:id

const updatePost = async (req, res) => {
  const data = req.body.data
  try {
    const { id } = req.params
    const [updated] = await Post.update(data, {
      where: { id: id },
    })
    if (updated) {
      const updatedPost = await Post.findByPk(id)
      return res.status(200).json(updatedPost)
    }
    return res.status(404).json({ error: "Post not found" })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// DELETE /posts/:id

const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Post.destroy({
      where: { id: id },
    })
    if (deleted) {
      return res.status(204).json({ message: "Post deleted" })
    }
    return res.status(404).json({ error: "Post not found" })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
}
