const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ // tells multer where to save incoming files
    destination: (req, file, callback) => {
        callback(null, 'images'); // tells multer to save incoming files to the 'images' folder
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); //tells  multer  to use the original name, replacing any spaces with underscores
        const extension = MIME_TYPES[file.mimetype]; //uses the MIME type map constant to resolve the appropriate file extension.
        callback(null, name + Date.now() + '.' + extension); //adds together name, a  Date.now()  timestamp, and the file extension
    }
});

module.exports = multer({ storage: storage }).single('image');