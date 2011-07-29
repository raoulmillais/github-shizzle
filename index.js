var GitHubApi = require('github').GitHubApi,
	eyes = require('eyes'),
	config = require('./config').config,
	github, repoApi;

github = new GitHubApi(true);

/* GET USER FOLLOWERS

github.getUserApi().getFollowers('raoulmillais', function(err, followers) {
	eyes.inspect(followers);
});
*/

github.authenticateToken(config.sourceusername, config.secrettoken);

repoApi = github.getRepoApi();
eyes.inspect(repoApi);
repoApi.getUserRepos(config.sourceusername, function showRepos(err, repos) {
	eyes.inspect(repos);
});
