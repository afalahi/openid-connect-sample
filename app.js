require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const { Issuer, Strategy } = require('openid-client');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const locals = require('./middleware/locals');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

Issuer.discover(
  process.env.IDC_TENANT //your IDC cloud am Oauth2 endpoint
).then((forgerock) => {
  const client = new forgerock.Client({
    client_id: process.env.CLIENT_ID, //client ID for the express app client
    client_secret: process.env.CLIENT_SECRET, //client Secret for the express app client
    redirect_uris: [`${process.env.REDIRECT_URL}/auth/callback`], //your sign in, callback or redirect url.
    post_logout_redirect_uris: [`${process.env.REDIRECT_URL}/logout/callback`],
    token_endpoint_auth_method: 'client_secret_post', //make sure your client in IDC matches this setting. By default IDC uses basic auth for client authentication
  });

  app.use(
    session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: false,
      name:'sid.telushealth',
      cookie: {
        path:'/',
        maxAge: 100 * 10 * 60 * 60 * 1,
        httpOnly:true,
        secure:'auto'
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    'oidc',
    new Strategy({ client }, (tokenSet, userinfo, done) => {
      return done(null, tokenSet);
    })
  );
app.use(locals);
app.locals.decodedUser = null;
app.use('/', indexRouter);
  //handles serialization and deserialization of authenticated user
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  // start authentication request
  app.get('/auth', (req, res, next) => {
    passport.authenticate('oidc', { scope: 'openid profile email' })(
      req,
      res,
      next
    );
  });

  // authentication callback
  app.get('/auth/callback', (req, res, next) => {
    passport.authenticate('oidc', {
      successRedirect: '/users',
      failureRedirect: '/',
    })(req, res, next);
  });

  app.use('/users', usersRouter);

  // start logout request
  app.get('/logout', (req, res) => {
    res.redirect(client.endSessionUrl({id_token_hint:req.user.id_token}));
  });

  // logout callback
  app.get('/logout/callback', (req, res) => {
    // clears the persisted user from the local storage
    req.app.locals.decodedUser = null;
    req.logout();
    // redirects the user to a public route
    res.redirect('/');
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});

module.exports = app;
