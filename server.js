require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser =require('body-parser')
const mongoose =require('mongoose')
const socketServer = require('./socketServer')
const app = express()
const cloudinary = require('cloudinary')
const {PeerServer} = require('peer')

const User = require('./models/userModels')

const AuthRoute = require('./routes/authRoute')
const UserRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoute')
const notifyRoute=  require('./routes/notifyRoute')
const CommentRoute = require('./routes/commentRoute')
const messageRoute = require('./routes/messageRoute')
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : false}))
app.use(cors());


const http = require('http').createServer(app)
const io = require('socket.io')(http,{
    cors: {
        origin: "http://localhost:3000"
    }
})


io.on('connection' , socket=>{
   socketServer(socket)
})

PeerServer({port:'5001' , path:'/'})
app.use('/api/test' , async(req,res)=>{
    const ss = await User.findById('63edf1157a0fb4f1d7c71b4f')
    res.json(process.env.MONGO_URL)
})
app.use('/api' , AuthRoute)
app.use('/api' , UserRoute)
app.use('/api' , postRoute)
app.use('/api' , CommentRoute)
app.use('/api' , notifyRoute)
app.use('/api' , messageRoute)
const URI = process.env.MONGO_URL




const port = process.env.PORT || 5000

http.listen(port , ()=>{
    console.log('we are in port 5000')
})

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret:process.env.API_SECRET
})
mongoose.set("strictQuery", false);
mongoose.connect(URI , err=>{
    if(err) throw err
    console.log("connected to mongo")
})