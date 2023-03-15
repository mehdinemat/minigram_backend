const express=  require('express')
const auth = require('../middleware/auth')
const messageController = require('../controllers/messageController')
const router = express.Router()


    router.get('/message/:id' , auth , messageController.getMessage)
    router.post('/message' , auth , messageController.createMessage)
    router.get('/conversation' , auth , messageController.getConversation)
    router.get('/conversation/:id' , auth , messageController.getConverText)
    router.delete('/conversation/:id' , auth , messageController.deleteConversation)
    router.delete('/message/:id' , auth , messageController.deleteMessage)
    router.patch('/readmessage' , auth , messageController.readMessage)
module.exports = router