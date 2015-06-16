var models = require('../models/models');

// Autoload -> factoriza el código si ruta incluye :temaId
exports.load = function (req, res, next, temaId) {
	models.Tema.find({
					where: { id: Number(temaId) },
				 	include: [{ model: models.Quiz}]
				})
				.then(function (tema) {
					if (tema) {
						req.tema = tema;
						next();
					} else{
						next(new Error('No existe TemaId' + temaId));
					}
				})
				.catch(function (error) { next(error); });
};


// GET /quizes/temas
exports.index = function (req, res, next) {	
	
	if (req.query.search) {
		models.Tema.findAll(
			{where: ['tema like ?', '%'+req.query.search.replace(" ","%")+'%'],
			 order:[['tema', 'ASC']]}
		).then(function (temas) { // Se recupera todas las preguntas que coinciden la búsqueda
			res.render('temas/index', {temas: temas, title: 'Temas', errors: []});
		}).catch(function(error) { next(error);});
	} else{
		models.Tema.findAll().then(function (temas) { // Se recupera todas las preguntas
			res.render('temas/index', {temas: temas, title: 'Temas', errors: []});
		}).catch(function(error) { next(error);});
	}	
};

// GET /quizes/temas/:temaId
exports.show = function (req, res, next) {	
	res.render('quizes/index', {quizes: req.tema.Quizzes, title: req.tema.tema, errors: []});
};

// GET /quizes/new
exports.new = function (req, res) {
	var tema = models.Tema.build( // crea el objeto quiz
		{tema: "Tema"}
	);
	res.render('temas/new', {tema: tema, edit: false, title: 'Añadir Tema', errors: []});
};

// POST /quizes/temas/create
exports.create = function (req, res, next) {
	var tema = models.Tema.build( req.body.tema );

	tema
	.validate()
	.then(function (err) {
		if (err) {			
			res.render('quizes/temas/new', {tema: tema, edit: false, title: 'Error', errors: err.errors});			
		} else{
			// guarda en DB los campos pregunta y respuesta de quiz
			tema
				.save({fields:['tema']})
				.then(function () {
					res.redirect('/quizes/temas');	// Redirección HTTP (URL relativo) a lista de preguntas
				})
				.catch(function(error) { next(error);});
		}
	});	
};

// GET /quizes/temas/:temaId/edit
exports.edit = function (req, res) {
	res.render('temas/edit', {tema: req.tema, edit: true, title: 'Editar Tema', errors: []});	
};

// PUT /quizes/temas/:temaId
exports.update = function (req, res, next) {
	req.tema.tema = req.body.tema.tema;	

	req.tema
	.validate()
	.then(function (err) {
		if (err) {			
				res.render('temas/edit', {tema: req.tema, edit: true, title: 'Error', errors: err.errors});			
		} else{
			req.tema
			.save({fields:['tema']})
			.then(function () {
				res.redirect('/quizes/temas');	// Redirección HTTP (URL relativo) a lista de preguntas
			})
			.catch(function(error) { next(error);});
		}
	});
};

// DELETE /quizes/temas/:temaId
exports.destroy = function (req, res, next) {	
	
	if (!req.tema.Quizzes.length) {
		models.Tema.findAll().then(function (temas) { // Se recupera todas las preguntas			
			var err = {errors: [new Error('El tema '+req.tema.tema+' tiene preguntas asignadas')]};			
			res.render('temas/index', {temas: temas, title: 'Temas', errors: err.errors});			
		}).catch(function(error) { next(error);});
		//next(new Error('El tema '+req.tema.tema+' tiene preguntas asignadas'));
	} else{
		req.tema
		.destroy()
		.then(function () {
			res.redirect('/quizes/temas');
		})
		.catch(function(error) { next(error);});
	}	
};