const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/index").User

// signup
const signup = async (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        mail_address: req.body.mail_address,
        username: req.body.username,
        password: hash,
        admin_level: 0,
        suscribed: req.body.suscribed,
      })
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

// login
const login = async (req, res) => {
  try {
    await User.findOne({ where: { mail_address: req.body.mail_address } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé !" })
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect !" })
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
            })
          })
          .catch((error) => res.status(500).json({ error }))
      })
      .catch((error) => res.status(500).json({ error }))
  } catch (error) {
    res.status(500).json({ error })
  }
}

module.exports = { signup, login }
