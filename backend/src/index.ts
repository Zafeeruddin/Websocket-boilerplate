import express  from "express";
import {WebSocketServer,WebSocket} from "ws"
const app = express()
app.use(express.json()); // Middleware to parse JSON bodies

const clients = new Map<number, WebSocket>()


const server = app.listen(8080);

app.get("/notification",(req,res)=>{
    console.log("ready!")
    const {comment,id,authorId} = req.body
    const ws = clients.get(authorId)
    if(ws){
        ws.send(comment)
        console.log("Comment sent",comment)
        res.status(200).json("Notification sent")
    }else{
        res.status(404).send("Author ain't active")
    }
    
    
})


const wss = new WebSocketServer({
    server:server
})


wss.on("connection",(ws:WebSocket)=>{
    console.log("ws is")
    
    
    ws.on("message",(data:any)=>{
        const dataString = data.toString()
        const id = JSON.parse(dataString)
        clients.set(id,ws)
        console.log("THe list is",clients)
    })
    ws.send("Hey brother watis up")
    ws.on("close",()=>{
        for (let [id,client] of clients){
            if (client===ws){
                clients.delete(id)
                console.log("client disconnected ",client)
                console.log("New list",clients)
                break;
            }
        }
    })
})