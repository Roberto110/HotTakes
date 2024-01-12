const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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

exports.getSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.postSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host')
    const sauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        userId: req.body.sauce.userId,
        likes: 0,
        dislikes: 0
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

exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat,
            userId: req.body.sauce.userId
        };
    } else {
        sauce = {
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            userId: req.body.userId
        };
    }
    Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
            res.status(201).json({
                message: 'Sauce updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({ _id: req.params.id }).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });
        }
    );
};

exports.rateSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then( // Finds the correctsauce in the database
        (sauce) => {
            if (sauce.usersLiked.find((userId) => userId == req.body.userId) || sauce.usersDisliked.find((userId) => userId == req.body.userId)) { // Checks to see if the user has already rated the sauce
                console.log("User has rated this sauce already.")
                if (sauce.usersLiked.find((userId) => userId == req.body.userId) && req.body.like == 0) { // removes like
                    console.log("Removing like.")
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
                    ).then(() => {
                        res.status(201).json({
                            message: 'Like removed: ' + sauce.likes
                        });
                    }).catch(
                        (error) => {
                            res.status(401).json({
                                error: error
                            })
                        }
                    )
                }
                if (sauce.usersDisliked.find((userId) => userId == req.body.userId) && req.body.like == 0) { // removes dislike
                    console.log("Removing dislike.")
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
                    ).then(() => {
                        res.status(201).json({
                            message: 'Dislike removed: ' + sauce.dislikes
                        });
                    }).catch(
                        (error) => {
                            res.status(401).json({
                                error: error
                            })
                        }
                    )
                }
            } else { //if the user hasnt rated the sauce before
                console.log('User has not rated this sauce before.')
                if (req.body.like == 1) { // Likes the sauce 
                    console.log('Sauce liked.')
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
                    ).then(() => {
                        res.status(201).json({
                            message: 'Sauce liked: ' + sauce.likes
                        })
                    }).catch(
                        (error) => {
                            res.status(401).json({
                                error: error
                            })
                        }
                    )
                }

                if (req.body.like == -1) { //dislikes the sauce
                    console.log('Sauce disliked.')
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
                    ).then(() => {
                        res.status(201).json({
                            message: 'Sauce disliked: ' + sauce.dislikes
                        })
                    }).catch(
                        (error) => {
                            res.status(401).json({
                                error: error
                            })
                        }
                    )
                }
            }
        }
    )
};

