const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const jwtDecode = require('jwt-decode');

router.get('/', ensureLoggedIn('/'), (req, res) => {
  console.log(req.user.access_token)
  const decodedUser = {
    access_token: {...jwtDecode(req.user.access_token)},
    refresh_token: jwtDecode(req.user.refresh_token),
    id_token: jwtDecode(req.user.id_token)
  };
  console.log(decodedUser);
  req.app.locals.decodedUser = decodedUser
  res.render('users', { user: req.user, decodedUser, title:'users' });
});

module.exports = router;
