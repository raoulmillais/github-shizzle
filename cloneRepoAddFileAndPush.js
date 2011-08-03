var sys = require('sys'),
	exec = require('child_process').exec,
	step = require('step');

function puts(error, stdout, stderr) { sys.puts(stdout) }

(function cloneRepoAndPushNewFile(repository, commitMessage){

	var repositoryDirectory = 
		"." +
		repository.substr(
					repository.lastIndexOf('/')
				).replace('.git','');
				
	console.log('path of repo = '+ repositoryDirectory);
	
	step(
	function(){
		exec("git clone "+ repository, this);		
	},
	function () {
		//do some kind editing in here for example create a test file.
	  exec("touch test.js",{cwd:repositoryDirectory}, this);
	  console.log(process.cwd());
	  console.log("created test file");
	},
	function () {
	  exec('git add -A', {cwd: repositoryDirectory},this);
	  console.log("added file");
	},
	function () {
		exec('git commit -m "' + commitMessage +'"',{cwd: repositoryDirectory}, this); 
		console.log("commit file");
	},
	function () {
	  exec("git push origin master",{cwd: repositoryDirectory}, this);
	  console.log("pushed")
	});
})("git@github.com:raoulmillais/github-shizzle.git", "did some stuff committed via node gitness");
