const express = require('express');
const router = express.Router()
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');

router.get('/', sauceCtrl.getAllSauces);
router.post('/', multer, sauceCtrl.postSauce);


module.exports = router;