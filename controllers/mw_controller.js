var crypto = require('crypto');
var destroySession = require('./session_controller').destroy;

// Módulo de encripción de password
exports.hashpw = function (password) {
	return crypto.pbkdf2Sync(password, 'salt', 4096, 60, 'sha256').toString('hex');
};

// Módulo de autoLogout
exports.autoLogout = function (req, res, next) {
	var maxAge = 2*60*1000;
	var now = new Date().getTime();

	if (req.session && req.session.user) {    
        
		if (req.session.time < (now-maxAge))
    		delete req.session.user;          
    
  	}

	req.session.time = now;
	res.locals.session = req.session;
	next();
};