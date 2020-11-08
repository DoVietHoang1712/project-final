import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "../users.schema";

export class UpdateMyUserDTO extends PartialType(PickType(
    User,
    [
        "soDienThoai",
        "diaChiHienNay",
        "anhDaiDien",
        "ngaySinh",
        "noiSinh",
    ],
)) { }
