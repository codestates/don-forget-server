import express from "express";
import { signup } from '../controller/user/signup';
import { signin } from '../controller/user/signin';
import { signout } from '../controller/user/signout';
import { confirmuser } from '../controller/user/confirmuser';
import { changename } from '../controller/user/changename';
import { changepassword } from '../controller/user/changepassword';
import { findpassword_stepone } from '../controller/user/findpassword_stepone';
import { findpassword_resetpassword } from "../controller/user/findpassword_resetpassword";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/signout", signout);
userRouter.post("/confirmuser/:id", confirmuser);
userRouter.post("/changename/:id", changename);
userRouter.post("/changepassword/:id", changepassword);
userRouter.post("/findpassword/stepone", findpassword_stepone);
userRouter.post("/findpassword/resetpassword", findpassword_resetpassword);

export = userRouter;