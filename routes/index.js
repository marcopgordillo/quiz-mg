var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var temaController = require('../controllers/tema_controller');
var userController = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: [] });
});

router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Autores', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId',						quizController.load);	// Autoload :quizId

// Autoload de comandos con :commentId
router.param('commentId',					commentController.load);	// Autoload :commentId

// Autoload de comandos con :temaId
router.param('temaId',						temaController.load);	// Autoload :temaId

// Autoload de comandos con :userId
router.param('userId',						userController.load);	// Autoload :userId

// Definición de rutas de session
router.get('/login', 						sessionController.new);	// formulario login
router.post('/login', 						sessionController.create);	// crear sesión
router.delete('/logout', 					sessionController.destroy);	// destruír sesión
router.get('/admin/users',					sessionController.loginRequired, userController.index);	// Listado de usuarios
router.get('/admin/users/new',				sessionController.loginRequired, userController.new);	// Formulario Crear Usuarios
router.post('/admin/users/create',			sessionController.loginRequired, userController.create);	// Crear Usuarios
router.get('/admin/users/:userId(\\d+)',	sessionController.loginRequired, userController.show);	// Formulario Perfil Usuarios
router.get('/admin/users/:userId(\\d+)/edit',
											sessionController.loginRequired, userController.edit);	// Formulario Editar Usuarios
router.put('/admin/users/:userId(\\d+)',	sessionController.loginRequired, userController.update);	// Actualizar Usuarios
router.delete('/admin/users/:userId(\\d+)',	sessionController.loginRequired, userController.destroy);	// Eliminar Usuarios

// Definición de rutas de /quizes
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new', 					sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 				sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, quizController.destroy);

// Definición de rutas de Comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',		commentController.create);
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
											sessionController.loginRequired, commentController.publish);

// Definición de rutas de Temas
router.get('/quizes/temas',					temaController.index);
router.get('/quizes/temas/:temaId(\\d+)',	temaController.show);
router.get('/quizes/temas/new',				sessionController.loginRequired, temaController.new);
router.post('/quizes/temas/create', 				sessionController.loginRequired, temaController.create);
router.get('/quizes/temas/:temaId(\\d+)/edit', 	sessionController.loginRequired, temaController.edit);
router.put('/quizes/temas/:temaId(\\d+)', 		sessionController.loginRequired, temaController.update);
router.delete('/quizes/temas/:temaId(\\d+)', 		sessionController.loginRequired, temaController.destroy);

module.exports = router;