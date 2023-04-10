const Post = require("./Post")

Post.sync({ alter: true }).then(() => {
  console.log("Post table created")
})

module.exports = {
  Post,
}
