const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken')

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

// exports.getSauce = (req, res, next) => {

// };

exports.postSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host')
    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
    });
    sauce.save().then(() => {
        res.status(201).json({
            message: "Sauce saved successfully."
        });
    }).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
};

// exports.modifySauce = (req, res, next) => {

// };

// exports.deleteSauce = (req, res, next) => {

// };

// exports.rateSauce = (req, res, next) => {

// };