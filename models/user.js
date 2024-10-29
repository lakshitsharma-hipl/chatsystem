'use strict';

module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			unique: true,
			autoIncrement: true,
		},

		email: {
			type: DataTypes.STRING,
			allowNull: false
		},

		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		avatar: {
			type: DataTypes.STRING,
			allowNull: true
		},

		password: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	},

	{
		indexes: [
			{
				name: 'email',
				unique: true,
				fields: ['email'],
			}
		]
	});

	return user;
}