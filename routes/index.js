var express = require('express');
var router = express.Router();
const _ = require("underscore");
const indexController = require('../controllers/indexController');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/profile-pic/'); 
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname); // Generates a unique filename with extension
        cb(null, uniqueName);
    }
});
const upload_profile = multer({ storage: storage });

function preventUserSession(req, res, next) {
    next();
}

router.get('/', preventUserSession, indexController.dashboard);
router.get('/admin/chat/:user_id', indexController.adminToUser);
router.get('/user/chat/:user_id', indexController.userToAdmin);

router.get('/login', indexController.userLogin);
router.get('/signup', indexController.userSignup);

router.post('/login-callback', indexController.userLoginCallback);
router.post('/signup-callback', upload_profile.single('emp_profile_pic'), indexController.userSignupCallback);




module.exports = router;