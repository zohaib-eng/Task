import express from "express";
import userRoutes from "../Routes/user.routes.js";

const router = express.Router();
class Router {
  static getRoutes = () => {
    router.use("/users/api", userRoutes);
    router.get("/", (_, res) => res.send("Welcome to app."));
    return router;
  };
}

export default Router;
