const express = require("express");
const router = express.Router();

//here are importing the blogModel from the BlogSchema
//module, which is presumably a module that defines the schema and model for  blog posts in a web application
const blogModel = require("../../Models/BlogSchema");
const checkLogin = require("../../middlewares");
const { getAllBlogs, getBlogById } = require("../../container/BlogContainer");

//Routes

// Route to retrieve blog data on the home page

// Route to create a new blog post
router.post("/", checkLogin, async (req, res) => {
  const { title, content, author, imageUrl } = req.body;

  if (!title || !content) {
    return res.status(400).send("Title and content are required");
  }

  const newBlog = new blogModel({
    title,
    content,
    imageSource: "/image1.jpg",
    author: {
      name: author,
      createdAt: String,
    },
  });

  newBlog.save();

  res.redirect("/");
});

//this is showing a conflicting idea of using two get methods
// router.get("/", async (req, res) => {
//   try {

// Replace this with your actual logic to fetch blog posts from your database
// const blogPosts = await fetchBlogPosts(); // Implement your own function to fetch posts

// Construct the `locals` object with the `list` property
// const locals = {
// list: blogPosts, // Make sure this property name matches the one used in your template
// };

// Render the "home" template with the data
// res.render("home", locals);
// } catch (error) {
//     console.error(error);
//   }
// });

router.get("/:id", checkLogin, async (req, res) => {
  const blogId = req.params.id;

  const blog = await getBlogById(blogId);

  if (!blog) {
    return res.status(400).send("Blog is not found ");
  }
  res.render("layouts/post", { blog });
});

module.exports = router;
