import express from "express";
const app = express();

app.use(express.urlencoded({ extended: true }));

import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const uniqueFileName = uniqueSuffix + "-" + file.originalname;
    },
});

function fileFilter(req, file, cb){
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}
