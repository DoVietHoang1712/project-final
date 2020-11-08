import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ChangeEmailDTO {
    @ApiProperty({ required: true })
    @IsString()
    readonly password: string;

    @ApiProperty({ required: true })
    @IsEmail()
    readonly email: string;
}
