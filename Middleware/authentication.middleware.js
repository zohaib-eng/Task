import jwt from "jsonwebtoken";
import User from "../Database/Schemas/user.schema.js";

const config = process.env;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(403)
      .json({ message: "A Bearer token is required for authentication." });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Invalid Bearer token format." });
  }
  try {
    const decodedUser = jwt.verify(token, config.JWT_ACCESS_SECRET);
    if (decodedUser.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTimeInMinutes = Math.round(
        (currentTime + 4 * 60 * 60) / 60
      );
      let email = decodedUser.email;
      if (decodedUser.role === "admin") {
        const result = await Admin.findOne({
          email: email,
        });
        if (result === null) {
          return res.status(401).send({ message: "Admin is not exist" });
        }
        if (decodedUser.exp < expirationTimeInMinutes) {
          return res.status(401).json({ message: "Token has expired." });
        }
        req.admin = result;
      }
      if (decodedUser.role === "user") {
        const result = await User.findOne({
          email: email,
        });
        if (result === null) {
          return res.status(401).send({ message: "User is not exist" });
        }
        if (decodedUser.exp < expirationTimeInMinutes) {
          return res.status(401).json({ message: "Token has expired." });
        }
        req.user = result;
      }
      if (decodedUser.role === "organisation") {
        const results = await Organisation.findOne({
          email: email,
        });
        if (results === null) {
          return res.status(401).send({ message: "Organisation is not exist" });
        }
        if (decodedUser.exp < expirationTimeInMinutes) {
          return res.status(401).json({ message: "Token has expired." });
        }
        req.organisation = results;
      }
    }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export default verifyToken;
