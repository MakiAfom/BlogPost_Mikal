const blogModel = require("../Models/BlogSchema");

const getAllBlogs = async (req) => {
  let perPage = 10;
  let page = req.query.page || 1;

  // Calculate the number of pages and check for the next page
  const totalBlogs = await blogModel.countDocuments();
  const totalPages = Math.ceil(totalBlogs / perPage);
  const hasNextPage = page < totalPages;

  // Query for the blog data, sort by createdAt, and apply pagination
  const data = await blogModel
    .find()
    .sort({ createdAt: -1 })
    .skip(perPage * (page - 1))
    .limit(perPage);

  return {
    data: data,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: hasNextPage,
  };
};

const getBlogById = async (id) => {
  try {
    const blog = await blogModel.findById(id);
    return blog;
  } catch (err) {
    console.log(err);
  }
};

const searchBlogByTitle = async (searchTerm) => {
  const matchedBlogs = await blogModel.find({
    $or: [
      {
        title: { $regex: searchTerm, $options: `i` },
      },
      {
        content: { $regex: searchTerm, $options: `i` },
      },
    ],
  });
  console.log(matchedBlogs);
  return {
    data: matchedBlogs,
  };
};

module.exports = {
  getAllBlogs,
  getBlogById,
  searchBlogByTitle,
};
