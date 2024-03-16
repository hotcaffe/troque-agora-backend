import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomErrorHandlerService {
    handle(error: Error) {
        console.log('Erro aqui: ', error)
    }
}