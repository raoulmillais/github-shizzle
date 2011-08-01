var express = require('express'),
	eyes = require('eyes'),
	http = require('http'),
	jade = require('jade'),
	config = require('./config').config,
	User = require('./lib/user').User,
	Step = require('step'),
	Git = require('treeeater').Git,
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
	var github = new GitHubApi(true),
		user;

	// TODO: Handle no accessToken
	github.authenticateOAuth(req.session.accessToken);

	Step(
		function getUserInfo() {
			github.getUserApi().show('', this);
		},
		function handleShowUserResponseAndGetRepos(userErr, userResponse) {
			if (userErr) {
				console.error('Error getting user: %j', userErr);
				res.redirect('/github/error');
				return;
			}

			console.log('Received user info');

			user = new User(req.session.user.code);
			user.setUserInfo(userResponse);
			github.getRepoApi().getUserRepos(user.username, this);
		}, 
		function handleReposReponseAndRenderView(reposErr, reposResponse) {
			if (reposErr) {
				console.error('Error getting user: %j', reposErr);
				res.redirect('/github/error');
				return;
			}

			console.log('Received user repos');
			req.session.repos = reposResponse;
			res.render('user.jade', { locals: { user: user, repos: reposResponse } });
		}
	);

});

server.get('/github/fork', function createFork(req, res) {
	var github = new GitHubApi(true),
		git = new Git({ cwd: config.reposPath });

	// TODO: Handle no accessToken
	github.authenticateOAuth(req.session.accessToken);

	// TODO: Check whether the user has already forked the repository
	Step(
		function requestToFork() {
			github.getRequest().post('repos/fork/' + config.storeTemplateAccount + '/' + config.storeTemplateRepo,
								{} /* postParameters */, null /* requestOptions */, this);

		},
		function handleForkResponseAndClone(forkErr, forkResponse) {
			if (forkErr) {
				console.error('Error forking repository: %j', forkErr);
			}

			console.log('Successfully forked repositoryj');
			git.clone(forkResponse.clone_url, this);
		},
		function renderView(cloneErr, cloneResponse) {
			if (cloneErr) {
				console.error('Error cloning the new fork: %j', cloneErr);
			}
			console.log('Cloned the new fork');
		}
	);
	github.getRequest().post('repos/fork/' + config.storeTemplateAccount + '/' + config.storeTemplateRepo,
								{} /* postParameters */, null /* requestOptions */,
								function handlerForkResponse(forkError, forkResponse) {

		res.redirect('/github/user');
	});

});

server.get('/github/error', function showError(req, res) {
	res.render('error.jade', {});
});

server.listen(3000);
