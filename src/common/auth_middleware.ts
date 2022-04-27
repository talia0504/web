import {NextFunction,Request,Response} from 'express'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

const authMiddleware = async (req:Request,response:Response,next:NextFunction)=>{
    let token = req.headers['authorization']
    if (token == undefined || token == null){
        return response.sendStatus(StatusCodes.FORBIDDEN)
    }
    token = token.split(' ')[1]
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,userId)=>{
        if (err != null){
            return response.sendStatus(StatusCodes.FORBIDDEN)
        }
        req.body._id = userId
        next()
    })
}

export = authMiddleware