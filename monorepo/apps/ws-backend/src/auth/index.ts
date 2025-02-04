
import jwt from 'jsonwebtoken'
import {JWT_SECRET} from '@repo/backend-common/config'
import { User } from '../User'
import { userJwtClaims } from '../config'
import WebSocket from 'ws'

export function extractUser(socket:WebSocket,token:string){
    const decoded= jwt.verify(token, JWT_SECRET) as userJwtClaims
    console.log("decoded: ",decoded);
    return new User(socket,decoded)

}