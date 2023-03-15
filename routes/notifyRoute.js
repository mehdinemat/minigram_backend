const express = require('express')
const auth = require('../middleware/auth')
const notifyController =require('../controllers/notifyController')
const router = express.Router()


router.post('/notify' , auth , notifyController.createNotify )
router.delete('/notify/:id' , auth , notifyController.deleteNotify)
router.get('/notify' , auth , notifyController.getNotify)
router.patch('/notify/:id' , auth , notifyController.isReadNotify)
router.delete('/notify' , auth , notifyController.deleteNotify)
module.exports = router