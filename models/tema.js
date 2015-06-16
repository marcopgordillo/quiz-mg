// Definición del modelo Temas con validación

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		'Tema',
		{ tema:
			{ type: DataTypes.STRING,
			  validate: { notEmpty: {msg: "-> Falta Tema"}}
			}		  
		}
	);
};