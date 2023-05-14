const Post = require("../models/index").Post
const User = require("../models/index").User
const Tag = require("../models/index").Tag
const PostTag = require("../models/index").PostTag

// GET /posts

const getPosts = async (req, res) => {
  try {
    // get all posts with tags associated in the table PostTag
    const posts = await Post.findAll({
      include: [
        {
          model: Tag,
          through: {
            attributes: [],
          },
        },
      ],
    })
    return res.status(200).json(posts)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// GET /posts/:id

const getPost = async (req, res) => {
  try {
    const id = req.params.id
    // get post with tags associated in the table PostTag
    const post = await Post.findByPk(id, {
      include: [
        {
          model: Tag,
          through: {
            attributes: [],
          },
        },
      ],
    })
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
  let tags = req.body.tags
  try {
    const post = await Post.create(data)
    // for each tags: if a tag doesn't exist, create it and create post_tag
    if(tags){
      for(let i = 0; i < tags.length; i++) {
        const tag = await Tag.findByPk(tags[i])
        if (!tag) {
          const newTag = await Tag.create({name: tags[i]})
        }
          await PostTag.create({post_id: post.id, tag_name: tag.name})
      }
    }
    // send current post with tags associated in the table PostTag
    const postWithTags = await Post.findByPk(post.id, {
      include: [
        {
          model: Tag,
          through: {
            attributes: [],
          },
        },
      ],
    })
    return res.status(201).json(postWithTags)
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
  let tags = req.body.tags
  try {
    const id = req.params.id
    const user = await User.findByPk(req.auth.userId)
    const user_admin_level = user.admin_level
    const post = await Post.findByPk(id)
    if (user_admin_level < 1 && req.auth.userId !== post.author_id) {
      return res.status(403).json({ error: "Forbidden" })
    }
    // delete all post_tags of the post
    const postTags = await PostTag.findAll({
      where: {
        post_id: id,
      },
    })
    // for each tags: if a tag doesn't exist, create it and create post_tag
    if(tags){
      for(let i = 0; i < tags.length; i++) {
        const tag = await Tag.findByPk(tags[i])
        if (!tag) {
            const newTag = await Tag.create({name: tags[i]})
          console.log("new tag created: " + newTag.name)
        }
          let postTag = await PostTag.findOne({
            where: {
              post_id: id,
              tag_name: tag.name
            }
          })
          if(!postTag){
            await PostTag.create({post_id: post.id, tag_name: tag.name})
          }
      }
    }
    const updated = await Post.update(data, {
      where: { id: id },
    })
    if (updated) {
      // send current post with tags associated in the table PostTag
      const postWithTags = await Post.findByPk(id, {
        include: [
          {
            model: Tag,
            through: {
              attributes: [],
            },
          },
        ],
      })
      return res.status(200).json(postWithTags)
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
    // delete all post_tags of the post
    const postTags = await PostTag.findAll({
      where: {
        post_id: id,
      },
    })
    postTags.forEach(async (postTag) => {
      await postTag.destroy()
    })
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
