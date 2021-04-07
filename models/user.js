var db = require('mongoose');
var bcrypt = require('bcrypt');

db.connect("mongodb://127.0.0.1:27017/baiviet", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


var userSchema = db.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

userSchema.pre('save', function(next){
    var user=this
    bcrypt.hash(user.password,10,function(err,encrypted){
        user.password = encrypted
        next()
    })
})

var User = db.model('User', userSchema)
module.exports = User;

