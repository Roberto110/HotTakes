const express = require('express');
const router = express.Router()
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getSauce);
router.post('/', auth, multer, sauceCtrl.postSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.rateSauce);


module.exports = router;