import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "../users.schema";

export class UpdateUserDTO extends PartialType(PickType(
    User,
    [
        "ten",
        "hoDem",
        "hoTen",
        "ngaySinh",
        "gioiTinh",
        "email",
        "password",
        "soDienThoai",
        "diaChiHienNay",
        "vaiTro",
        "anhDaiDien",
        "inactive",
        "validated",
    ],
)) {

}
