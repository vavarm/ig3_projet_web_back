const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')

const {
    getEvents,
    getEvent,
    createEvent,
    deleteEvent,
    registerEvent,
    unregisterEvent,
    getNumberOfRegisteredUsers,
    getRegisteredEvents,
    getOwnedEvents,
} = require('../controllers/eventControllers')

router.get('/', async (req, res) => {
    await getEvents(req, res)
})

router.get('/:id', async (req, res) => {
    await getEvent(req, res)
})

router.post('/', auth, async (req, res) => {
    await createEvent(req, res)
})

router.put('/:id', auth, async (req, res) => {
    await updateEvent(req, res)
})

router.delete('/:id', auth, async (req, res) => {
    await deleteEvent(req, res)
})

router.post('/register/:id', auth, async (req, res) => {
    await registerEvent(req, res)
})

router.post('/unregister/:id', auth, async (req, res) => {
    await unregisterEvent(req, res)
})

router.get('/nbregistered/:id', auth, async (req, res) => {
    await getNumberOfRegisteredUsers(req, res)
})

router.get('/users/registered', auth, async (req, res) => {
    await getRegisteredEvents(req, res)
})

router.get('/users/owned', auth, async (req, res) => {
    await getOwnedEvents(req, res)
})

module.exports = router