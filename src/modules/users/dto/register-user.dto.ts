import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "../users.schema";

export class RegisterUserDTO extends PartialType(PickType(
    User,
    [
        "hoDem",
        "ten",
        "hoTen",
        "username",
        "password",
        "email",
        "soDienThoai",
        "diaChiHienNay",
        "anhDaiDien",
    ],
)) { }
