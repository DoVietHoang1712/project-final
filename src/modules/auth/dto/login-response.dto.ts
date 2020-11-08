import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/users.schema";

export class LoginResponseDTO {
    @ApiProperty()
    readonly user: User;
    @ApiProperty()
    readonly accessToken: string;
}
