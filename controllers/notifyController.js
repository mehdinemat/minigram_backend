const Notify = require('../models/notifyModel')
const notifyController = {

    createNotify:async(req,res)=>{

        try{
            console.log(req.body)
            const { id, recipients, url, text, content } = req.body


            const notify  =new Notify({
                id, recipients, url, text, content, user: req.user._id
            })
            console.log('savinnnnnnnnnng')
            await notify.save()
            res.status(200).json({notify})

        }catch(err){return res.status(500).json({msg :err.message})}

    },
    deleteNotify: async(req,res)=>{
        try{
            console.log(req.params.id , req.query.url)
            const notify = await Notify.findOneAndDelete({id:req.params.id , url:req.query.url})
            console.log('deletesuccessfuly')
            return res.status(200).json({notify})

        }catch(err){return res.status(500).json({msg:err.message})}
    },
    getNotify:async(req,res)=>{

        try{
            const notif = await Notify.find({recipients:req.user._id , isRead:false}).sort('-createdAt').populate('user' , 'avatar username')
            console.log('salam')
            return res.status(200).json({notif})


        }catch(err){return res.status(500).json({msg:err.message})}

    },
    isReadNotify:async(req,res)=>{
        try{

            const {id} =req.params
            const notify = await Notify.findOneAndUpdate({_id:id} , {isRead:true})

            return res.status(200).json({notify})

        }catch(err){return res.status(500).json({msg:err.message})}
    },
    deleteNotify : async(req,res)=>{

        try{

            const notif = await Notify.deleteMany({recipients:req.user._id})

            return res.status(200).json({notif})

        }catch(err){return res.status(500).json({msg:err.message})}

    }


}

module.exports = notifyController