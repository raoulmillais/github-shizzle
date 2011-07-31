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
	var url = require('url').parse(req.url),
		qs= require('querystring').parse(url.query),
		github = new GitHubApi(true);

	// TODO: Create a user with the access code and put it in session
	github.getOAuthAccessToken(qs.code, config.githubapplicationclientid, config.githubclientsecret, 
								function handleTokenResponse(tokenErr, tokenResponse) {
		var accessToken,
			username;

		if (tokenErr) {
			console.error('Error getting access token: %j', tokenErr);
			res.redirect('/github/error');
			return;
		}

		accessToken = tokenResponse.access_token,
		console.log('Received access token');
		// TODO: Store the access token in User in session
		// TODO: Redirect to create store page

		github.authenticateOAuth(accessToken);
		
		github.getUserApi().show('', function handleShowUserResponse(userErr, userResponse) {
			if (userErr) {
				console.error('Error getting user: %j', userErr);
			}
			console.log('Received user info: %j', userResponse);
			// TODO: Create a user and store the access code
			// TODO: Store the token in session
		});

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

});

server.get('/github/error', function showError(req, res) {
	res.render('error.jade', {});
});

server.listen(3000);
