const express = require('express');
const router = express.Router();
const { signup, login, userDetailsController, updateUserProfile } = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require ('multer')




const upload = multer({ dest: "uploads/" })

router.post('/signup', signup);
router.post('/login', login);
router.get('/userDetail',authMiddleware, userDetailsController);
router.put("/updateProfile", authMiddleware, upload.single("profileImage"), updateUserProfile);


module.exports = router;


// http://localhost:3000/api/user/userDetail 
// http://localhost:3000/api/user/updateProfile 
 
