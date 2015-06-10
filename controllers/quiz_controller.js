// GET /quizes/question
exports.question = function (req, res) {
	res.render('quizes/question', {pregunta: '¿Capital de Italia?', title: 'Preguntas'});
};

// GET /quizes/question
exports.answer = function (req, res) {
	if (req.query.respuesta === 'Roma') {
		res.render('quizes/answer', {respuesta: 'Correcto', title: 'Respuesta'});
	} else{
		res.render('quizes/answer', {respuesta: 'Incorrecto', title: 'Respuesta'});
	}
};