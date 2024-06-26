const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FilmSchema = new mongoose.Schema({
    titleEng: String,
    titleRus: String,
    year: Number,
    time: Number,
    video: String,
    series: [String] ,
    country: {type: Schema.Types.ObjectId , ref: 'country'},
    genre: {type: Schema.Types.ObjectId , ref: 'genre'},
    image: String,
    author: {type:Schema.Types.ObjectId , ref: 'user'}
})

module.exports = mongoose.model('film' ,FilmSchema)