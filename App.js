// const express = require("express");
// require("dotenv").config();
// const Joi = require("joi");

// const path = require("path");
// const app = express();
// const port = 5000 || process.env.port;

// const bodyParser = require("body-parser");
// const session = require("express-session");
// const expressLayouts = require("express-ejs-layouts");
// const bcrypt = require("bcrypt");
// const connectDB = require("./Server/configuration/db.js");
// const MongoStore = require("connect-mongo");

// app.use(bodyParser.urlencoded({ extended: true }));
// const userModel = require("./Models/UserSchema");
// const BlogModel = require("./Models/BlogSchema");
// const userRoutes = require("./Server/Routes/userRoutes");
// const blogRoutes = require("./Server/Routes/blogRoutes");
// const {
//   getAllBlogs,
//   searchBlogByTitle,
// } = require("./container/BlogContainer.js");
// const { start } = require("repl");
// //db connection
// connectDB();

// app.use(express.static("public"));

// // Express Configuration
// app.set("view engine", "ejs"); // set my view engine to ejs

// // app.use(expressLayouts); //use express layout midde ware

// // app.set("Server", "./Routes/main");

// app.use(
//   session({
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
//     secret: process.env.SESSION_SECRET || "defaultSecret",
//   })
// );
// // app.get("/", (req, res) => {
// //   var loggedin = false;
// //   if (req.session) {
// //     loggedin = true;
// //   }
// //   res.render("layouts/home", { loggedin: loggedin });
// // });

// // app.get("/register", (req, res) => {
// //   res.render("register");
// // });
// // app.get("/registeredit", (req, res) => {
// //   // get data base
// //   res.render("register", { formData: { name: "asier", email: "bla@gm.com" } });
// // });
// app.use("/blogs", require("./Server/Routes/blogRoutes"));
// app.use("/user", require("./Server/Routes/userRoutes"));

// app.post("/search", async (req, res) => {
//   const { searchTerm } = req.body;
//   const matched = await searchBlogByTitle(searchTerm);
//   const data = { isLoggedIn: req.session.userId ? true : false, ...matched };
//   console.log(data, searchTerm);
//   res.render("layouts/home", data);
// });

// app.get("/", async (req, res) => {
//   const allBlogs = await getAllBlogs(req, res);
//   const data = { isLoggedIn: req.session.userId ? true : false, ...allBlogs };

//   try {
//     res.render("layouts/home", data);
//   } catch (error) {
//     console.error(error);
//     //res.render("error", { error });
//   }
// });

// app.get("/login", (req, res) => {
//   res.render("layouts/login");
// });
// app.get("/register", (req, res) => {
//   res.render("layouts/register");
// });
// app.post("/register", async (req, res) => {
//   const user = new userModel(req.body);

//   if (!user.avatar) {
//     user.avatar = "/image1.jpg";
//   }
//   user.password = await bcrypt.hash(user.password, 10);

//   user.save();

//   res.render("layouts/login");
// });

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const schema = Joi.object({
//     email: Joi.string()
//       .email({
//         minDomainSegments: 2,
//         tlds: { allow: ["com", "net"] },
//       })
//       .required(),
//     password: Joi.string()
//       // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
//       .required(),
//   });

//   try {
//     const value = await schema.validateAsync({
//       email: email,
//       password: password,
//     });
//   } catch (err) {
//     return res.status(400).send(err.details[0].message);
//   }

//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return res.status(400).send("User not found");
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   // await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).send("Incorrect password");
//   }

//   req.session.userId = { id: user.id, name: user.name };
//   res.redirect("/");
//   // const { data, page, totalPages, hasNextPage } = await getAllBlogs(req, res);
//   // res.render("layouts/home", {
//   //   data,
//   //   currentPage: page,
//   //   totalPages,
//   //   hasNextPage,
//   //   isLoggedIn: true,
//   // });
// });
// app.get("/createPost", (req, res) => {
//   res.render("layouts/createpost");
// });
// app.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Error destroying the session", err);
//       return res.status(500).send("Error logging out");
//     }
//     res.clearCookie("connect.sid");
//     res.redirect("/");
//   });
// });

// // Server
// app.listen(port, () => {
//   console.log("Server is running on http://localhost:" + port);
// });

// Import necessary modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const MongoStore = require("connect-mongo");
const uuidv4 = require("uuid").v4;
const {
  getAllBlogs,
  searchBlogByTitle,
} = require("./container/BlogContainer.js");
const userModel = require("./Models/UserSchema");
const connectDB = require("./Server/configuration/db.js");

// Load environment variables from .env file
require("dotenv").config();

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Express Configuration
app.set("view engine", "ejs");

// Session configuration
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    secret: process.env.SESSION_SECRET || "defaultSecret",
  })
);

