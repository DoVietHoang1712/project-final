import { ResponseDTO } from "../common/dto/response.dto";
import { BackendErrorDTO } from "../common/dto/backend-error.dto";

export class ResponseTool {
    static RESPONSE(data: any, total?: number): ResponseDTO {
        return {
            data,
            total,
        };
    }

    static GET_OK(data: any, total?: number, message: string = "GET_REQUEST_OK"): ResponseDTO {
        return {
            data,
            total,
            message,
            statusCode: 200,
        };
    }

    static POST_OK(data: any, total?: number, message: string = "POST_REQUEST_OK"): ResponseDTO {
        return {
            data,
            total,
            message,
            statusCode: 200,
        };
    }

    static CREATED(data: any, message: string = "CREATED"): ResponseDTO {
        return {
            data,
            message,
            statusCode: 201,
        };
    }

    static PUT_OK(data: any, message: string = "PUT_REQUEST_OK"): ResponseDTO {
        return {
            data,
            message,
            statusCode: 200,
        };
    }

    static DELETE_OK(data: any, message: string = "DELETE_REQUEST_OK"): ResponseDTO {
        return {
            data,
            message,
            statusCode: 200,
        };
    }

    static ERROR(error: BackendErrorDTO, statusCode: number, message?: string): ResponseDTO {
        return {
            error,
            message,
            statusCode,
        };
    }

    static BAD_REQUEST(message: string, error: BackendErrorDTO): ResponseDTO {
        return {
            error,
            message,
            statusCode: 400,
        };
    }

    static UNAUTHORIZED(message: string, error: BackendErrorDTO): ResponseDTO {
        return {
            error,
            message,
            statusCode: 401,
        };
    }

    static NOT_FOUND(message: string, error: BackendErrorDTO): ResponseDTO {
        return {
            error,
            message,
            statusCode: 404,
        };
    }

    static CONFLICT(message: string, error: BackendErrorDTO): ResponseDTO {
        return {
            error,
            message,
            statusCode: 409,
        };
    }
}
