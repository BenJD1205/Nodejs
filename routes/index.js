var express = require('express');
var router = express.Router();
var myport = require('../models/myprot');
const sanitize = require('sanitize-html');
const { find } = require('../models/myprot');
var User = require('../models/user');
var bcrypt = require('bcrypt');

router.get('*', function(req, res, next){
  res.locals.userId = req.session.userId
  next();
});

router.get('/', function(req, res, next) {
  let tranghientai = req.query.page ||1;
  let baivietmoitrang = 3;
  let tongsobaiviet;
  myport.find()
    .countDocuments()
    .then(count => {
      tongsobaiviet = count;
      const trangcuoicung = Math.ceil(tongsobaiviet / baivietmoitrang);
      myport.find()
        .skip((tranghientai -1)*baivietmoitrang)
        .limit(baivietmoitrang)
        .then(danhsachbaiviet => {
          res.render('index.ejs', {
            danhsachbaiviet, tranghientai,
            tongsobaiviet,trangcuoicung
          });
        })
    });
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
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = 'public/img/' + sampleFile.name;
  noidung = req.body.content.split('<p>&nbsp;</p>').join('').trim()
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    var mp = new myport({
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: sanitize(noidung),
      username: req.body.username,
      image: sampleFile.name,
    })
    mp.save(error => res.redirect('/'))
    
  });

  
});

router.get('/contact', function(req, res, next) {
  res.render('contact.ejs');
});

router.get('/post/:mabaiviet', function(req, res, next){
  myport.findOne({_id: req.params.mabaiviet}, (error,baiviet) => {
    res.render('post.ejs',{baiviet})
  });
});

router.get('/dangky',function(req, res, next) {
  res.render('register.ejs');
});

router.post('/dangky', function(req, res,next) {
  var nguoidung = new User(req.body)
  nguoidung.save(error => {
    if(error)
      return res.redirect('/dangky')
    res.redirect('/')
  })
});

function kiemtrathongtin(req, res, next){
  if(!req.body.username || !req.body.email || !req.body.password) {
    console.log('Ban nhap thieu thong tin');
    res.redirect('/dangky')
  }
  else 
    next()
}

router.get('/login', function(req, res, next){
  res.render('login.ejs')
});

router.post('/login', function(req, res, next){
  var {email,password} =req.body
  User.findOne({email}, function(err,nguoidung){
    if(nguoidung){
      bcrypt.compare(password,nguoidung.password,(err,same) => {
        if(same){
          req.session.userId = nguoidung._id
          res.redirect('/')
        }
        else
          res.redirect('/login')
      })
    }else
      res.redirect('/login')
  });
});

router.get('/create', function(req, res, next) {
  if(req.session.userId) {
    return res.render('create.ejs')
  }
  res.redirect('/login')
});

router.get('/logout',function(req, res, next){
  req.session.userId = undefined
  res.redirect('/')
})

module.exports = router;
