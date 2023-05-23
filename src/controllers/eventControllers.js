const Event = require("../models/index").Event
const User = require("../models/index").User
const Tag = require("../models/index").Tag
const EventTag = require("../models/index").EventTag
const UserEvent = require("../models/index").UserEvent

// GET /events

const getEvents = async (req, res) => {
    try {
        // get all events with tags associated in the table EventTag
        const events = await Event.findAll({
        include: [
            {
            model: Tag,
            through: {
                attributes: [],
            },
            },
        ],
        })
        return res.status(200).json(events)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// GET /events/:id

const getEvent = async (req, res) => {
    try {
        const id = req.params.id
        // get event with tags associated in the table EventTag
        const event = await Event.findByPk(id, {
        include: [
            {
            model: Tag,
            through: {
                attributes: [],
            },
            },
        ],
        })
        if (event) {
        return res.status(200).json(event)
        }
        return res.status(404).json({ message: "Event not found" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// POST /events

const createEvent = async (req, res) => {
    const data = {
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        duration: req.body.duration,
        location: req.body.location,
        postal_code: req.body.postal_code,
        city: req.body.city,
        price: req.body.price,
        max_participants: req.body.max_participants,
        organizer_id: req.auth.userId,
    }
    let tags = req.body.tags
    try {
        const event = await Event.create(data)
        if (tags) {
        tags.forEach(async (tag) => {
            const tagObj = await Tag.findByPk(tag)
            if (!tagObj) {
                await Tag.create({
                    name: tag,
                })
            }
                await EventTag.create({
                    event_id: event.id,
                    tag_name: tag,
                })
        })
        }
        return res.status(201).json(event)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// DELETE /events/:id

const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id
        const event = await Event.findByPk(id)
        const user = await User.findByPk(req.auth.userId)
        const user_admin_level = user.admin_level
        if ((user_admin_level < 1) && (req.auth.userId !== event.organizer_id)) {
        return res.status(403).json({ message: "Forbidden" })
        }
        if (event) {
        //delete all event_tags of the event
        const eventTags = await EventTag.findAll({
            where: {
            event_id: event.id,
            },
        })
        eventTags.forEach(async (eventTag) => {
            await eventTag.destroy()
        })
        await event.destroy()
        return res.status(200).json({ message: "Event deleted" })
        }
        return res.status(404).json({ message: "Event not found" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// register to an event

const registerEvent = async (req, res) => {
    try {
        const id = req.params.id
        const event = await Event.findByPk(id)
        if (!event) {
        return res.status(404).json({ message: "Event not found" })
        }
        const userEvent = await UserEvent.findOne({
        where: {
            user_mail_address: req.auth.userId,
            event_id: id,
        },
        })
        if (userEvent) {
        return res.status(409).json({ message: "User already registered" })
        }
        //get number of registered users
        const registeredUsers = await UserEvent.count({
        where: {
            event_id: id,
        },
        })
        //check if event is full
        if (registeredUsers >= event.max_participants) {
        return res.status(409).json({ message: "Event full" })
        }
        //register user
        const registered = await UserEvent.create({
        user_mail_address: req.auth.userId,
        event_id: id,
        })
        if (registered) {
        return res.status(200).json({ message: "User registered" })
        }
        return res.status(500).json({ message: "Error" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// unregister from an event

const unregisterEvent = async (req, res) => {
    try {
        const id = req.params.id
        const event = await Event.findByPk(id)
        if (!event) {
        return res.status(404).json({ message: "Event not found" })
        }
        const userEvent = await UserEvent.findOne({
        where: {
            user_mail_address: req.auth.userId,
            event_id: id,
        },
        })
        if (!userEvent) {
        return res.status(404).json({ message: "User not registered" })
        }
        const unregistered = await userEvent.destroy()
        if (unregistered) {
        return res.status(200).json({ message: "User unregistered" })
        }
        return res.status(500).json({ message: "Error" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getNumberOfRegisteredUsers = async (req, res) => {
    try {
        const id = req.params.id
        const event = await Event.findByPk(id)
        if (!event) {
        return res.status(404).json({ message: "Event not found" })
        }
        const registeredUsers = await UserEvent.count({
        where: {
            event_id: id,
        },
        })
        return res.status(200).json({ message: registeredUsers })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// GET /events/registered

const getRegisteredEvents = async (req, res) => {
    try {
        const userEvents = await UserEvent.findAll({
        where: {
            user_mail_address: req.auth.userId,
        },
        })
        return res.status(200).json(userEvents)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// GET /events/owned

const getOwnedEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
        where: {
            organizer_id: req.auth.userId,
        },
        })
        return res.status(200).json(events)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    deleteEvent,
    registerEvent,
    unregisterEvent,
    getNumberOfRegisteredUsers,
    getRegisteredEvents,
    getOwnedEvents,
}