const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/index").User

// signup
const signup = async (req, res) => {
  //TODO: check if mail_address and user are already used
  //TODO: send public hash key to front
  // check if mail_address is already used
  await User.findOne({ where: { mail_address: req.body.mail_address } })
    .then((user) => {
      if (user) {
        return res.status(401).json({ message: "Adresse mail déjà utilisée !" })
      }
    })
    .catch((error) => {return res.status(500).json({ message: error })})
  // check if username is already used
  await User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      if (user) {
        return res.status(401).json({ message: "Nom d'utilisateur déjà utilisé !" })
      }
    })
    .catch((error) => {return res.status(500).json({ message: error })})
  // hash password
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
        .then(() => {return res.status(201).json({ message: "Utilisateur créé !" })})
        .catch((error) => {return res.status(400).json({ message: error })})
    })
    .catch((error) => {return res.status(500).json({ message: error })})
}

// login
const login = async (req, res) => {
  //TODO: send public hash key to front
  try {
    await User.findOne({ where: { mail_address: req.body.mail_address } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Utilisateur non trouvé !" })
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ message: "Mot de passe incorrect !" })
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
          .catch((error) => {return res.status(500).json({ message: error })})
      })
      .catch((error) => {return res.status(500).json({ message: error })})
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

//TODO: function that sends public hash key to front

module.exports = { signup, login }
