import express from "express";

const router = express.Router();
import {signin, signup, verifyCode,verifyUser,forgotPasswordCode} from "../controllers/auth.js";
import {signupValidator, signInValidator, emailValidator,verifyUserValidator, validate} from "../validators/validators.js";

router.post("/signup", signupValidator, validate, signup);

router.post("/signin", signInValidator, validate, signin);

router.post("/sendVerificationEmail", emailValidator, validate, verifyCode);

router.post("/verifyUser", verifyUserValidator, validate,verifyUser);

router.post("/forgotPasswordCode", emailValidator , validate, forgotPasswordCode);

export {router};