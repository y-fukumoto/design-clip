var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    res.render('main', { title: 'ログイン', user: req.user });
  }
  else {
    res.render('index', { title: '未ログイン', user: '' });
  }
});

module.exports = router;
