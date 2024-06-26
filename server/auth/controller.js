const User = require('./User')
const bcrypt = require('bcrypt')


const signUp = async(req,res)=>{
    if(!req.body.email.length <= 0 
        && req.body.full_name.length <= 0 
        && req.body.password.length <= 0 
        && req.body.re_password.length <= 0 
    ){
       return res.redirect('/register?error=1')
    }else if(req.body.password !==req.body.re_password){
        return res.redirect('/register?error=2')
    }
    const findUser = await User.findOne({email: req.body.email}).countDocuments()
    if(findUser){
       return res.redirect('/register?error=3')
    }
    bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(req.body.password,salt,function(err,hash){
        new User({
            email:req.body.email,
            full_name:req.body.full_name,
            isAdmin: False,
            password:hash
        }).save()
        res.redirect('/login')
    })
    })
}

const signIn = (req,res)=>{
    if(req.user.isAdmin){
        res.redirect(`/admin/${req.user._id}`)
    }else{
    res.redirect(`/profile/${req.user._id}`)
}
}
const signOut = (req,res)=>{
    req.logout(function(err){
        if(err){
            console.log('Выход');
        }
    })
    res.redirect('/')
}

module.exports = {
    signUp,
    signIn,
    signOut

}