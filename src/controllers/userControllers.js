const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/index").User

// set superadmin
User.findByPk(process.env.SUPERADMIN_EMAIL).then((superadmin) => {
  if (!superadmin) {
    console.log("Superadmin not found")
  }
  else if (superadmin.admin_level !== 2) {
      superadmin.admin_level = 2
    superadmin.save()
    console.log("Superadmin set")
  }
  else {
    console.log("Superadmin already set")
  }
})

// signup
const signup = async (req, res) => {
  // check if mail_address is already used
  try {
  let user = await User.findOne({ where: { mail_address: req.body.mail_address } })
    if (user) {
      return res.status(401).json({ message: "Mail address already used" })
    }
  } catch (error) {
    return res.status(500).json({ message: error })
  }
  // check if username is already used
  try {
  let user = await User.findOne({ where: { username: req.body.username } })
    if (user) {
      return res.status(401).json({ message: "Username already used" })
    }
  } catch (error) {
    return res.status(500).json({ message: error })
  }
  console.log("User " + req.body.mail_address + " signed up")
  // hash password
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        mail_address: req.body.mail_address,
        username: req.body.username,
        password: hash,
        admin_level: 0,
        subscribed: req.body.subscribed,
      })
      user
        .save()
        .then(() => {return res.status(201).json({ message: "User created" })})
        .catch((error) => {return res.status(400).json({ message: error })})
    })
    .catch((error) => {return res.status(500).json({ message: error })})
}

// login
const login = async (req, res) => {
  try {
    await User.findOne({ where: { mail_address: req.body.mail_address } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "User not found" })
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ message: "Incorrect password" })
            }
            console.log("User " + user.mail_address + " logged in")
            res.status(200).json({
              userId: user.mail_address,
              token: jwt.sign(
                { userId: user.mail_address },
                process.env.JWT_SECRET,
                {
                  expiresIn: "24h",
                }
              ),
              user_admin_level: user.admin_level,
              user_mail_address: user.mail_address,
            })
          })
          .catch((error) => {return res.status(500).json({ message: error })})
      })
      .catch((error) => {return res.status(500).json({ message: error })})
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

// GET /users/:mail_address
const getUser = async (req, res) => {
  try {
    const mail_address = req.params.mail_address
    const sender = await User.findByPk(req.auth.userId)
    if((req.auth.userId !== mail_address) && sender.admin_level < 1){
      return res.status(403).json({ message: "Forbidden" })
    }
    const user = await User.findByPk(mail_address)
    if (user) {
      return res.status(200).json(user)
    }
    return res.status(404).json({ message: "User not found" })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// GET /users
const getUsers = async (req, res) => {
  try {
    let user = await User.findByPk(req.auth.userId)
    let user_admin_level = user.admin_level
    if (user_admin_level < 1) {
      return res.status(403).json({ message: "Forbidden" })
    }
    // get only mail_address, username and admin_level
    const users = await User.findAll({
      attributes: ["mail_address", "username", "admin_level"],
    })
    return res.status(200).json(users)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const sender = await User.findByPk(req.auth.userId)
    const sender_admin_level = sender.admin_level
    const mail_address = req.params.mail_address
    const user = await User.findByPk(mail_address)
    if (sender_admin_level < 1 && req.auth.userId !== user.mail_address) {
      return res.status(403).json({ message: "Forbidden" })
    }
    if (user) {
      await user.destroy()
      return res.status(200).json({ message: "User deleted" })
    }
    return res.status(404).json({ message: "User not found" })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const setAdmin = async (req, res) => {
  try {
    const sender = await User.findByPk(req.auth.userId)
    const sender_admin_level = sender.admin_level
    const mail_address = req.body.mail_address
    const user = await User.findByPk(mail_address)
    if (sender_admin_level < 1) {
      return res.status(403).json({ message: "Forbidden" })
    }
    if(user.admin_level === 2){
      return res.status(403).json({ message: "Forbidden" })
    }
    if (user) {
      await user.update({ admin_level: 1 })
      return res.status(200).json({ message: "User is now admin" })
    }
    return res.status(404).json({ message: "User not found" })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const unsetAdmin = async (req, res) => {
  try {
    const sender = await User.findByPk(req.auth.userId)
    const sender_admin_level = sender.admin_level
    const mail_address = req.body.mail_address
    const user = await User.findByPk(mail_address)
    if (sender_admin_level < 1) {
      return res.status(403).json({ message: "Forbidden" })
    }
    if (user.admin_level === 2) {
      return res.status(403).json({ message: "Forbidden" })
    }
    if (user) {
      await user.update({ admin_level: 0 })
      return res.status(200).json({ message: "User is no longer admin" })
    }
    return res.status(404).json({ message: "User not found" })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const subscribe = async (req, res) => {
  try {
    const mail_address = req.auth.userId
    const user = await User.findByPk(mail_address)
    if (user) {
      await user.update({ subscribed: true })
      return res.status(200).json({ message: "User is now subscribed" })
    }
    return res.status(404).json({ message: "User not found" })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const unsubscribe = async (req, res) => {
  try {
    const mail_address = req.auth.userId
    const user = await User.findByPk(mail_address)
    if (user) {
      await user.update({ subscribed: false })
      return res.status(200).json({ message: "User is no longer subscribed" })
    }
    return res.status(404).json({ message: "User not found" })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}


module.exports = { signup, login, getUser, getUsers, deleteUser, setAdmin, unsetAdmin, subscribe, unsubscribe }
