const User = require('../models/userModels')
const cloudinary  = require('cloudinary')
const Post = require('../models/postModels')
const userController = {

    searchUser :async(req,res)=>{

        try{
            const user = await User.find({username:{$regex:req.query.username}}).limit(10).select("fullname username avatar")
            res.status(200).json({user})
        }catch(err){
            return res.status(500).json({msg:err.message})
        }

    },
    getUser : async(req,res)=>{
        try{
            const user = await User.findById(req.params.id).select("-password").populate("followers following" , "-password")
            if(!user) return res.status(400).json({msg:"user does not exist"})
            res.json({user})
        }catch(err){
            return res.status(500).json({msg:err.message})

        }


    },
    updateUser:async(req,res)=>{

       try{ 
        let user =[]
           const {fullname , story , gender ,mobile , address , website } = req.body.userData
            const {avatar} =req.body
            if(req.body.avatar.length > 1){
                const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar , {
                    folder:"avatars",
                    width:150,
                    crop:"scale"
                } , (error , result)=>{
                    
                })
                console.log(req.body.avatar , 'this is true')
                 user = await User.findByIdAndUpdate(req.user._id , {website , story , fullname , gender , mobile , address , avatar:myCloud.secure_url})
            }else {
                
                 user = await User.findByIdAndUpdate(req.user._id , {website , story , fullname , gender , mobile , address })
                console.log(req.body.avatar , 'this is false')
            }
            console.log(user)

    res.json({msg:"Update success!" , avatar:req.body.avatar})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

    },
    follow :async(req,res)=>{
            try{
                
                const user = await User.find({_id:req.params.id ,followers:req.user._id })
            if(user.length > 0) return res.status(500).json({msg:"You followed this user."})

            await User.findByIdAndUpdate({_id:req.params.id } ,{$push:{followers:req.user._id}},{new:true} )
            await User.findByIdAndUpdate({_id:req.user._id} , {$push:{following:req.params.id}} , {new:true})

            res.status(200).json({msg:"this was true"})
            }catch(err){ return res.status(500).json({msg:err.message}) }
    },
    unfollow:async(req,res)=>{

        try{

             await User.findByIdAndUpdate({_id:req.params.id } , {$pull:{followers:req.user._id}},{new:true})
            await User.findByIdAndUpdate({_id:req.user._id} , {$pull:{following:req.params.id}} ,{new:true})

            re.status(200).json({msg:"this was true"})


        }catch(err){ res.status(500).json({msg:err.message})}


    },
    getProfilePost : async(req , res)=>{

        try{
            const {id} = req.params
            const post = await Post.find({user:id})
            
         

            res.status(200).json({post})

        }catch(err){
            res.status(500).json({msg:err.message})
        }

    }




}

module.exports = userController