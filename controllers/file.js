import fileExtValidator from "../validators/fileValidator.js";
import {deleteFileFromS3, signedUrlS3, uploadFileToAWS} from "../utils/awsS3.js";
import File from "../models/File.js";
import path from "path";

const uploadFile = async (req, res, next) => {
    try {
        const {file} = req;

        if (!file) {
            res.code = 400;
            throw new Error("File is not selected.");
        }


        const ext = path.extname(file.originalname);
        const isValidate = fileExtValidator(ext);

        if (!isValidate) {
            res.code = 400;
            throw new Error("Only .png .jpg .jpeg and .png files are allowed.");
        }

        const key = await uploadFileToAWS({file, ext});

        if (key) {
            const newFile = new File({
                key,
                size: file.size,
                mimetype: file.mimetype,
                createdBy: req.user
            })

            await newFile.save();
        }

        res.status(200).json({
            code: 201,
            status: true,
            message: "File uploaded.",
            data: {key}
        })

    } catch (e) {
        next(e);
    }
}

const signedUrl = async (req,res,next) => {
    try{
        const {key} = req.query;
        const url = await signedUrlS3(key);

        res.status(200).json({
            code: 201,
            status: true,
            message: "Get signed url successfully. ",
            data: {url}
        })
    }catch (e) {
        next(e);
    }
}

const deleteFile = async (req,res,next) => {
    try{

        const {key} = req.query;

        await deleteFileFromS3(key);
        await File.findOneAndDelete({key});

        res.status(200).json({code : 200 , status : true, message: "File deleted successfully."});


    }catch (e) {
        next(e);
    }
}


export {uploadFile,signedUrl, deleteFile};