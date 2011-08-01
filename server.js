var express = require('express'),
	eyes = require('eyes'),
	http = require('http'),
	jade = require('jade'),
	config = require('./config').config,
	User = require('./lib/user').User,
	GitHubApi = require('./support/github/lib/github').GitHubApi,
	server;

server = express.createServer();
server.use(express.cookieParser());
server.use(express.session({ secret: 'random' }));

server.get('/', function showHomePage(req, res) {
	res.render('index.jade', {});
});

server.get('/github/authorised', function storeToken(req, res) {
	var url = require('url').parse(req.url),
		qs= require('querystring').parse(url.query),
		github = new GitHubApi(true),
		user;

	if (!qs.code) {
			console.error('Error getting access token: %j', tokenErr);
			res.redirect('/github/error');
			return;
	}

	req.session.user = user = new User(qs.code);

	github.getOAuthAccessToken(qs.code, config.githubapplicationclientid, config.githubclientsecret, 
								function handleTokenResponse(tokenErr, tokenResponse) {
		var accessToken,
			username;

		if (tokenErr || !tokenResponse.access_token) {
			console.error('Error getting access token: %j', tokenErr || tokenResponse);
			res.redirect('/github/error');
			return;
		}

		req.session.accessToken = accessToken = tokenResponse.access_token;
		console.log('Received access token');
		res.redirect('/github/user');

	});

});

server.get('/github/user', function showUser(req, res) {
	var github = new GitHubApi(true);

	// TODO: Handle no accessToken
	github.authenticateOAuth(req.session.accessToken);
	
	github.getUserApi().show('', function handleShowUserResponse(userErr, userResponse) {
		var user;

		if (userErr) {
			console.error('Error getting user: %j', userErr);
			res.redirect('/github/error');
			return;
		}

		console.log('Received user info: %j', userResponse);

		var user = new User(req.session.user.code);
		user.setUserInfo(userResponse);
		res.render('user.jade', { locals: { user: user } });
	});

});

server.get('/github/fork', function createFork(req, res) {
	var github = new GitHubApi(true);

	// TODO: Handle no accessToken
	github.authenticateOAuth(req.session.accessToken);

	// TODO: Check whether the user has already forked the repository
	// TODO: Get the repository to fork from config
	github.getRequest().post('repos/fork/7digital/7digital-python-api-wrapper',
								{} /* postParameters */, null /* requestOptions */,
								function handlerForkResponse(forkError, forkResponse) {
		if (forkError) {
			console.error('Error forking repository: %j', forkError);
		}
		console.log('Successfully forked repository: %j', forkResponse);

		// TODO: Clone the new fork on the server and store the path on the User
	});

});

server.get('/github/error', function showError(req, res) {
	res.render('error.jade', {});
});

server.listen(3000);
