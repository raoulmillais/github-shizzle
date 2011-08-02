var exec = require('child_process').exec;

function output(error, stdout, stderr) { 
	console.log(stdout) 
};

exec('ssh-keygen -t rsa -C "me@me.com" -N "" -f my.key ', output);
