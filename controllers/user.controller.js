import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(201).json({
      success: true,
      message: "All users retrieved successfully",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json({
      success: true,
      message: "user retrieved successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
