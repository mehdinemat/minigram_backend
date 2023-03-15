const express = require('express')
const CommentController = require('../controllers/commentController')
const auth = require('../middleware/auth')

const router = express.Router()

    router.post('/comment' , auth,CommentController.createComment)
    router.patch('/comment' , auth , CommentController.updateComment)
    router.delete('/comment/:id' , auth , CommentController.deleteComment)
    router.patch('/comment/:id/like' , auth, CommentController.likeComment)
    router.patch('/comment/:id/unlike' , auth, CommentController.unLikeComment)
module.exports= router