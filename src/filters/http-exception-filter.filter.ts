import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception?.getStatus && exception?.getStatus() || 500;

        // console.log(exception)

        if (exception instanceof HttpException) {
            console.log(exception.getResponse())
            response.status(status).json({
                timestamp: new Date().toISOString(),
                path: request.url,
                message: exception.getResponse()['message']
                    ||  exception.message
                    || 'Internal Server Error' 
            })
        } else {
            response.status(status).json({
                timestamp: new Date().toISOString(),
                path: request.url,
                message: exception.message 
                    || exception.getResponse()['message']
                    || 'Internal Server Error' 
            })
        }

    }
}