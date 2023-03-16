const User= require('../models/userModels')
const jwt = require('jsonwebtoken')
const auth =async (req,res , next)=>{

    try{
        console.log(req.get('Authorization'))
        const token = req.header('Authorization')
        console.log(req.header , 'this is token authen')
        if(!token){
            return res.status(400).json({error:"Invalid Authentication"})
        }
        console.log(process.env.SECRET_CREATE_CODE)
        const decode = jwt.verify(token , process.env.SECRET_CREATE_CODE)
        if(!decode) {
            return res.status(400).json({error:"Invalid Authentication"})
        }
        const user = await User.findOne({_id:decode.id})
        req.user = user
        next()

    }catch(err){ return res.status(500).json({msg:err.message}) }



}

module.exports = auth