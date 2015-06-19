var models = require('../models/models');
var hashpw = require('../controllers/mw_controller').hashpw;

// Comprueba si el usuario está registrado en users
// Si la autenticación falla o hay errores se ejecuta callback(error).
exports.autenticar = function (login, password, callback) {
	models.User.find({
							where: { username: login }							
					})
					.then(function (user) {
						if (user) {							
							if (hashpw(password) === user.password) {
								callback(null, user);
							} else{
								callback(new Error('Password erróneo.'));
							}
						} else {
							callback(new Error('No existe el usuario.'));
						}
					});
};

// Autoload -> factoriza el código si ruta incluye :userId
exports.load = function (req, res, next, userId) {
	models.User.find({
					where: { id: Number(userId) }				 	
				})
				.then(function (user) {
					if (user) {
						req.user = user;
						next();
					} else{
						next(new Error('No existe UserId' + userId));
					}
				})
				.catch(function (error) { next(error); });
};

// GET /admin/users
exports.index = function (req, res, next) {	
	
	if (req.query.search) {
		models.User.findAll(
			{where: ['username like ?', '%'+req.query.search.replace(" ","%")+'%'],
			 order:[['username', 'ASC']]}
		).then(function (users) { // Se recupera todas las preguntas que coinciden la búsqueda
			res.render('admin/users/index', {users: users, title: 'Usuarios', errors: []});
		}).catch(function(error) { next(error);});
	} else{
		models.User.findAll().then(function (users) { // Se recupera todas las preguntas
			res.render('admin/users/index', {users: users, title: 'Usuarios', errors: []});
		}).catch(function(error) { next(error);});
	}
};

// GET /admin/users/:userid
exports.show = function (req, res) {
	res.render('admin/users/show', {user: req.user, title: 'Perfil Usuario', errors: []});
};

// GET /admin/users/new
exports.new = function (req, res) {
	var user = models.User.build( // crea el objeto quiz
		{username: "Username", password: "password"}
	);

	res.render('admin/users/new', {user: user, edit: false, title: 'Añadir', errors: []});
};

// POST /admin/users/create
exports.create = function (req, res, next) {
	req.body.user.password = hashpw(req.body.user.password);
	var user = models.User.build( req.body.user );

	user
	.validate()
	.then(function (err) {
		if (err) {			
			res.render('admin/users/new', {user: user, edit: false, title: 'Error', errors: err.errors});			
		} else {
			// guarda en DB los campos pregunta y respuesta de user
			user
				.save({fields:['username', 'password']})
				.then(function () {
					res.redirect('/admin/users');	// Redirección HTTP (URL relativo) a lista de usuarios
				})
				.catch(function(error) { next(error);});
		}
	});	
};

// GET /admin/users/:userId/edit
exports.edit = function (req, res) {
	res.render('admin/users/edit', {user: req.user, edit: true, title: 'Editar Usuario', errors: []});	
};

// PUT /admin/users/:userId
exports.update = function (req, res, next) {
	req.user.username = req.body.user.username;
	req.user.password = hashpw(req.body.user.password);

	req.user
	.validate()
	.then(function (err) {
		if (err) {			
				res.render('admin/users/edit', {user: req.user, edit: true, title: 'Error', errors: err.errors});
		} else{
			req.user
			.save({fields:['username', 'password']})
			.then(function () {
				res.redirect('/admin/users');	// Redirección HTTP (URL relativo) a lista de preguntas
			})
			.catch(function(error) { next(error);});
		}
	});
};

// DELETE /admin/users/:userId
exports.destroy = function (req, res, next) {	
		
	req.user
	.destroy()
	.then(function () {
		res.redirect('/admin/users');
	})
	.catch(function(error) { next(error);});
	
};