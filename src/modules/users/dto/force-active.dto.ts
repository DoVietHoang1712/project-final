import { ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";

export class ForceActiveDTO {
    @ApiProperty()
    @Allow()
    idUser: string;
}
