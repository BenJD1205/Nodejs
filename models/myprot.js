var db = require('mongoose');

db.connect("mongodb://127.0.0.1:27017/baiviet", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var myprotSchema = db.Schema({
    title: String,
    subtitle: String,
    content: String,
    username: String,
    createAt: {
        type: Date,
        default: new Date()
    }
})

var Post = db.model('Post', myprotSchema)
module.exports = Post;