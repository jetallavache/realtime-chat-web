import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom.error';

export default function onError(error: Error, req?: Request, res?: Response, next?: NextFunction) {
    console.log(error)
  
    if (res) {
        if (error instanceof CustomError) {
            const status = error.statusCode || 500
            const message = error.message || 'Something went wrong. Try again later'
            
            res.status(status).json({ 
                message: message 
            })
            
            return;
        }
        
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
  }