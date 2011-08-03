var Step = require('step'),
    exec = require('child_process').exec,
    fs = require('fs');

function Gensshkey(email) {
	this.email = email;
};

exports.Gensshkey = Gensshkey;

Gensshkey.prototype.generate = function() {
    var cmd = 'ssh-keygen -t rsa -C "' + this.email + '" -N "" -f me.key ';
    exec(cmd);
    
    fs.readFile('../me.key.pub', function (err, data) {
      if (data){
        console.log(data.toString('utf8'));
        return data.toString('utf8')
      }
    });
};
