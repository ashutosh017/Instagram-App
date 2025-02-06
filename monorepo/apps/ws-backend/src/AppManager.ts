import { User } from "./User";
import WebSocket from "ws";

export class AppManager {
  public users: User[];
 
  constructor() {
    this.users = [];
  }
  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user);
  }
  sendMessage(user: User, message: string) {
    user.socket.send(message);
  }
  getUser(userId: string) {
    const user = this.users.find((u) => u.userId === userId);
    if (!user) return null;
    return user;
  }
  addHandler(user: User) {
    user.socket.on("message", (data) => {
      const parsedData = JSON.parse(data.toString());
      const toUser = this.getUser(parsedData.recipientId);
      if (!toUser) {
        console.error("There is no recipient exist with recipientId");
        return;
      }
      switch (parsedData.type) {
        case "NEW_MESSAGE":
          this.sendMessage(
            toUser,
            JSON.stringify({
              type: "NEW_MESSAGE",
              fromUserId: user.id,
              message: parsedData.message,
            })
          );
          break;
        case "STATUS":
          this.sendMessage(
            toUser,
            JSON.stringify({
              type: "STATUS",
              fromUserId: user.id,
              status: parsedData.status,
            })
          );
          break;
        case "FOLLOW":
          this.sendMessage(
            toUser,
            JSON.stringify({
              type: "FOLLOW",
              fromUserId: user.id,
            })
          );
          break;
        case "UNFOLLOW":
          this.sendMessage(
            toUser,
            JSON.stringify({
              type: "UNFOLLOW",
              fromUserId: user.id,
            })
          );
          break;
        case "LIKE":
          this.sendMessage(
            toUser,
            JSON.stringify({
              type: "LIKE",
              fromUserId: user.id,
            })
          );
          break;
        case "DISLIKE":
          this.sendMessage(
            toUser,
            JSON.stringify({
              type: "DISLIKE",
              fromUserId: user.id,
            })
          );
          break;
        case "COMMENT":
          this.sendMessage(
            toUser,
            JSON.stringify({
              type: "COMMENT",
              comment: parsedData.comment,
              fromUserId: user.id,
            })
          );
          break;
      }
    });
  }
}
