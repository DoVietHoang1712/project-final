import { ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";

export class UploadMultiDTO {
    @ApiProperty()
    @Allow()
    fileFavourite: string[];
}
