var path = require('path');

// Postgres DATABASE_URL = postgress://user:password@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6]||null);
var user 		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol 	= (url[1]||null);
var dialect		= (url[1]||null);
var port 		= (url[5]||null);
var host	 	= (url[4]||null);
var storage 	= process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BDD SQLite:
//var sequelize = new Sequelize(null, null, null,
var sequelize = new Sequelize(DB_name, user, pwd,
		{	dialect: 	dialect,
			protocol: 	protocol,
			port: 		port,
			host: 		host,
			storage: 	storage, 	// Solo SQLite (.env)
			omitNull: 	true		// Solo Postgress
		}
	);

// Importar  y exportar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa la tabla de preguntas en BDD

sequelize.sync().then(function () {
	// then(..) ejecuta el manejador una vez creada la tabla.
	Quiz.count().then(function (count) {
		if (count === 0) { // La tabla se inicializa solo si eśtá vacía.
			Quiz.create({pregunta: '¿Capital de Italia?', respuesta: 'Roma', tema: 1});
			Quiz.create({pregunta: '¿Capital de Portugal?', respuesta: 'Lisboa', tema: 2})
				.then(function () {
					console.log('Base de datos Inicializada');
				});
		}
	});
	/*Quiz.destroy({
		where: {
    		id: 1
  		}
	});*/	
});