import multer from "multer"
import path from "path"

// to generate unique file names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

//file filter to accept only png,jpg and jpeg not mp3 and mp4
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = allowedTypes.test(file.mimeType);

    if(extname && mimeType){
        cb(null,true);
    }
    else{
        cb(new Error('Only image files are allowed (jpg, png, jpeg, webp)'));
    }
}

export const upload = multer({ storage,
fileFilter,
    limits: {fileSize: 5*1024*1024}  //5MB file

});