// Routes

// Serve blog-related routes
app.use("/blogs", require("./Server/Routes/blogRoutes"));

// Serve user-related routes
app.use("/user", require("./Server/Routes/userRoutes"));

// Search endpoint
app.post("/search", async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const matched = await searchBlogByTitle(searchTerm);
    const data = { isLoggedIn: req.session.userId ? true : false, ...matched };
    console.log(data, searchTerm);
    res.render("layouts/home", data);
  } catch (error) {
    console.error(error);
    // Handle the error appropriately (e.g., render an error page)
    res.status(500).send("Internal Server Error");
  }
});

// Home endpoint
app.get("/", async (req, res) => {
  try {
    const allBlogs = await getAllBlogs(req, res);
    const data = { isLoggedIn: req.session.userId ? true : false, ...allBlogs };
    res.render("layouts/home", data);
  } catch (error) {
    console.error(error);
    // Handle the error appropriately (e.g., render an error page)
    res.status(500).send("Internal Server Error");
  }
});

// Login endpoint
app.get("/login", (req, res) => {
  res.render("layouts/login");
});

// Register endpoint
app.get("/register", (req, res) => {
  res.render("layouts/register");
});

app.post("/register", async (req, res) => {
  try {
    const user = new userModel(req.body);
    if (!user.avatar) {
      user.avatar = "/image1.jpg";
    }
    user.password = await bcrypt.hash(user.password, 10);
    user.save();
    res.render("layouts/login");
  } catch (error) {
    console.error(error);
    // Handle the error appropriately (e.g., render an error page)
    res.status(500).send("Internal Server Error");
  }
});

// Login POST endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string().required(),
    });

    const value = await schema.validateAsync({ email, password });

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Incorrect password");
    }

    req.session.userId = { id: user.id, name: user.name };
    res.redirect("/");
  } catch (err) {
    console.error(err);
    // Handle the validation error appropriately (e.g., render an error page)
    res.status(400).send(err.details[0].message);
  }
});

// Create Post endpoint
app.get("/createPost", (req, res) => {
  res.render("layouts/createpost");
});

// Logout endpoint

//session

app.use(express.json());
const sessions = {};
app.post("/login", async (req, res) => {
  const { username, password } = reeq.body;

  if (username !== "admin" || password !== "admin") {
    return res.status(401).send("invalid user name");
  }
  const sessionId = uuidv4();
  sessions[sessionId] = { username, userId: 1 };
  res.set("set-cookie", `session=${sessionId}`);
  res.send("sucess");
});
app.get("/register", (req, res) => {
  const sessionId = req.headers.cookie?.split("=")[1];
  const userSession = sessions[sessionId];
  if (!userSession) {
    return res.status(401).send("invalid session");
  }
  const userId = userSession.userId;
  res.send([
    {
      id: 1,
      title: "me",
      userId,
    },
  ]);
});

app.post("/logout", (req, res) => {
  const sessionId = req.headers.cookie?.split("=")[1];
  delete sessions[sessionId];
  res.set("Set-Cookie", "session=; expires=Thu, 01 Dec 2023 00:00:00 GMT");
  res.send("sucess");
});
