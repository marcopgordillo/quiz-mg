var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BDD SQLite:
var sequelize = new Sequelize(null, null, null,
		{dialect: 'sqlite', storage: 'quiz.sqlite'}
	);

// Importar  y exportar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa la tabla de preguntas en BDD
/*sequelize.sync().success(function () {
	Quiz.count().success(function (count) {
		if (count === 0) { // La tabla se inicializa solo si está vacía.
			Quiz.create({ pregunta: 'Capital de Italia', respuesta: 'Roma'})
				.success(function () {
					console.log('Base de datos inicializada');
				});
		}
	});
});*/

Quiz.sync({force: true}).then(function () {
  // Table created
  return Quiz.create({
    pregunta: '¿Capital de Italia?',
    respuesta: 'Roma'
  });
});