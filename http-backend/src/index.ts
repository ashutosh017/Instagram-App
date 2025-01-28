import express from 'express'
import { usersRouter } from './routes/users';
import { authMiddleware } from './middlewares/authmiddleware';
import { postsRouter } from './routes/posts';
import { commentsRouter } from './routes/comments';
import { authRouter } from './routes/auth';
import { chatsRouter } from './routes/chats';
const PORT = 3000;


const app = express();
app.use(express.json()) 
app.use("/api/v1",authRouter);
app.use("/api/v1/users", authMiddleware, usersRouter)
app.use("/api/v1/posts",authMiddleware, postsRouter)
app.use("/api/v1/comments", authMiddleware,commentsRouter)
app.use("/api/v1/chats",authMiddleware,chatsRouter)



app.listen(PORT,()=>{
    console.log("app is listening on port: ",PORT);
})