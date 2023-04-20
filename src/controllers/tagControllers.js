const Tag = require("../models/index").Tag
const User = require("../models/index").User
const PostTag = require("../models/index").PostTag
const LessonTag = require("../models/index").LessonTag
const EventTag = require("../models/index").EventTag

// GET /tags

const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll()
    return res.status(200).json(tags)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// POST /tags

const createTag = async (req, res) => {
  const data = {
    name: req.body.name,
  }
  try {
    const tag = await Tag.create(data)
    return res.status(201).json(tag)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// DELETE /tags/:id

const deleteTag = async (req, res) => {
  try {
    const id = req.params.id
    const tag = await Tag.findByPk(id)
    const user = await User.findByPk(req.auth.userId)
    const user_admin_level = user.admin_level
    if (user_admin_level < 1) {
      return res.status(403).json({ error: "Forbidden" })
    }
    if (tag) {
      //delete tag from PostTag, EventTag, LessonTag
      const postTags = await PostTag.findAll({
        where: {
          tag_name: tag.name,
        },
      })
      postTags.forEach(async (postTag) => {
        await postTag.destroy()
      })
      const lessonTags = await LessonTag.findAll({
        where: {
          tag_name: tag.name,
        },
      })
      lessonTags.forEach(async (lessonTag) => {
        await lessonTag.destroy()
      })
      const eventTags = await EventTag.findAll({
        where: {
          tag_name: tag.name,
        },
      })
      eventTags.forEach(async (eventTag) => {
        await eventTag.destroy()
      })
      //delete tag
      await tag.destroy()
      return res.status(204).json({ message: "Tag deleted" })
    }
    return res.status(404).json({ error: "Tag not found" })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getTags,
  createTag,
  deleteTag,
}
