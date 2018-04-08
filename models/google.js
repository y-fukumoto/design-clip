const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config')
const User = require('./user')

const passportConfig = {
  clientID: "17211270278-9p4bua85cs997ns4s3vd9oigmfukssg5.apps.googleusercontent.com",
  clientSecret: 'AHZAGz-SO4SVu-xFaE61O_Kc',
  //callbackURL: 'http://localhost:8000/auth/google/return'
  callbackURL: 'http://localhost:8000/api/authentication/google/redirect'
}

passport.use(new GoogleStrategy(passportConfig,
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({
        where: {
          id: profile.id
        }
      }).then((u) => {
        if(u) {
          console.log('uがある')
          done(null, profile)
        } else {
          User.upsert({
            id: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName
          }).then(() => {
            done(null, profile);
          });
        }
      })
    });
  }
));