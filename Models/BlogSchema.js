const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageSource: {
    type :String
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    name: String,
    userID: String,
    imageSource: String,
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
