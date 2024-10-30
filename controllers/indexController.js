const _ = require("underscore");
const models = require("../models");

module.exports = {
	dashboard: async (req, res) => {
		try {
			const params = _.extend(req.query || {}, req.params || {}, req.body || {});
			let title = "Dashboard";

            const user_list = await models.user.findAll({ raw: true });

            const messageData = {};
            // Iterate over the organization list and fetch extra data for each one
            for (const user of user_list) {
                const messageQry = `SELECT COUNT(id) AS total FROM chats WHERE user_id = ${user.id} AND recipient_id = 1`;

                const get_messages = await req.app.locals.sequelize.query(messageQry, {
                    type: req.app.locals.sequelize.QueryTypes.SELECT
                });
                // const get_messages = await models.chat.findAll({
                //     where: {
                //         recipient_id: 1,
                //         user_id: user.id
                //     },
                //     attributes: ['id']
                // });
                messageData[user.id] = get_messages[0].total;
            }

            // Add extra data to each organization
            const enhancedUserList = user_list.map(user => ({
                ...user,
                message_count: messageData[user.id]
            }));

			res.render('pages/front/dashboard', { title, layout: 'layouts/front-layout', user_list: enhancedUserList });
		} catch (e) {
			console.log('error', e);
		}
	},
    adminToUser: async (req, res) => {
		try {
			const params = _.extend(req.query || {}, req.params || {}, req.body || {});

            const selected_user = await models.user.findOne({ where: { id: params.user_id }, raw: true });
            if(!selected_user){
                return res.redirect('/');
            }
            const user_list = await models.user.findAll({ raw: true });

            const messageQry = `SELECT * FROM chats WHERE (user_id = 1 AND recipient_id = ${params.user_id}) OR (user_id = ${params.user_id} AND recipient_id = 1) ORDER BY id ASC`;

            const message_list = await req.app.locals.sequelize.query(messageQry, {
                type: req.app.locals.sequelize.QueryTypes.SELECT
            });

            let title = "Chat with "+selected_user.name;

			res.render('pages/front/admin-chat', { title, layout: 'layouts/front-layout', user_list, selected_user, message_list });
		} catch (e) {
			console.log('error', e);
		}
	},
    userToAdmin: async (req, res) => {
		try {
            
			const params = _.extend(req.query || {}, req.params || {}, req.body || {});
            console.log(params);
            const selected_user = await models.user.findOne({ where: { id: params.user_id }, raw: true });
            if(!selected_user){
                return res.redirect('/');
            }

            const messageQry = `SELECT * FROM chats WHERE (user_id = 1 AND recipient_id = ${params.user_id}) OR (user_id = ${params.user_id} AND recipient_id = 1) ORDER BY id ASC`;

            const message_list = await req.app.locals.sequelize.query(messageQry, {
                type: req.app.locals.sequelize.QueryTypes.SELECT
            });

            let title = "Chat with Admin";

			res.render('pages/front/user-chat', { title, layout: 'layouts/front-layout', selected_user, message_list });
		} catch (e) {
			console.log('error', e);
		}
	}
}