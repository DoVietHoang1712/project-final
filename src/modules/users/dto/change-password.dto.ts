import { ApiProperty } from "@nestjs/swagger";
import { IsPassword } from "../../../common/decorators/constants.decorator";

export class ChangePasswordDTO {
    @ApiProperty()
    @IsPassword()
    readonly oldPassword: string;

    @ApiProperty()
    @IsPassword()
    readonly newPassword: string;
}
