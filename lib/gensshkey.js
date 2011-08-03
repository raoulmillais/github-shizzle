var exec = require('child_process').exec;

function Gensshkey(email) {
	this.email = email;
};

exports.Gensshkey = Gensshkey;

Gensshkey.prototype.generate = function() {
	var cmd = 'ssh-keygen -t rsa -C "' + this.email + '" -N "" -f my.key ';
	exec(cmd, function (error, stdout, stderr) { 
		console.log(stdout);
	});
};
