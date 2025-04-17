import express from "express";
import userController from "../Controller/user.controller.js";
import auth from "../Middleware/authentication.middleware.js";
import userValidation from "../Middleware/validation.middleware.js";

const router = express.Router();

router.post("/create", userValidation, userController.register);
router.get("/", auth, userController.getUser);
router.post("/login/", userController.login);

export default router;