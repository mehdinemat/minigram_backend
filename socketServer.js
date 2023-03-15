
let users = []

const EditData = ( data , id , call )=>{
  const newData = data.map((item)=>
    item.id === id ? {...item , call} : item
  )
  return newData

}

const socketServer=(socket)=>{
    socket.on('joinUser', user => {
  

        users.push({id:user._id , socketId:socket.id , followers:user.followers})
      
    })
    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
       users =  users.filter(item=> item.socketId !== socket.id)
      });
      socket.on('likePost' , newPost=>{
        const ids = [...newPost.user.followers , newPost.user._id]
        const client = users.filter((user)=>ids.includes(user.id))
        if(client.length > 0){
            client.forEach((item)=>(
                socket.to(`${item.socketId}`).emit('likeToClient' , newPost)
            ))
        }
      })
      
      socket.on('unlikePost' , newPost=>{
        const ids = [...newPost.user.followers , newPost.user._id]
        const client = users.filter((user)=>(
          ids.includes(user.id)
        ))
        if(client.length > 0){
        client.forEach((item)=>(
          socket.to(`${item.socketId}`).emit('unlikeToClient' , newPost )
        ))
      }
      })

      socket.on('createComment' , newPost=>{

        const ids = [...newPost.user.followers , newPost.user._id]
        const client = users.filter((user)=>(
          ids.includes(user.id)
        ))
        if(client.length >0){
          client.forEach((item)=>{
            socket.to(`${item.socketId}`).emit('createCommentToClient' , newPost)
          })
        }


      })

      socket.on('deleteComment' , newPost=>{
        const ids= [...newPost.user.followers , newPost.user._id]
        const client = users.filter((user)=>(
          ids.includes(user.id)
        ))
        if(client.length > 0){
          client.forEach((item)=>(
            socket.to(`${item.socketId}`).emit('deleteCommentToClient' , newPost)
          ))
        }
      })

      socket.on('deletePost' , Post=>{
        const ids = [...Post.user.followers , Post.user._id]
        const client = users.filter((user)=>(
          ids.includes(user.id)
        ))
        if(client.length > 0){
          client.forEach((item)=>{
            socket.to(`${item.socketId}`).emit('deletePostToClient' , Post)
          })
        }
      })
      socket.on('createNotify' , notify=>{

        const client = users.filter((item)=>(
          notify.recipients.includes(item.id)
        ))
        if(client.length > 0){
          client.forEach((item)=>{
            socket.to(`${item.socketId}`).emit('createNotifyToClient' , notify)
          })
        }


      })
      socket.on('sendMessage' , msg=>{
        console.log(msg , 'this is aim')
        const client = users.filter((item)=>(
            item.id === msg.recipient 
        ))
        if(client.length > 0){
          client.forEach((item)=>{
            socket.to(`${item.socketId}`).emit('sendMessageToClient' , msg)
          })
        }
      })

      socket.on('deleteMessage' , (msg)=>{

        const client = users.filter((item)=>(
          item.id === msg.id
        ))
        if(client.length > 0){
          client.forEach((item)=>{
          socket.to(`${item.socketId}`).emit('deleteMessageToClient' , msg)
          })
        }

      })

      socket.on('callUser' , msg=>{

     
        users = EditData(users , msg.sender , msg.recipient)
        const client = users.find((item)=> item.id === msg.recipient)
        if(client){
          users = EditData(users , msg.recipient , msg.sender)
          socket.to(`${client.socketId}`).emit('callUserToClient' , msg)

        }

      })

      socket.on('endCall' , data =>{
        const client = users.find(user=>user.id === data.sender)
        if(client){
          socket.to(`${client.socketId}`).emit('endCallToClient', data)
            users = EditData(users, client.id, null)
            if(client.call){
              const clientCall = users.find(user=>user.id === client.call)
              clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient' , data)
              users = EditData(users , client.call , null)          
            }
        }
      })
      socket.on('readData' , data =>{

        console.log(users , data.sender)
        const client = users.find(item=>
          item.id === data.sender
        )

        console.log(client , 'biababaaaaa')
        if(client){
          socket.to(`${client.socketId}`).emit('readDataToClient' , {...data , read:true})
        }

      })

      

}

module.exports = socketServer