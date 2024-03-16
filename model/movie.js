const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    genre: {type: String},
    rating: {type: String},
    link: {type: String},
})

const MovieModel = mongoose.model('Movie', movieSchema);
module.exports = MovieModel;