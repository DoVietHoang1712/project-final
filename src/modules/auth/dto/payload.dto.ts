import { User } from "../../users/users.schema";

export class PayloadDTO {
    readonly sub: string;
    readonly exp: number;
    readonly jti: string;
}
