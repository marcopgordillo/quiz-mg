var models = require('../models/models');

// Autoload -> factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
	models.Quiz.find({
					where: { id: Number(quizId) },
				 	include: [{ model: models.Comment}]
				})
				.then(function (quiz) {
					if (quiz) {
						req.quiz = quiz;
						//next();
					} else{
						next(new Error('No existe QuizId' + quizId));
					}
				})
				.then(function () {
					models.Tema.find({
							where: { id: Number(req.quiz.TemaId) },
							attributes: ['tema']
					})
					.then(function (tema) {
						if (tema) {
							req.quiz.tema = tema.tema;
							next();
						} else{
							next(new Error('No existe TemaId' + req.quiz.TemaId));
						}
					})
					.catch(function (error) { next(error); });
				})
				.catch(function (error) { next(error); });	
};


// GET /quizes
exports.index = function (req, res, next) {	
	
	if (req.query.search) {
		models.Quiz.findAll(
			{where: ['pregunta like ?', '%'+req.query.search.replace(" ","%")+'%'],
			 order:[['pregunta', 'ASC']]}
		).then(function (quizes) { // Se recupera todas las preguntas que coinciden la búsqueda
			res.render('quizes/index', {quizes: quizes, title: 'Preguntas', errors: []});
		}).catch(function(error) { next(error);});
	} else{
		models.Quiz.findAll().then(function (quizes) { // Se recupera todas las preguntas
			res.render('quizes/index', {quizes: quizes, title: 'Preguntas', errors: []});
		}).catch(function(error) { next(error);});
	}	
};

// GET /quizes/:id
exports.show = function (req, res) {
	res.render('quizes/show', {quiz: req.quiz, tema: req.quiz.tema, title: 'Preguntas', errors: []});	
};

// GET /quizes/:id/answer
exports.answer = function (req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta)
		resultado = 'Correcto';
		
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, title: 'Respuesta', errors: []});	
};

// GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build( // crea el objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta", TemaId: null}
	);

	models.Tema.findAll().then(function (temas) { // Se recupera todos los temas			
			res.render('quizes/new', {quiz: quiz, temas: temas, edit: false, title: 'Añadir', errors: []});	
		}).catch(function(error) { next(error);});	
};

// POST /quizes/create
exports.create = function (req, res, next) {
	var quiz = models.Quiz.build( req.body.quiz );
	
	quiz
	.validate()
	.then(function (err) {
		if (err) {
			models.Tema.findAll().then(function (temas) { // Se recupera todos los temas			
				res.render('quizes/new', {quiz: quiz, temas: temas, edit: false, title: 'Error', errors: err.errors});
			}).catch(function(error) { next(error);});			
		} else{
			// guarda en DB los campos pregunta y respuesta de quiz
			quiz
				.save({fields:['pregunta', 'respuesta', 'TemaId']})
				.then(function () {
					res.redirect('/quizes');	// Redirección HTTP (URL relativo) a lista de preguntas
				})
				.catch(function(error) { next(error);});
		}
	});	
};

// GET /quizes/:id/edit
exports.edit = function (req, res) {
	var quiz = req.quiz;
	
	models.Tema.findAll().then(function (temas) { // Se recupera todos los temas			
			res.render('quizes/edit', {quiz: quiz, temas: temas, edit: true, title: 'Editar', errors: []});
		}).catch(function(error) { next(error);});	
	
};

// PUT /quizes/:id
exports.update = function (req, res, next) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.TemaId = req.body.quiz.TemaId;

	req.quiz
	.validate()
	.then(function (err) {
		if (err) {
			models.Tema.findAll().then(function (temas) { // Se recupera todos los temas			
				res.render('quizes/edit', {quiz: req.quiz, temas: temas, edit: true, title: 'Error', errors: err.errors});
			}).catch(function(error) { next(error);});
			
		} else{
			req.quiz
			.save({fields:['pregunta', 'respuesta', 'TemaId']})
			.then(function () {
				res.redirect('/quizes');	// Redirección HTTP (URL relativo) a lista de preguntas
			})
			.catch(function(error) { next(error);});
		}
	});
};

// DELETE /quizes/:id
exports.destroy = function (req, res) {	
	req.quiz
	.destroy()
	.then(function () {
		res.redirect('/quizes');
	})
	.catch(function(error) { next(error);});
};

// GET /quizes/statistics
exports.stats = function (req, res, next) {
	var stats = {};
		
	models.Quiz.count()
		.then(function (count) {
			stats.quizes = count;
			return models.Comment.count();
		})
		.then(function (count) {
			stats.comments = count;
			return models.Comment.getCountCommented();
		})
		.then(function (count) {			
			stats.comUnicos = count[0].count;		
			res.render('quizes/statistics', {stats: stats, title: 'Estadísticas', errors: []});				
		}).catch(function(error){next(error);});
};