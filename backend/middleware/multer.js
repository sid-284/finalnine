import multer from 'multer'

let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});

let upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
        fieldSize: 10 * 1024 * 1024, // 10MB limit per field
        files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

export default upload
