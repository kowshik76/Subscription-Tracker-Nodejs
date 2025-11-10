import { Router } from "express";
import { Signin, Signout, SignUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", SignUp);
authRouter.get("signin", Signin);
authRouter.post("/signout", Signout);

export default authRouter;
