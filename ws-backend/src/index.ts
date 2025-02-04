import { WebSocketServer } from "ws";
import { extractUser } from "./auth";
import { AppManager } from "./AppManager";

const wss = new WebSocketServer({ port: 8080 });

const App = new AppManager();

wss.on("connection", (socket, request) => {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const user = extractUser(socket, token);
  App.addUser(user);

  socket.on("message", (data:any) => {
    console.log(data.toString());
  });
  socket.on("close",()=>{
    socket.close();
  })
});
