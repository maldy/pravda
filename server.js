var express= require('express')
var connect= require('connect')
require('ejs')
var app = express.createServer();
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.use(connect.staticProvider(__dirname + '/static'));
})

app.get('/', function(req, res){
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
