var express = require('express');
var router = express.Router();
var myport = require('../models/myprot');

router.get('/', function(req, res, next) {
  myport.find({}, (error,danhsachbaiviet) => {
    res.render('index.ejs', {danhsachbaiviet});
  })
});

router.get('/about', function(req, res, next) {
  res.render('about.ejs')
});

router.get('/*.:mabaiviet', function(req, res, next) {
  if (req.params.mabaiviet=="741")
    res.render('contact.ejs')
  else
    res.send('Không liên hệt được ');
});

router.get('/post', function(req, res, next) {
  res.render('post.ejs');
});

router.get('/newpost', function(req, res, next) {
  res.render('create.ejs');
});

router.post('/them', function(req, res, next) {
  var mp = new myport(req.body);
  mp.save(error => res.redirect('/'))
});

router.get('/contact', function(req, res, next) {
  res.render('contact.ejs');
});

router.get('/post/:mabaiviet', function(req, res, next){
  myport.findOne({_id: req.params.mabaiviet}, (error,baiviet) => {
    res.render('post.ejs',{baiviet})
  });
});

module.exports = router;
