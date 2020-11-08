import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length, MaxLength } from "class-validator";

export class ChangePasswordFirstDTO {
    @ApiProperty()
    @Length(4, 64)
    readonly newPassword: string;

    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @MaxLength(20)
    @ApiProperty()
    readonly soDienThoai: string;
}
