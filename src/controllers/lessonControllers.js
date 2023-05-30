const Lesson = require("../models/index").Lesson
const User = require("../models/index").User
const Tag = require("../models/index").Tag
const LessonTag = require("../models/index").LessonTag
const fs = require("fs")

// GET /lessons

const getLessons = async (req, res) => {
    try {
        // get all lessons with tags associated in the table LessonTag
        const lessons = await Lesson.findAll({
        include: [
            {
            model: Tag,
            through: {
                attributes: [],
            },
            },
        ],
        })
        return res.status(200).json(lessons)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// GET /lessons/:id

const getLesson = async (req, res) => {
    try {
        const id = req.params.id
        // get lesson with tags associated in the table LessonTag
        const lesson = await Lesson.findByPk(id, {
        include: [
            {
            model: Tag,
            through: {
                attributes: [],
            },
            },
        ],
        })
        if (lesson) {
        return res.status(200).json(lesson)
        }
        return res.status(404).json({ message: "Lesson not found" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// POST /lessons

const createLesson = async (req, res) => {
    const data = {
        name: req.body.name,
        description: req.body.description,
        author_id: req.auth.userId,
    }
    let tags = req.body.tags
    try {
        // create lesson
        const lesson = await Lesson.create(data)
        if (!lesson) {
            return res.status(400).json({ message: "Bad request" })
        }
        console.log("Lesson created: ", lesson)
        // for each tags: if a tag doesn't exist, create it and create lesson_tag
        if(tags) {
            tags.forEach(async (tag) => {
                const foundTag = await Tag.findByPk(tag)
                if (!foundTag) {
                    const newTag = await Tag.create({ name: tag })
                }
                await LessonTag.create({
                    lesson_id: lesson.id,
                    tag_name: tag,
                })
            })
        }
        // send current lesson with tags associated in the table LessonTag
        const lessonWithTags = await Lesson.findByPk(lesson.id, {
            include: [
                {
                model: Tag,
                through: {
                    attributes: [],
                },
                },
            ],
        })
        return res.status(201).json(lessonWithTags)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// POST /lessons/upload/:id

const uploadLesson = async (req, res) => {
    try {
        const id = req.params.id
        const file = req.file
        if (!file) {
            return res.status(400).json({ message: "Please upload a file" })
        }
        // get the temporary file name
        const tempFileName = file.filename
        // verify if the file is a pdf
        if (!tempFileName.endsWith(".pdf")) {
            return res.status(400).json({ message: "Please upload a pdf file" })
        }
        const newName = `${id}.pdf`
        // rename the file
        fs.renameSync(`./public/${tempFileName}`, `./public/${newName}`)
        return res.status(200).json({ message: "File uploaded" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


// DELETE /lessons/:id

const deleteLesson = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByPk(req.auth.userId)
        const user_admin_level = user.admin_level
        const lesson = await Lesson.findByPk(id)
        if(!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }
        if(user_admin_level < 1 && req.auth.userId !== lesson.author_id) {
            return res.status(403).json({ message: "Forbidden" })
        }
        //delete all lesson_tags  of the lesson
        await LessonTag.destroy({
            where: { lesson_id: id },
        })
        // delete lesson
        const deleted = await Lesson.destroy({
            where: { id: id },
        })
        const path = `./public/${id}.pdf`
        // delete the file associated to the lesson (<lesson_id>.pdf)
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err)
                return
            } else {
                console.log("File deleted successfully")
            }
        })
        if (deleted) {
            return res.status(204).json({ message: "Lesson deleted" })
        }
        return res.status(404).json({ message: "Lesson not found" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports = {
    getLessons,
    getLesson,
    createLesson,
    uploadLesson,
    deleteLesson,
}