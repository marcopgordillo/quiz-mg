var path = require('path');
var hashpw = require('../controllers/mw_controller').hashpw;

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

// Importar la definición de la tabla Comment
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Importar la definición de la tabla Tema
var Tema = sequelize.import(path.join(__dirname, 'tema'));

// Importar la definición de la tabla User
var User = sequelize.import(path.join(__dirname, 'user'));

// Indicar la relación 1-N, que añade la columna QuizId en la tabla Comment que contiene la clave externa (foreign key)
// que indica que quiz está asociado con un comentario.
Comment.belongsTo(Quiz);	// Indica que un Comment pertenece a un Quiz
Quiz.hasMany(Comment); 		// Indica que un Quiz puede tener muchos comments.

Quiz.belongsTo(Tema);		// Indica que un Quiz pertenece a un Tema.
Tema.hasMany(Quiz);			// Indica que un Tema puede tener muchos quizes.

// Exportar las tablas
exports.Quiz = Quiz;
exports.Comment = Comment;
exports.Tema = Tema;
exports.User = User;

// sequelize.sync() crea e inicializa la tabla de preguntas en BDD

sequelize.sync().then(function () {
	
	// Inicializa la tabla Tema
	Tema.count().then(function (count) {
		if (count === 0) { // La tabla se inicializa solo si eśtá vacía.
			Tema.create({tema: 'Otro'});
			Tema.create({tema: 'Humanidades'});
			Tema.create({tema: 'Ocio'});
			Tema.create({tema: 'Ciencia'});
			Tema.create({tema: 'Tecnología'})
				.then(function () {
					console.log('Tabla Tema incializada');
				});
		}
	});

	// then(..) ejecuta el manejador una vez creada la tabla.
	Quiz.count().then(function (count) {
		if (count === 0) { // La tabla se inicializa solo si eśtá vacía.
			Quiz.create({pregunta: '¿Capital de Italia?', respuesta: 'Roma', TemaId: 1});
			Quiz.create({pregunta: '¿Capital de Portugal?', respuesta: 'Lisboa', TemaId: 1})
				.then(function () {
					console.log('Tabla Quiz incializada');
				});
		}
	});

	// Inicializa la tabla User
	User.count().then(function (count) {
		if (count === 0) { // La tabla se inicializa solo si eśtá vacía.
			User.create({username: 'admin', password: hashpw('123456')});
			User.create({username: 'pepe', password: hashpw('654321')})
				.then(function () {
					console.log('Tabla User incializada');
				});
		}
	});

	/*Quiz.destroy({
		where: {
    		id: 1
  		}
	});*/	
});