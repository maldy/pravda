require('sys')
require('ejs')
var express  = require('express')
var app      = express.createServer();

//start model section
var mongoose = require('mongoose').Mongoose

mongoose.model('User', {

    properties: ['name', 'prefs'],

    indexes: ['name'],

    setters: {
//      first: function(v){
//          return this.v.capitalize();
//      }
    },

    getters: {
//      full_name: function(){ 
//          return this.first + ' ' + this.last 
//      }
    },

    methods: {
        save: function(fn){
            this.updated_at = new Date();
            this.__super__(fn);
        }
    },
});

var db     = mongoose.connect('mongodb://localhost/test')
var User   = db.model('User')
// End model section

// Start app section
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.use(express.staticProvider(__dirname + '/static'));
    app.use(express.bodyDecoder());
})

app.get('/', function(req, res){
    res.render('home.ejs', {
        locals: {
            title: 'Home',
            header: '',
            footer: '',
            description: '',
            author: ''
        }
    }) 
});


app.post('/users', function(req, res){
    var user_name= req.body.user.name
    User.find({name: user_name}).all(function(result){
        if(result.length > 0) {
            console.log(user_name+' exists!')
            console.log(result)
        }
        else {
            console.log('User ' + user_name + ' not found')
            var u = new User()
            u.name = user_name
            u.prefs = 'all'
            u.save(function() {console.log(user_name+' Saved!')})
        }
    })
    res.redirect('/'+user_name)
});

app.get('/:username', function(req, res) {
    res.render('index.ejs', { 
        locals: {
            header: 'Header',
            footer: 'Footer',
            title: 'News Page',
            description: 'A Page of news',
            author: 'Naked Horse'
        }
    })
});

app.listen(3000);
