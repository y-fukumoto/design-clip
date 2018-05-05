var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var helmet = require('helmet')
var session = require('express-session')
var passport = require('passport')
var config = require('./config')

//モデルの読み込みと定義を書く
var User = require('./models/user')
var Design = require('./models/design')
var DesignTag = require('./models/designtag')
var Tag = require('./models/tag')
//
User.sync().then(() => {
  Design.sync()
  Tag.sync()
  DesignTag.belongsTo(Tag, { foreignKey: 'tagId' })
  DesignTag.sync()
})

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

var GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID
var GOOGLE_CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET

var GoogleStrategy = require('passport-google-oauth20').Strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_CALLBACK
},
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({
        where: {
          id: profile.id
        }
      })
      .then((u) => {
        User.upsert({
          id: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
          token: accessToken
        })
        .then(() => {
          done(null, profile);
        });
      })
    })
  }
))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'c6dbed86adfd4bdc', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

//auth router
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive'] })
)

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/')
  }
)

app.get('/auth/logout', function(req, res, next) {
  req.logout();
  res.redirect('/')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
