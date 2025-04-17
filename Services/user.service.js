// Package Imports
import bcrypt from "bcrypt";
// Local Imports
import user from "../Database/Schemas/user.schema.js";
import catchError from "../utils/index.js";

export default class {
  static registerUser = async (userName,password) => 
    await catchError(async () => {
      const result = await user.findOne({ userName: userName });
      if (result) return false;
      const u = new user({
        userName,
        password
      });
      const results = await u.save();
      return results;
    });

  static findUser = async (_id) =>
    await catchError(async () => {
      const query = {};
      if (_id) query._id = _id;
      const result = await user.findOne(query);
      if (!result) return false;
      else return result;
    });

  static findUserByUsername = async (userName) =>
    await catchError(async () => {
      const result = await user.findOne({ userName: userName });
      return result ? result : false;
    });

  static loginUser = async (userName, password) =>
    await catchError(async () => {
      const result = await user.findOne({ userName: userName });
      if (!result) return false;
      const userData = await user
        .findById(result._id)
        .select("userName _id");
      const isPasswordValid = await bcrypt.compare(password, result.password);
      if (isPasswordValid === true) {
        return userData;
      }
    });
}
