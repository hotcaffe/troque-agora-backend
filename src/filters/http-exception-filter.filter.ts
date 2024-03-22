import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { AxiosError } from "axios";
import { Request, Response } from "express";

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
        } else {
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