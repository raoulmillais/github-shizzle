var https = require('https'),
	config = require('./config').config,
	eyes = require('eyes'),
	GithubAccess;


exports.GithubAccess = GithubAccess = function GithubAccess(code) {
	this.client_id = config.githubapplicationclientid;
	this.secret = config.sithubclientsecret;
	this.code = code;
};

GithubAccess.prototype.getAccessToken = function() {
	var self = this,
		postData = {
			code: self.code,
			client_id: config.githubapplicationclientid,
			client_secret: config.githubclientsecret
		},
		reqOptions = { 
			port: 443,
			host: 'github.com',
			path: '/login/oauth/access_token',
			method: 'POST'
		},	req;
		
		req = https.request(reqOptions, function handleResponse(res) {
			eyes.inspect(res);
			res.on('data', function(d) {
				console.log('writing data from response');
				console.log(d.toString());
			});
		});

		console.log('URL MOTHERFUCKER!!!!!!!!!!!!!!!!!!!!!');
		console.log(req);


		eyes.inspect(postData);
		req.end(JSON.stringify(postData));

		req.on('error', function(e) {
			console.log('writing error from request');
			console.error(e);
		});

};
