const express = require("express");

const routes = express.Router();

//routes for creating a blog post from user
routes.post("/create", async (req, res) => {
  try {
    //Get the blog post data from the request body
    const { title, content, author } = req.body;

    //create a new blog post using my model
    const newBlogPost = new BlogModel({
      title,
      content,
      author,
    });

    //save blog post to db
    res.redirect("/success");
  } catch (error) {
    res.render("error", { error: error });
  }
});

routes.get("/:id", (req, res) => {
  const articleId = req.params.id; // Extract the 'id' from the URL
  if (articleId) {
    // Look up the article with the provided ID in your data source (e.g., database)
    const article = findArticleById(articleId);

    if (article) {
      // If the article is found, respond with its details
      res.send(`Article Title: ${article.title}, Content: ${article.content}`);
    } else {
      // If the article is not found, respond with an error message or 404 Not Found
      res.status(404).send("Article not found");
    }
  } else {
    // Handle the case where 'id' is not provide
    res.status(400).send("Bad request: Missing article ID");
  }
});

// routes.get("/", (req, res) => {
//   res.send("hello world");
// });

// // routes.get("/:id", (req, res) => {
// //   if (req.params.id) {
// //   } else {
// //   }
// // });

// routes.post("/", (req, res) => {
//   // creating users
// });

// routes.delete("/", (req, res) => {
//   // to remove a user
// });

// routes.put("/", (req, res) => {
//   // update user
// });

module.exports = routes;
