var models = require('../models/models');

// GET /quizes
exports.index = function (req, res) {
	models.Quiz.findAll().then(function (quizes) {		
		res.render('quizes/index.ejs', {quizes: quizes, title: 'Preguntas'});
	});
};

// GET /quizes/:id
exports.show = function (req, res) {	
	models.Quiz.findById(req.params.quizId).then(function (quiz) {		
		res.render('quizes/show', {quiz: quiz, title: 'Preguntas'});
	});
};

// GET /quizes/:id/answer
exports.answer = function (req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {		
		if (req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto', title: 'Respuesta'});
		} else{
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto', title: 'Respuesta'});
		}
	});	
};