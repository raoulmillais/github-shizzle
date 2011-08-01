var User;

exports.User = User = function(code) {
	this.code = code;
	this.hasFork = false;
};

User.prototype.setUserInfo = function(userInfo) {
	this.name = userInfo.name;
	this.username = userInfo.login;
};
