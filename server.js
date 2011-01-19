require('sys')
require('ejs')
var express  = require('express')
var app      = express.createServer();

//start model section
require('./models')
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
            header: 'Welcome '+req.params.username,
            footer: '&copy; Naked Horse',
            title: 'News Page',
            description: 'A Page of news',
            author: 'Naked Horse'
        }
    })
});

app.listen(3000);
