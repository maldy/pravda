var http = require('http');
var rss = require('./node-rss');
var feed_url_list = {	'http://news.google.com/news?pz=1&cf=all&ned=in&hl=en&topic=t&output=rss', 
						'http://news.google.com/news?pz=1&cf=all&ned=in&hl=en&topic=b&output=rss',
						'http://rss.news.yahoo.com/rss/tech',
						'http://rss.news.yahoo.com/rss/business',
						'http://feeds.feedburner.com/TechCrunch'
					};
var htmlparser = require('htmlparser');

var handler = new htmlparser.DefaultHandler(function (error, dom) {
	sys.puts('Parsing post...');
});
var parser = new htmlparser.Parser(handler);

// find the first image and return img src
function find_image(entry){
	var type = typeof entry;
	if (type == "object"){
		for (var key in entry){
			if (key== "name" && entry[key]== "img"){
				return entry.attribs.src;
			}
			obj = find_image(entry[key]);
			if (obj != null) return obj;
		}
	} else {
		return null;
	}
}

// obtain all text data from given json-ised html segment
function get_text(entry){
	var type = typeof entry;
	if (type == "object"){
		var text = ""
		for (var key in entry){
			if (key=="type" && entry[key] == "text"){
				text = text + entry.data;
			}
			text = text + get_text(entry[key]);
		}
		return text;
	} else {
		return "";
	}
}

function scraper(feed_url_list) {
	for (var feed_url in feed_url_list){
		var response = rss.parseURL(feed_url, function(articles) {
			var crawled_at = new Date();	// time of grabbing url
		
			// looping through all rss entries for a given feed
			for (var i=0; i<articles.length; i++){
				var db_entry = new Post();
			
				//  populate post entry
				db_entry.headline = articles[i].title;
				db_entry.link = articles[i].link;
				db_entry.summary = articles[i].description;
				db_entry.crawled_at = crawled_at;
				db_entry.rank = 1.0;
				db_entry.related_links = {};
				parser.parseComplete(articles[i].content);	// bringing in htmlparser to json-ise the html content
				db_entry.img_link = find_image(handler.dom);
				plain_text_content = get_text(handler.dom);
				db_entry.content = articles[i].content);	// loading entry with raw html-formatted content, use plain_text_content for just text
				
				// generating 30-word summary from content if rss entry doesn't come with description
				if (!db_entry.summary){
					var j = 0, word_count = 30;
					while (j < plain_text_content.length && word_count > 0){
						j++;
						if (plain_text_content.charAt(j) == " "){
							word_count--;
						}
					}
					db_entry.summary = plain_text_content.slice(0,j);
					if (db_entry.summary.length < plain_text_content.length){
						db_entry.summary += ' ...';
					}
				}
				db_entry.save(function () {
					console.log("Saved post on: " + articles[i].title);
				});
			}
		})
	}
}