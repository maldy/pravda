var mongoose = require('mongoose').Mongoose

//User
mongoose.model('User', {
    properties: ['name', 'prefs', 'updated_at'],
    indexes: ['name'],
    methods: {
        save: function(fn){
            this.updated_at = new Date();
            this.__super__(fn);
        }
    },
})

//Post
//post.related_links.push({ url: 'http://something....', source: 'The Wall Street Journal' });
mongoose.model('Post', {
    properties: ['link', 'img_link', 'headline', 'content', 'summary', 'rank', 'crawled_at', 'related_links'],
    indexes: ['link'],
    methods: {
        save: function(fn) {
            this.crawled_at = new Date();
            this.__super__(fn)
        }
    }
})


var db     = mongoose.connect('mongodb://localhost/test')
User   = db.model('User')
Post   = db.model('Post')
