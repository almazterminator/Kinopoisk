const express = require('express')
const router = express.Router()
const Genres = require('../Genres/Genres')
const Country = require('../Country/country')
const User = require('../auth/User')
const Films = require('../Films/Film')
const Film = require('../Films/Film')
const Rate = require('../Rates/Rates')

router.get('/' , async (req,res)=>{
    const options = {}
    const genres = await Genres.findOne({key : req.query.genre})
    if(genres){
        options.genre = genres._id
        res.locals.genre = req.query.genre
    }
    let page = 0
    const limit = 3
    if(req.query.page && req.query.page>0){
        page = req.query.page
    }
    if(req.query.search && req.query.search.length > 0){
        options.$or = [
            {
                    titleRus: new RegExp(req.query.search , 'i')
            },
            {
                titleEng: new RegExp(req.query.search , 'i')
            }

        ]
        res.locals.search = req.query.search
    }
    const totalFilms = await Film.countDocuments(options)
    const allGenres = await Genres.find()
    const films = await Films.find(options).limit(limit).skip(page * limit).populate('country').populate('genre')
    const user =req.user ? await User.findById(req.user._id): {}
    res.render("index",{genres:allGenres , user: req.user ? user:{} , films , pages:Math.ceil(totalFilms/limit)})
})
router.get('/login',(req,res)=>{
    res.render("login",{user: req.user ? req.user:{}})
})
router.get('/register',(req,res)=>{
    res.render("register",{user: req.user ? req.user:{}})
})
router.get('/profile/:id', async (req,res)=>{
    const allGenres = await Genres.find()
    const films = await Films.find().populate('country').populate('genre').populate('author')
    const user = await User.findById(req.params.id).populate('toWatch')
    .populate({path: 'toWatch', populate:{path: 'country'} })
    .populate({path: 'toWatch', populate:{path: 'genre'} })
    if(user){
        res.render('profile.ejs', {user: user , genres: allGenres , loginUser:req.user , films})
    }else{
        res.redirect('/not-found')
    }
})
router.get('/admin/:id',async(req,res)=>{
    const films = await Films.find().populate('country').populate('genre').populate('author')
    const allGenres = await Genres.find()
    const user = await User.findById(req.params.id)
    res.render('adminProfile', {genres: allGenres, user:user,loginUser:req.user ? req.user:{} , films })
})
router.get('/newFilm', async (req,res)=>{
    const AllCountries = await Country.find()
    const allGenres = await Genres.find()
    res.render("newFilm",{genres:allGenres , countries: AllCountries,user: req.user ? req.user:{}})
})
router.get('/edit/:id', async (req,res)=>{
    const AllCountries = await Country.find()
    const film = await Film.findById(req.params.id)
    const allGenres = await Genres.find()
    res.render("editFilm",{genres:allGenres , countries: AllCountries , user: req.user ? req.user:{} , film})
})
router.get('/not-found', (req,res)=>{
    res.render("notFound")
})
router.get('/detail/:id', async(req,res)=>{
    const rates = await Rate.find({filmId: req.params.id}).populate('authorId')
    let averageRate = 0
    for(let i = 0; i < rates.length; i++){
        averageRate += rates[i].rate
    }
    const film = await Film.findById(req.params.id).populate('country').populate('genre').populate('author')
    const allGenres = await Genres.find()
    res.render("detail" , {user: req.user ? req.user : {} , film:film , rates:rates, averageRate :( averageRate/ rates.length).toFixed(1) } )
})



module.exports = router