import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import Authorize from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", Authorize, getUser);
userRouter.post("/", (req, res) => {
  res.send({ title: "create user" });
});
userRouter.put("/:id", (req, res) => {
  res.send({ title: "update user" });
});
userRouter.delete("/", (req, res) => {
  res.send({ title: "Delete the user" });
});

export default userRouter;
