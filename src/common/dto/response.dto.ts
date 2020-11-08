import { BackendErrorDTO } from "./backend-error.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseDTO {
    @ApiProperty()
    readonly data?: any;
    @ApiProperty()
    readonly total?: number;
    @ApiProperty()
    readonly error?: BackendErrorDTO;
    @ApiProperty()
    readonly message?: string;
    @ApiProperty()
    readonly statusCode?: number;
}
