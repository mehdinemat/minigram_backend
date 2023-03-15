const userAuth = require('../controllers/authController')
const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()


router.post('/register' , userAuth.register)
router.post('/login' , userAuth.login)
router.post('/refresh_token' , userAuth.generateAccessToken)
router.post('/logout' , userAuth.logout)
router.patch(`/saved/:id` , auth , userAuth.savedPost)
router.patch(`/unsaved/:id` , auth , userAuth.unSavedPost)
module.exports = router
