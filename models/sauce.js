const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    // likes: { type: String, required: true },
    // dislikes: { type: String, required: true },
    // usersLiked: { type: ["String <userId>"], required: true },
    // usersDisliked: { type: ["String <userId>"], required: true }
});

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Sauce', sauceSchema);