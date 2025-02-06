import { WebSocketServer } from "ws";
import { extractUser } from "./auth";
import { AppManager } from "./AppManager";

const wss = new WebSocketServer({ port: 8080 });

const App = new AppManager();

wss.on("connection", (socket, request) => {
  const url = request.url;
  if (!url) {
    console.log("no url");
    return;
  }
  console.log("url: ",url)
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  if(!token){
    console.log("no token provided")
    return;
  }
  const user = extractUser(socket, token);
  if(!user){
    console.log("no user found")
    socket.close();
    return;
  }
  App.addUser(user);

  socket.on("message", (data:any) => {
    console.log("message: ",data.toString());
  });
  socket.on("close",()=>{
    socket.close();
  })
});
