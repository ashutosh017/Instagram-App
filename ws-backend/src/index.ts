import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from 'uuid';
import WebSocket from "ws";

const wss = new WebSocketServer({port:8080})


wss.on("connection",(socket)=>{
    socket.on('message',(data)=>{
        console.log(data);
        const parsedData = JSON.parse(JSON.stringify(data))
        let user:User;
        if(parsedData.type==='NEW_JOINING'){
            const id = uuidv4();
            const name = parsedData.name
            const username = parsedData.usename;
            const email = parsedData.email
            user = {
                socket,id,name,username,email
            }
            const ig = new Instagram();
            ig.initHandler(user)
        }

    })

})

interface User{
    socket:WebSocket,
    id:string,
    name:string,
    username:string,
    email:string,
}

class Instagram{
    public users:User[];
    addUser(user){
        this.users.push(user);

    }
    initHandler(user:User){
        this.addUser(user)
    }
    constructor(){
        this.users = [];
    }

}

