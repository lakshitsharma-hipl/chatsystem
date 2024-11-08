const _ = require("underscore");
const models = require("../models");
const crypto = require('crypto');
const functions = require('./helper-funtions');


module.exports = {
  userLogin: async (req, res) => {
    try {
      const params = _.extend(req.query || {}, req.params || {}, req.body || {});
      let title = "Login";

      res.render('pages/front/login', { title, layout: 'layouts/front-layout'});
    } catch (e) {
      console.log('error', e);
    }  
  },
  userSignup: async (req, res) => {
    try {
      const params = _.extend(req.query || {}, req.params || {}, req.body || {});
      let title = "Signup";

      res.render('pages/front/signup', { title, layout: 'layouts/front-layout'});
    } catch (e) {
      console.log('error', e);
    }  
  },
  userLoginCallback: async (req, res) => {
  
  },  
  userSignupCallback: async (req, res) => {    
    const params = req.body;
    const profile_pic_nm = req.file.filename;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const full_name = first_name+ ' ' + last_name;
    const email = req.body.emp_email;
    const password = req.body.emp_password;
    const enc_pass = functions.generatePassword(password);
    const role = req.body.user_role ? req.body.user_role : 'user';

    var insertQuery = `INSERT INTO users (name, email, avatar, password, user_role) VALUES (?, ?, ?, ?, ?)`;
    const insertData = await req.app.locals.sequelize.query(insertQuery, {
      replacements: [full_name, email, profile_pic_nm, password, role],
      type: req.app.locals.sequelize.QueryTypes.INSERT
    });
    
    if(insertData) {
      res.json({status: 'success', error: 'Something went wrong!', errDev: 'Register insert id not found'});
    } else {
      res.json({status: 'failed', error: 'Something went wrong!', errDev: 'Register insert id not found'});
    }
    console.log('Insert Check', insertData);

    
  },
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

            // const messageQry = `SELECT * FROM chats WHERE (user_id = 1 AND recipient_id = ${params.user_id}) OR (user_id = ${params.user_id} AND recipient_id = 1) ORDER BY id DESC LIMIT 25`;
            const messageQry = `
              SELECT * FROM (
                  SELECT * FROM chats 
                  WHERE (user_id = 1 AND recipient_id = ${params.user_id}) 
                    OR (user_id = ${params.user_id} AND recipient_id = 1) 
                  ORDER BY id DESC 
                  LIMIT 25
              ) AS latest_messages
              ORDER BY id ASC;
          `;


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
            const selected_user = await models.user.findOne({ where: { id: params.user_id }, raw: true });
            if(!selected_user){
                return res.redirect('/');
            }

            // const messageQry = `
            //     SELECT * FROM chats 
            //     WHERE (user_id = 1 AND recipient_id = ${params.user_id}) 
            //       OR (user_id = ${params.user_id} AND recipient_id = 1) 
            //     ORDER BY id DESC 
            //     LIMIT 25
            // `;
            const messageQry = `
            SELECT * FROM (
                SELECT * FROM chats 
                WHERE (user_id = 1 AND recipient_id = ${params.user_id}) 
                  OR (user_id = ${params.user_id} AND recipient_id = 1) 
                ORDER BY id DESC 
                LIMIT 25
            ) AS latest_messages
            ORDER BY id ASC;
        `;
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