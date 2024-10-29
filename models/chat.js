'use strict';

module.exports = (sequelize, DataTypes) => {
	const chat = sequelize.define('chat', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			unique: true,
			autoIncrement: true,
		},

		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},

		recipient_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},

		message: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},

	{
		indexes: [
			{
				name: 'user_id',
				unique: false,
				fields: ['user_id'],
			}
		]
	});

	return chat;
}