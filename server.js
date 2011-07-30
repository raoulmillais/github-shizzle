var express = require('express'),
	eyes = require('eyes'),
	http = require('http'),
	jade = require('jade'),
	config = require('./config').config,
	GitHubApi = require('./support/github/lib/github').GitHubApi,
	server;

server = express.createServer();

server.get('/', function showHomePage(req, res) {
	res.render('index.jade', {});
});

server.get('/github/authorised', function storeToken(req, res) {
	console.log(GitHubApi);
	var url = require('url').parse(req.url),
		qs= require('querystring').parse(url.query),
		github = new GitHubApi(true),
		postData = {
			code: qs.code,
			client_id: config.githubapplicationclientid,
			client_secret: config.githubclientsecret
		},
		reqOptions = {
			url: ':protocol://github.com/:path',
			path: '',
			format: 'text',
			method: 'https'
		};
	eyes.inspect(url);
	eyes.inspect(postData);

	github.getOAuthAccessToken(qs.code, config.githubapplicationclientid, config.githubclientsecret, function processToken(err, response) {
		console.log('ACCESS TOKEN');
		eyes.inspect(response);
		console.log('ERROR');
		eyes.inspect(err);
	});

});

server.listen(3000);
