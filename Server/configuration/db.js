const mongoose = require('mongoose');

const connectDb = async () => {
  
  try {
    mongoose.set("strict", false);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDb;
