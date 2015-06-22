// Definición del modelo Comment con validación

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		'Comment',
		{ texto:
			{ type: DataTypes.STRING,
			  validate: { notEmpty: {msg: "-> Falta Comentario"}}
			},
		  publicado:
		  	{ type: DataTypes.BOOLEAN,
		  	  defaultValue: false
		  	}
		},
		{
			classMethods: {
			      getCountCommented: function () {				
					return sequelize.query('SELECT count(distinct "QuizId") as count FROM "Comments"',
						{ type: sequelize.QueryTypes.SELECT }
					);
				  },
			      method2: function() {}
			    },
		    instanceMethods: {
		      method3: function() {}
		    }
		}
	);
};