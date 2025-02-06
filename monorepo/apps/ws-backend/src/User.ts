import WebSocket from "ws";
import { userJwtClaims } from "./config";


 export class User {
  public id:string;
  public userId:string;
  public socket: WebSocket;
  public name: string;
  public email: string;
  public username: string;

  constructor(
    socket: WebSocket,
    userJwtClaims:userJwtClaims
  ) {
    this.socket = socket;
    this.name = userJwtClaims.name;
    this.id = userJwtClaims.id;
    this.userId = userJwtClaims.userId
    this.username = userJwtClaims.username;
    this.email = userJwtClaims.email;
  }


}

