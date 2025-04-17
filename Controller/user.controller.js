// Package Imports
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Local Imports
import userService from "../Services/user.service.js";
import responseHandler from "../responses/responseHandler.js";

export default class {
  static async register(req, res) {
    const { userName, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await userService.findUserByUsername(userName);
      if (existingUser) {
        return responseHandler(
          res,
          res.status(409).json({
            success: false,
            message: "User already exists. Please use a different username.",
          })
        );
      }
      const result = await userService.registerUser(userName, hashedPassword);
      if (result?.error?.errorResponse?.errmsg) {
        return responseHandler(
          res,
          res.status(409).json({
            success: false,
            message: result.error.errorResponse.errmsg,
          })
        );
      }
      return responseHandler(
        res,
        res.status(200).json({
          success: true,
          result,
          message: "User created successfully.",
        })
      );
    } catch (error) {
      console.error("Error creating user:", error);
      return responseHandler(
        res,
        res.status(500).json({
          success: false,
          message: "Internal server error",
        })
      );
    }
  }

  static async getUser(req, res) {
    const { _id } = req.query;
    const result = await userService.findUser(_id);
    if (result) {
      return res.status(200).json({ message: "User found.", result });
    } else {
      return res.status(404).json({ message: "User not found." });
    }
  }

  static async login(req, res) {
    const { userName, password } = req.query;
    const result = await userService.loginUser(userName, password);
    const accessToken = jwt.sign(
      { userName, password },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userName, password },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );
    if (result) {
      return res.status(200).json({
        message: "Login Successfully.",
        result,
        accessToken,
        refreshToken,
      });
    } else {
      return res.status(400).json({ message: "Login failed." });
    }
  }
}
