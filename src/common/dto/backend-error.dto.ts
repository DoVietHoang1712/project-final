import { ApiProperty } from "@nestjs/swagger";

export class BackendErrorDTO extends Error {
    @ApiProperty()
    errorCode?: number;
    @ApiProperty()
    statusCode: number;
    @ApiProperty()
    message: any;
    @ApiProperty()
    detail?: any;
    constructor(statusCode: number, message: any, detail?: any, errorCode?: number) {
        super();
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.message = message;
        this.detail = detail;
    }
}
