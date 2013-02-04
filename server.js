require('sys')
var engine = require('ejs-locals')
var express = require('express')
var app = express();

app.engine('ejs', engine);

//start model section
require('./models')
// End model section

// Start app section
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/static'));
    app.use(express.bodyParser());
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
/*	TODO clean up models with new mongoose api
    User.findOne({name: user_name}, function(err, result){
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
*/
    res.redirect('/'+user_name)
});

app.get('/:username', function(req, res) {
    res.render('index.ejs', { 
        locals: {
            header: 'Welcome '+req.params.username,
            footer: '&copy; Naked Horse',
            title: 'News Page',
            description: 'A Page of news',
            author: 'Naked Horse'
        }
    })
});

app.listen(3000);
