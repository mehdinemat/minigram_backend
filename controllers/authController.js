
const User = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userAuth = {

    register:async(req,res)=>{
        try{
            const {fullname , username , email , password , gender}= req.body
            const newUserName = username.toLowerCase().replace(/ /g , '')

            const userName = await User.findOne({username:newUserName})
            
            if(userName){
                return res.status(400).json({msg:"this user name already exists"})
            }
            
            if(password.length < 6){
                return res.status(400).json({msg:"Password must be at least 6 characters"})
            }
            const passwordHash = await bcrypt.hash(password , 12)
            
            const newUser = new User({
                fullname , username:newUserName , email , password:passwordHash , gender
            })
   

            const accessToken = createAccessToken({id:newUser._id})
            const refreshToken = createRefreshToken({id:newUser._id})

            res.cookie('refreshToken' , refreshToken , {
                httpOnly:true
            })
            await newUser.save()
            res.json({
                msg: 'Register Success!',
                accessToken,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })


        }catch(err) {res.status(500).json({msg:err.message})}



    },login:async(req,res)=>{

        try{

           
            const {email , password} = req.body
           
        const user = await User.findOne({email}).populate("followers following saved" , "-password")
    
        if(!user){
            res.status(400).json({msg:"user not Found!"})
        }
        
        const comparePassword = await bcrypt.compare(password , user.password)
       
        if(!comparePassword){
            res.json({msg:"password not match"})
        }
        
        const accessToken = createAccessToken({id:user._id})
        const refreshToken = createRefreshToken({id:user._id})
        console.log(refreshToken , 'this refresh token')
        res.cookie('refreshToken' , refreshToken , {
            httpOnly:true,
            path: '/api/refresh_token',
            maxAge: 30*24*60*60*1000
        })
        res.setHeader('refreshToken', refreshToken);
        console.log(req.cookies)
      
       return res.json({msg:'login success' , accessToken , user:{
            ...user._doc,password:''
        }})
        }catch(err){res.status(500).json({msg:err.message})}


    },logout:(req,res)=>{

        try{
            res.clearCookie('refreshToken' )
            return res.json({msg:"Log out!"})


        }catch(err){res.status(500).json({msg:err.message})}


    },generateAccessToken:async(req,res)=>{
        
        try{
            
            const token = req.cookies.refreshToken
            console.log(token , 'step one')
         if(!token){return res.status(400).json({msg:"Please login now."})}

        jwt.verify(token , process.env.SECRET_REFRESH_CODE , async(err,result)=>{

            if(err){ return res.status(400).json({msg: "Please login now."})}
            console.log(result.id)
            const user = await User.findOne({_id:result.id}).populate("following followers saved" , "-password")
            console.log(user)
            if(!user){
                res.status(400).json({msg:"user not found"})
            }
            const accessToken = createAccessToken({id:user._id})

            res.status(200).json({
                accessToken , user
            })


        })
        }catch(err) {res.status(500).json({msg:err.message})}

    },
    savedPost:async(req,res)=>{

        try{

            const user = await User.find({_id:req.user._id , saved:req.params.id})
            if(user.length > 0){
                return res.status(400).json({msg:"You saved this post."})
            }
            const save = await User.findByIdAndUpdate({_id:req.user._id}, {$push:{saved:req.params.id}} , {new:true}).populate('saved')
       
            return res.status(200).json({save})

        }catch(err){ return res.status(500).json({msg:err.message}) }

    } ,
    unSavedPost:async(req,res)=>{

        try{

            const save = await User.findByIdAndUpdate({_id:req.user._id} , {$pull:{saved:req.params.id}}, {new:true}).populate('saved')

            return res.status(200).json({save})

        }catch(err){
                return res.status(500).json({msg:err.message})
        }


    }

}
    const createAccessToken =(id)=>{
        return jwt.sign(id ,process.env.SECRET_CREATE_CODE , {expiresIn:'1d'} )
    }
    const createRefreshToken = (id)=>{
        return jwt.sign(id , process.env.SECRET_REFRESH_CODE , {expiresIn:'30d'})
    }



module.exports = userAuth