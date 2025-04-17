import joi from "joi";
import mongoose from "mongoose";

const validationSchema = joi.object({
  userName: joi.string().trim().min(3).max(100).required(),
  password: joi.string().min(6).required(),
});

const userValidation = async (req, res, next) => {
  try {
    let {
      userName,
      password,
    } = req.body;

    const payload = {
      userName,
      password
    };

    const { error } = validationSchema.validate(payload, { abortEarly: false });

    if (error) {
      return res.status(406).json({
        message: "Validation Error",
        details: error.details.map((err) => err.message),
      });
    }

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export default userValidation;
