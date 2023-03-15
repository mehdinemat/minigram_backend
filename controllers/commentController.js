const Comment = require('../models/commentModels')
const Post = require('../models/postModels')
const CommentController ={

        createComment :async(req,res)=>{

            try{
                const { content , postId , reply , tag ,postUserId} = req.body 
               

                const post = await Post.findById(postId)
                if(!post){res.status(400).json({msg:"this post not found"})}

                if(reply){
                    const cm = await Comment.findById(reply)
                    if(!cm) {res.status(400).json({msg:"This comment does not exist!"})}
                }
                const newComment = new Comment({
                    content , tag , postId , postUserId ,  reply , user:req.user._id
                })
                await Post.findByIdAndUpdate({_id:postId} , {$push:{comments:newComment._id}} , {new:true})
                
                await newComment.save()
                res.json({newComment})


            }catch(err){ res.status(500).json({msg:err.message}) }

        },
        updateComment:async(req,res)=>{

            try{

                const {commentId , content } = req.body

            const res=  await Comment.findByIdAndUpdate({_id:commentId} , {content:content} , {new:true})

            res.status(200).json({res})


            }catch(err){res.status(500).json({msg:err.message})}


        },
        deleteComment : async ( req ,res )=>{

            try{
                const {id} = req.params

               

                const comment = await Comment.findByIdAndDelete({_id:id})
    
                res.status(200).json({comment})    

            }catch(err){ res.status(500).json({msg:err.message})}

        },
        likeComment : async (req ,res)=>{

            try{

                const {id} = req.params

                const comment = await Comment.findByIdAndUpdate({_id:id} , {$push:{likes:[req.user._id]}})  
                
                res.status(200).json({comment})

            }catch(err){ res.status(500).json({msg:err.message}) }

        },
        unLikeComment : async (req,res)=>{

            try{
                const {id} = req.params
                const comment = await Comment.findByIdAndUpdate({_id:id} , {$pull:{likes:req.user._id}})
            
                res.status(200).json({comment})

                
            }catch(err){}

        }

}

module.exports = CommentController