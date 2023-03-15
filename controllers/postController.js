const Post = require('../models/postModels')
const Comment = require('../models/commentModels')
const User = require('../models/userModels')
const cloudinary  = require('cloudinary')


  class ApiFeatures {
    constructor(query,queryString ){
      this.query = query 
      this.queryString = queryString
    }
    paginatin(){
      const page = this.queryString.page || 1
      const limit = 2
      const skip = (page - 1) * limit
      this.query = this.query.skip(skip).limit(limit)
      return this
    }
  }

const usersPost={

    createPost:async(req,res,)=>{
      try{

        let imgUrl = []
        let imagesUrl = ""
        const {content , newMedia } = req.body
        
        console.log(content, newMedia)
       
       const newPost = new Post({content , images:newMedia , user:req.user._id})
      await newPost.save()
       
       res.json({
        msg: 'Created Post!',
        newPost: {
            ...newPost._doc,
            user: req.user
        }
    })
      }catch(err) {return res.status(500).json({msg:err.message })}
    }
    ,
    getPost:async(req,res)=>{

      try{

        const features = new ApiFeatures(Post.find({user:[...req.user.following , req.user._id]}) , req.query).paginatin()

        const posts = await features.query.sort('-createdAt').populate("user" , "avatar username fullname followers")
        .populate({path:'comments',populate:{path:'user likes' , select:'-password'}})

      res.json({msg:"Success" , result:posts.length , posts})
      }catch(err){return res.status(500).json({msg:err.message})}
        
    },
    updatePost:async(req,res)=>{
     try{
     
       console.log(req.body.content , req.body.newMedia)
      const post = await Post.findByIdAndUpdate({_id:req.params.id } , {content:req.body.content , images:req.body.images }).populate("user likes" , "avatar username fullname followers").populate({path:'comments',populate:{path:'user likes' , select:'-password'}})
     
     
      console.log(post)
      res.json({msg:"Updated Post" , newPost:{ ...post._doc , content:req.body.content  , images:req.body.images }})

     }catch(err){return res.status(500).json({msg:err.message})}
    },
    likePost:async(req,res)=>{

     try{
       const post = await Post.find({_id:req.params.id , likes:req.user._id})
       
      if(post.length > 0){ return res.status(400).json({msg:"You liked this post."}) }
      const like = await Post.findByIdAndUpdate({_id:req.params.id} , { $push:{likes:req.user._id} }  , {new:true})
      if(!like) return res.status(400).json({msg: 'This post does not exist.'})

      res.json({msg: 'Liked Post!' , newPost:like})

     }catch(err){return res.status(500).json({msg: err.message})}
     
    },
    unLikePost:async(req,res)=>{

      try{
        const post= await Post.find({_id:req.params.id , likes:req.user._id})

          if(!post){return res.status(400).json({msg:"You Unliked before!"})}

          const newPost = await Post.findByIdAndUpdate({_id:req.params.id} , { $pull:{likes:req.user._id} })

          return res.status(200).json({msg:"unliked successfully"})

      }catch(err){return res.status(500).json({msg:err.message})}

    },
    getDetailPost : async (req, res)=>{

      try{
        const { id }= req.params

        const post = await Post.findOne({_id:id})
  
        if(!post){
          res.status(400).json({msg:"Post not found!"})  
        } 
        res.status(200).json({post})  

      }catch(err){return res.status(500).json({msg:err.message})}

    },
    postDetails:async(req,res)=>{
        const {id} = req.params
        try{

          const post =  await Post.findOne({_id:id}).populate("user").populate({path:"comments" , populate:{path:"likes user" , select:"-password"}})

          res.status(200).json({post})


        }catch(err){return res.status(500).json({msg:err.message})}
    },
    getPostDiscover : async(req,res)=>{

     try{

      const newArr = [...req.user.following ,req.user._id]
      const num = req.query.num || 2
      console.log(num)

      const post = await Post.aggregate([
        {
          $match:{user:{$nin:newArr}}

        },
        {
          $sample:{size:Number(num)}
        }
      ])

      res.status(200).json({post})


     }catch(err){res.status(500).json({msg:err.message})}
      


    },
    deletePost: async(req, res)=>{

     try{
      const post = await Post.findByIdAndDelete({_id:req.params.id , user:req.user._id })
      await Comment.deleteMany({_id:{$in:post.comments}})

      res.status(200).json({
        msg:"Deleted Post ",
        newPost :{
          post
        }
      })

     }catch(err){
          res.status(500).json({msg:err.message})
     }

    },
    getSuggestion:async(req,res)=>{

      try{
        const newArr = [...req.user.following , req.user._id]
        const users=  await User.aggregate([
          {$match:{_id:{$nin:newArr}}},
          {$sample:{size:Number(6)}},
          {$lookup:{from:'user' , localField:'following', foreignField:'_id' , as:'following'}},
          {$lookup:{from:'user' , localField:'followers' , foreignField:'_id' , as:'followers'}}
        ]).project('-password')
        return res.status(200).json({users , reuslt:users.length})

      }catch(err){return res.status(500).json({msg:err.message})}

    }
}


module.exports = usersPost