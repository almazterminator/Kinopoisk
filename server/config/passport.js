const passport = require('passport')
const User = require('../auth/User')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// client id 1026766323545-od0rf1v04ip52jod753fj73kufcod46t.apps.googleusercontent.com
// client sectet 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

passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },
    function(email,password, done){
        User.findOne({email}).then(user=>{
            if(user.password){
                bcrypt.compare( password,user.password,function(err,result){
                    if (err) {return done(err)}
                    if(result) {return done(null, user)}
                });
            }else{
                return done('Пользователь не найден')
            }
        }).catch(e=>{
            return done(e)
        })
    }
))

passport.use(new GoogleStrategy({
    clientID: "1026766323545-od0rf1v04ip52jod753fj73kufcod46t.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/api/auth/google",
    scope: ['openid' , 'email' , 'profile']
  },
  async function(accessToken, refreshToken, profile, cb) {
   const user = await User.find({googleId: profile.id})
   console.log(profile);
   const newUser = await new User({
        googleId: profile.id,
        full_name: profile.displayName,
        email: profile.emails[0].value
   }).save()
   return cb(null, newUser);

    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));



passport.serializeUser(function(user,done){
    done(null,user._id)
})

passport.deserializeUser(function(id,done){
    User.findById(id).then((user, err) => {
        done(err,user)
    })
})