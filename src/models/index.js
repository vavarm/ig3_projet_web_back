const sequelize = require("../config/database")
const User = require("./User")
const Event = require("./Event")
const Post = require("./Post")
const Lesson = require("./Lesson")
const Tag = require("./Tag")
const PostTag = require("./PostTag")
const LessonTag = require("./LessonTag")
const EventTag = require("./EventTag")

/* --------------------------- Define associations -------------------------- */
//POST written by USER
User.hasMany(Post, {
  foreignKey: "author_id",
})
//LESSON written by USER
User.hasMany(Lesson, {
  foreignKey: "author_id",
})
//EVENTS organized by USER
User.hasMany(Event, {
  foreignKey: "organizer_id",
})
//EVENTS registerd by USER
User.belongsToMany(Event, {
  through: "UserEvent",
  foreignKey: "user_mail_address",
})
Event.belongsToMany(User, {
  through: "UserEvent",
  foreignKey: "event_id",
})
//TAGS associated with POST
Post.belongsToMany(Tag, {
  through: "PostTag",
  foreignKey: "post_id",
})
Tag.belongsToMany(Post, {
  through: "PostTag",
  foreignKey: "tag_name",
})
//TAGS associated with LESSON
Lesson.belongsToMany(Tag, {
  through: "LessonTag",
  foreignKey: "lesson_id",
})
Tag.belongsToMany(Lesson, {
  through: "LessonTag",
  foreignKey: "tag_name",
})
//TAGS associated with EVENT
Event.belongsToMany(Tag, {
  through: "EventTag",
  foreignKey: "event_id",
})
Tag.belongsToMany(Event, {
  through: "EventTag",
  foreignKey: "tag_name",
})

/* ------------------------------- Sync tables ------------------------------ */
sequelize.sync({ alter: true }).then(() => {
  console.log("All tables synced")
})

module.exports = {
  User,
  Event,
  Post,
  Lesson,
  Tag,
  PostTag,
  LessonTag,
  EventTag,
}
