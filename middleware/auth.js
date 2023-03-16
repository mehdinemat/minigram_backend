const User= require('../models/userModels')
const jwt = require('jsonwebtoken')
const auth =async (req,res , next)=>{

    try{
        const token = req.header('Authorization')
        console.log(token , 'token')
        if(!token){
            return res.status(400).json({error:"Invalid Authentication"})
        }
        const decode = jwt.verify(token , process.env.SECRET_CREATE_CODE)
        console.log(decode.id , process.env.SECRET_CREATE_CODE , 'this is secret code')
        if(!decode) {
            return res.status(400).json({error:"Invalid Authentication"})
        }
        const user = await User.findOne({_id:decode.id})
        console.log(user , 'user auth')
        req.user = user
        next()

    }catch(err){ return res.status(500).json({msg:err.message}) }



}

module.exports = auth