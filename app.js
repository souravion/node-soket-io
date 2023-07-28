
const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')


const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use(express.json());
app.use(cors());
const PORT = 3000;
const connectDB = async () => {
    try {
      await mongoose.connect(`mongodb+srv://scripters:RCqO2P7t0FH8bcvU@chatcluster.lmdxksy.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: {conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }


connectDB()

const Schema = mongoose.Schema;

const chat = new Schema({
    msg:{
        type:String,
        required:true,
        trim:true,
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const Chats = mongoose.model("chat", chat);





app.post('/api/add', async function(req, res){
    console.table(req.body)
    const chasAdd = new Chats(req.body)
    const chasAddCreated = await chasAdd.save()
    if(chasAddCreated){
        io.emit('ADDED_DATA', req.body);
        return res.send('Successfully Saved!!');
    }else{
          return false
    }
});


app.get('/api/getchat', async function(req, res){

    try{
        const chat = await Chats.find({})
        return res.send(chat);
    }catch(e) {
        throw new  e;

    }
});





http.listen(PORT, (error) =>{
    if(!error){
        console.log("Server is Successfully Running,and App is listening on port "+ PORT)
    }

    else 
        console.log("Error occurred, server can't start", error);
    }
);