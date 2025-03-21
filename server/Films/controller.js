const Film = require('./Film')
const User = require('../auth/User')

const fs = require('fs')
const path = require('path')



const createFilm = async (req,res) =>{
    if(req.file && req.body.titleRus.length > 2 && 
        req.body.titleEng.length > 2 && 
        req.body.year > 0 &&
        req.body.time > 10 &&
        req.body.country.length > 2 &&
        req.body.genre.length > 2 )
    {
        if(req.body.video && req.body.video.length > 2){ 
        await new Film({
            titleEng: req.body.titleEng,
            titleRus: req.body.titleRus,
            year: req.body.year,
            time: req.body.time,
            country: req.body.country,
            genre: req.body.genre,
            video: req.body.video,
            image: `/images/films/${req.file.filename}`,
            author: req.user._id
        }).save()
        }else if(req.body.series && req.body.series.length > 0){
            await new Film({
                titleEng: req.body.titleEng,
                titleRus: req.body.titleRus,
                year: req.body.year,
                time: req.body.time,
                country: req.body.country,
                genre: req.body.genre,
                series: req.body.series,
                image: `/images/films/${req.file.filename}`,
                author: req.user._id
            }).save()
        }
        res.redirect(`/admin/${req.user._id}`)
    }else{
        res.redirect('/new?error=1')
    }
}
const editFilm = async (req,res)=>{
    if(req.file && 
        req.body.titleRus.length > 2 &&
        req.body.titleEng.length > 2 &&
        req.body.year > 0 &&
        req.body.time > 10 &&
        req.body.country.length > 0 &&
        req.body.genre.length > 0 &&
        req.body.video.length > 2
    ){
        const films = await Film.findById(req.body.id);
        fs.unlinkSync(path.join(__dirname + '../../../public'+ films.image))
        films.titleRus = req.body.titleRus
        films.titleEng = req.body.titleEng
        films.time = req.body.time
        films.country = req.body.country
        films.genre = req.body.genre
        films.video = req.body.video
        films.image = `/images/films/${req.file.filename}`
        films.author = req.user._id
        films.save()
        res.redirect(`/admin/` + req.user._id)
    }else{
            res.redirect(`/edit/${req.body.id}?error=1`)
        }
}

const deleteFilm = async(req,res)=>{
    const film = await Film.findById(req.params.id)
    if (film){
        fs.unlinkSync(path.join(__dirname + '../../../public'+ film.image))
        await Film.deleteOne({_id: req.params.id})
        res.status(200).send('ok')
    }else{
        res.status(404).send('Connection to Failed')
    }

}
const saveFilm = async(req,res)=>{
    if(req.user && req.body.id){
        const user = await User.findById(req.user.id)
        const findFilm = user.toWatch.filter(item=> item._id == req.body.id)
        if(findFilm.length == 0){
            user.toWatch.push(req.body.id)
            user.save()
            res.send('Фильм сохранен')
        }else{
            res.send('Фильм уже сохранен')
        }
    }
 }

const deleteFromToWatch = async (req,res) =>{
    if(req.user && req.params.id){
        const user = await User.findById(req.user.id)
        for(let i = 0; i < user.toWatch.length;i++){
            if(user.toWatch[i] == req.params.id){
                user.toWatch.splice(i, 1)
                user.save()
                res.send('Успешно удалено')
            }
        }
        
    }
}

module.exports = {
    createFilm,
    editFilm,
    deleteFilm,
    saveFilm,
    deleteFromToWatch
}