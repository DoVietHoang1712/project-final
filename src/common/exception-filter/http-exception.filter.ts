import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request } from "express";
import { User } from "../../modules/users/users.schema";
import { BackendErrorDTO } from "../dto/backend-error.dto";
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse();
        let statusCode: number;
        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
        } else if (exception instanceof BackendErrorDTO) {
            statusCode = exception.statusCode;
        } else {
            statusCode = 500;
        }
        const message = (statusCode !== 500 && exception.message) || "Internal Server Error";
        const user = request.user as User;
        const time = new Date().toLocaleString();
        const path = `${request.method} ${request.originalUrl}`;
        const errorObject = {
            error: {
                time,
                message,
                // username: user.username || null,
                path,
            },
            statusCode,
        };
        console.error(exception);
        response.status(statusCode).json(errorObject);
    }
}
