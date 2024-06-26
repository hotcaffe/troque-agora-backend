import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { AxiosError } from "axios";
import { Request, Response } from "express";
import { FirebaseError } from "firebase/app";
import { JsonWebTokenError } from "jsonwebtoken";
import { timestamp } from "rxjs";
import { QueryFailedError } from "typeorm";

interface CustomResponse extends Response {
    action: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<CustomResponse>();
        const request = ctx.getRequest<Request>();
        const status = exception?.getStatus && exception?.getStatus() || 500;

        if (exception instanceof HttpException) {
            console.log('erro', exception.getResponse(), response.action)
            response.status(status).json({
                timestamp: new Date().toISOString(),
                // path: request.url,
                action: response.action,
                message: exception.getResponse()['message']
                    ||  exception.message
                    || 'Internal Server Error'
            })
        } else if (exception instanceof AxiosError) {
            response.status(exception.response.status).json(exception.response.data)
        } else if (exception instanceof QueryFailedError) {
            response.status(500).json({
                timestamp: new Date().toISOString(),
                message: "Erro ao realizar operação de dados."
            })
        } else if (exception instanceof FirebaseError) {
            console.log(exception)
            response.status(500).json({
                timestamp: new Date().toISOString(),
                message: "Erro ao realizar operações de storage."
            })
        } else if (exception instanceof JsonWebTokenError) {
            response.status(403).json({
                timestamp: new Date().toISOString(),
                message: "Sessão inválida ou acesso indevido!"
            })
        } 
        else {
            response.status(status).json({
                timestamp: new Date().toISOString(),
                // path: request.url,
                message: exception.message 
                    || exception.getResponse()['message']
                    || 'Internal Server Error' 
            })
        }



    }
}