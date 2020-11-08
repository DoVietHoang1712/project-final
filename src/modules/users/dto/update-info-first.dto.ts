import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "../users.schema";

export class UpdateGuestInfoFirstDTO extends PartialType(PickType(
    User,
    [
        "username",
        "password",
        "hoTen",
        "email",
        "soDienThoai",
    ],
)) { }
