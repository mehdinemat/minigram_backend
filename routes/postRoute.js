const express = require('express')
const auth = require('../middleware/auth')
const usersPost = require('../controllers/postController')
const router = express.Router()


    router.route('/posts').post(auth,usersPost.createPost ).get(auth,usersPost.getPost)
    router.delete('/posts/:id' , auth , usersPost.deletePost)
    router.patch('/post/:id' , auth , usersPost.updatePost)
    router.get('/post/:id' , auth , usersPost.getDetailPost)
    router.post('/post/:id/like' , auth , usersPost.likePost)
    router.post('/post/:id/unlike' , auth , usersPost.unLikePost)
    router.get('/postdetails/:id' , auth , usersPost.postDetails)
    router.get('/getpostdiscover' , auth , usersPost.getPostDiscover )
    router.get('/suggestion/:id' , auth , usersPost.getSuggestion)
module.exports = router