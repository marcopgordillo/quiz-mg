var models = require('../models/models');

// Autoload -> factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
	models.Quiz.findById(quizId)
				.then(function (quiz) {
					if (quiz) {
						req.quiz = quiz;
						next();
					} else{
						next(new Error('No existe QuizId' + quizId));
					}
				})
				.catch(function (error) { next(error); });
};


// GET /quizes
exports.index = function (req, res) {	
	
	if (req.query.search) {
		models.Quiz.findAll(
			{where: ['pregunta like ?', '%'+req.query.search.replace(" ","%")+'%'],
			 order:[['pregunta', 'ASC']]}
		).then(function (quizes) { // Se recupera todas las preguntas que coinciden la búsqueda
			res.render('quizes/index.ejs', {quizes: quizes, title: 'Preguntas', errors: []});
		}).catch(function(error) { next(error);});
	} else{
		models.Quiz.findAll().then(function (quizes) { // Se recupera todas las preguntas
			res.render('quizes/index.ejs', {quizes: quizes, title: 'Preguntas', errors: []});
		}).catch(function(error) { next(error);});
	}

	
};

// GET /quizes/:id
exports.show = function (req, res) {
	res.render('quizes/show', {quiz: req.quiz, title: 'Preguntas', errors: []});	
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
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
			
	res.render('quizes/new', {quiz: quiz, title: 'Añadir', errors: []});	
};

// POST /quizes/create
exports.create = function (req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	
	quiz
		.validate()
		.then(function (err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, title: 'Añadir', errors: err.errors});
			} else{
				// guarda en DB los campos pregunta y respuesta de quiz
				quiz
					.save({fields:['pregunta', 'respuesta']})
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
	res.render('quizes/edit', {quiz: quiz, title: 'Editar', errors: []});
};

// PUT /quizes/:id
exports.update = function (req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(function (err) {
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, title: 'Editar', errors: err.errors});
		} else{
			req.quiz
			.save({fields:['pregunta', 'respuesta']})
			.then(function () {
				res.redirect('/quizes');	// Redirección HTTP (URL relativo) a lista de preguntas
			})
			.catch(function(error) { next(error);});
		}
	});
};

exports.destroy = function (req, res) {	
	req.quiz
	.destroy()
	.then(function () {
		res.redirect('/quizes');
	})
	.catch(function(error) { next(error);});
};