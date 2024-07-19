import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {uploadFile} from "../controllers/file.js";
import upload from "../middlewares/upload.js";

const fileRouter = express.Router();

fileRouter.post("/upload", isAuth , upload.single("image") ,uploadFile);

export {fileRouter};