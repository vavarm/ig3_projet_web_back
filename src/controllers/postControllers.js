const Post = require("../models/index").Post
const User = require("../models/index").User

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
    const id = req.params.id
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
  const data = {
    title: req.body.title,
    content: req.body.content,
    author_id: req.auth.userId,
  }
  try {
    const post = await Post.create(data)
    //TODO: for each tags: if a tag doesn't exist, create it and create post_tag
    return res.status(201).json(post)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// PUT /posts/:id

const updatePost = async (req, res) => {
  const data = {
    title: req.body.title,
    content: req.body.content,
  }
  try {
    const id = req.params.id
    const user = await User.findByPk(req.auth.userId)
    const user_admin_level = user.admin_level
    console.log(await User.findByPk(req.auth.userId))
    const post = await Post.findByPk(id)
    if (user_admin_level < 1 && req.auth.userId !== post.author_id) {
      return res.status(403).json({ error: "Forbidden" })
    }
    //TODO: for each tags: if a tag doesn't exist, create it and update post_tag (by creating or deleting)
    const updated = await Post.update(data, {
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
    const id = req.params.id
    const user = await User.findByPk(req.auth.userId)
    const user_admin_level = user.admin_level
    const post = await Post.findByPk(id)
    if (user_admin_level < 1 && req.auth.userId !== post.author_id) {
      return res.status(403).json({ error: "Forbidden" })
    }
    const deleted = await Post.destroy({
      where: { id: id },
    })
    //TODO: delete all post_tags
    if (deleted) {
      return res.status(200).json({ message: "Post deleted" })
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
