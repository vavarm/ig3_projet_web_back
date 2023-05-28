const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})
//fileFilter to allow only pdf files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: 1024 * 1024 * 20, // 20MB
})

const {
    getLessons,
    getLesson,
    createLesson,
    deleteLesson,
} = require('../controllers/lessonControllers')

router.get('/', async (req, res) => {
    await getLessons(req, res)
})

router.get('/:id', async (req, res) => {
    await getLesson(req, res)
})

router.post('/', auth, upload.single('file'), async (req, res) => {
    await createLesson(req, res)
})

router.delete('/:id', auth, async (req, res) => {
    await deleteLesson(req, res)
})

module.exports = router