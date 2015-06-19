// Definición del modelo User

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		'User', 
		{ username:
			{ type: DataTypes.STRING(30),
			  validate: { notEmpty: {msg: "-> Falta Username"}}
			},
		  password:
			{ type: DataTypes.STRING(120),
			  validate: { notEmpty: {msg: "-> Falta Password"}}
			}		  
		}
	);
};