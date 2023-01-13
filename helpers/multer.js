// define image type
/*const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}
// configure image upload for unique name of each file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },

    filename: function (req, file, cb) {
        console.log('problem 1')
        const uniqueSuffix = file.originalname.split(' ').join('-');
        // get the type of file
        const extension = FILE_TYPE_MAP[file.mimetype]
        console.log('problem 2')
        cb(null, `${uniqueSuffix}-${Date.now()}.${extension}`)
    }
})

const fileFilter = (req, file, cb) => {
    const extension = FILE_TYPE_MAP[file.mimetype]
    if (extension) {
        cb(null, true)
    } else {
        //reject file
        cb({message: 'Unsupported file format'}, false)
    }
}

const uploadOptions = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024},
    fileFilter: fileFilter
})*/

//module.exports = uploadOptions

