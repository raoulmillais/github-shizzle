var express = require('express'),
	eyes = require('eyes'),
	http = require('http'),
	jade = require('jade'),
	server;

server = express.createServer();

server.get('/', function showHomePage(req, res) {
	res.render('index.jade', {});
});

server.get('/github/authorised', function storeToken(req, res) {
	var url = require('url').parse(req.url),
		qs= require('querystring').parse(url.query),
		GithubAccess = require('./github').GithubAccess,
		github = new GithubAccess(qs.code);


	eyes.inspect(url);
	github.getAccessToken();
//	res.redirect('/');

});

server.listen(3000);
