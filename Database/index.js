import mongoose from "mongoose";
import config from "../config/index.js";
const { mongoUri } = config;

class Database {
  static db = {};
  static connects = async () => {
    try {
      const conn = await mongoose.connect(config.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      Database.db = conn.connection.db;
      return conn;
    } catch (err) {
      console.log(`Error: ${err.message}`);
      process.exit(1);
    }
  };
}

export default Database;
