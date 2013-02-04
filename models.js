var mongoose = require('mongoose')

//User
var userSchema = mongoose.Schema({
    properties: ['name', 'prefs', 'updated_at'],
    indexes: ['name'],
})
userSchema.methods.save = function(fn){
    this.updated_at = new Date();
    this.__super__(fn);
}

var User = mongoose.model('User', userSchema)

//Post
//post.related_links.push({ url: 'http://something....', source: 'The Wall Street Journal' });
var postSchema = mongoose.Schema( {
    properties: ['link', 'img_link', 'headline', 'content', 'summary', 'rank', 'crawled_at', 'related_links'],
    indexes: ['link'],
})
postSchema.methods.save = function(fn){
    this.crawled_at = new Date();
    this.__super__(fn)
}

var Post = mongoose.model('Post', postSchema)

mongoose.connect('mongodb://localhost/test')
var db = mongoose.connection
