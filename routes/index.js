var express = require('express');
var router = express.Router();
const _ = require("underscore");
const indexController = require('../controllers/indexController');

function preventUserSession(req, res, next) {
    next();
}

router.get('/', preventUserSession, indexController.dashboard);
router.get('/admin/chat/:user_id', indexController.adminToUser);
router.get('/user/chat/:user_id', indexController.userToAdmin);

module.exports = router;