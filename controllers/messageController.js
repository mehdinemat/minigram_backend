
const Message = require('../models/messageModels')
const Conversation = require('../models/conversationModels')
const messageController = {

    createMessage:async(req,res)=>{

        try{

            const { sender , recipient , text , media , call } = req.body.msg
            console.log('step one')

            const newConversation = await Conversation.findOneAndUpdate({
                $or:[
                    {recipients: [sender, recipient]},
                    {recipients: [recipient, sender]}
                ]
            } , {
                recipients: [sender, recipient],
                text
            } , {new:true , upsert:true})


            const newMessage = new Message({
                conversation:newConversation._id , sender:sender , recipient:recipient , text:text , media , call
            })
            await newMessage.save()

            res.json({newMessage})


        }catch(err){ return res.status(500).json({msg:err.message}) }


    },
    getMessage:async(req,res)=>{

        try{
            const messages = await Message.find({
                $or:[
                    { sender:req.user._id , recipient:req.params.id },
                    { sender:req.params.id , recipient:req.user._id }
                ]
            }).sort('-createdAt')
           return res.status(200).json({
                messages , result:messages.length
            })




        }catch(err){return res.status(500).json({msg:err.message})}


    },
    getConversation:async(req,res)=>{
        try{
            
        const conversation = await Conversation.find({recipients:req.user._id}).populate('recipients').select('-password')

        console.log(conversation)
        return res.status(200).json({conversation})


       }catch(err){return res.status(500).json({msg:err.message})}
        


    },
    getConverText : async(req,res)=>{

        
            try{

                const conversation=  await Conversation.findOne({
                    $or:[
                        {recipients:[req.user._id , req.params.id]},
                        {recipients:[req.params.id , req.user._id]}
                    ]
                })


                if(!conversation){return res.status(200).json({text:''})}



                return res.status(200).json({text:conversation.text})

            }catch(err){res.status(500).json({msg:err.message})}
           
        
    },
    deleteConversation:async(req,res)=>{

        try{
            const conversation = await Conversation.findOneAndRemove({
                $or:[
                    {recipients:[req.params.id , req.user._id]},
                    {recipients:[req.user._id , req.params.id]}
                ]
            })
            console.log(req.user._id , req.params.id)
            const messages = await Message.deleteMany({conversation:conversation._id})
            return res.status(200).json({msg:"SuccessFull to Delete"})

        }catch(err){return res.status(500).json({msg:err.message})}

    },
    deleteMessage:async(req,res)=>{

        try{
        const message = await Message.findByIdAndDelete({_id:req.params.id})
        return res.status(200).json({msg:"Message Deleted!"})

        }catch(err){return res.status(500).json({msg:err.message})}



    },
    readMessage:async(req,res)=>{

        const {item} =req.body
        const message = await Message.updateOne({_id:item._id} , {read:true})
    }

}

module.exports = messageController