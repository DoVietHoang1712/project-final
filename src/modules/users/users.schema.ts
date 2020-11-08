import { ApiProperty } from "@nestjs/swagger";
import * as bcrypt from "bcryptjs";
import { Allow, IsEmail, IsString, Length } from "class-validator";
import { ObjectId } from "mongodb";
import * as mongoose from "mongoose";
import { IsAddress, IsFullName, IsPassword, IsPhoneNumber, IsUsername } from "../../common/decorators/constants.decorator";
import { EGioiTinh, EPhongBan, ERole } from "../../config/constants";
import { StringTool } from "../../tools/string.tool";
import { USER_CONST } from "./constants/users.constant";

export const USER_DB = "Users";

export const UserSchema = new mongoose.Schema({
    systemInfo: {
        indentityValidate: {
            type: Boolean,
            default: true,
        },
        emailValidate: {
            type: Boolean,
            default: false,
        },
        thirdPartyAuth: {
            type: Boolean,
            default: false,
        },
    },
    ten: {
        type: String,
        index: true,
        trim: true,
        maxlength: USER_CONST.NAME_MAX_LENGTH,
    },
    hoDem: {
        type: String,
        trim: true,
        maxlength: USER_CONST.NAME_MAX_LENGTH,
    },
    hoTen: {
        type: String,
        index: true,
        required: true,
        trim: true,
        maxlength: USER_CONST.NAME_MAX_LENGTH,
    },
    ngaySinh: {
        type: Date,
    },
    gioiTinh: {
        type: Number,
        enum: [EGioiTinh.NAM, EGioiTinh.NU, EGioiTinh.KHAC],
    },
    cmtCccd: {
        type: String,
        maxlength: USER_CONST.PERSONAL_ID_MAX_LENGTH,
    },
    soDienThoaiThayThe: {
        type: String,
        maxlength: USER_CONST.PHONE_NUMBER_MAX_LENGTH,
    },
    username: {
        type: String,
        required: true,
        minlength: USER_CONST.USERNAME_MIN_LENGTH,
        maxlength: USER_CONST.USERNAME_MAX_LENGTH,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: USER_CONST.PASSWORD_MIN_LENGTH,
        maxLength: USER_CONST.PASSWORD_MAX_LENGTH,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true,
        maxlength: USER_CONST.EMAIL_MAX_LENGTH,
    },
    soDienThoai: {
        type: String,
        maxlength: USER_CONST.PHONE_NUMBER_MAX_LENGTH,
    },
    queQuan: {
        type: String,
        maxlength: USER_CONST.ADDRESS_MAX_LENGTH,
    },
    noiSinh: {
        type: String,
        maxlength: USER_CONST.ADDRESS_MAX_LENGTH,
    },
    danToc: {
        type: String,
    },
    diaChiHienNay: {
        type: String,
        maxlength: USER_CONST.ADDRESS_MAX_LENGTH,
    },
    vaiTro: {
        type: Number,
        enum: [ERole.ADMIN_PHONG_BAN, ERole.ADMIN, ERole.PHU_HUYNH, ERole.GIANG_VIEN, ERole.SINH_VIEN, ERole.GUEST, ERole.CAN_BO_DAO_TAO],
        required: true,
    },
    anhDaiDien: {
        type: String,
    },
    inactive: {
        type: Boolean,
        default: false,
    },
    validated: {
        type: Boolean,
    },
    facebook: {
        id: String,
    },
    google: {
        id: String,
    },
    userChatId: String,
    userChatKey: String,
    lastTimeLogin: { type: Date },
    resetToken: {
        password: {
            type: String,
            maxlength: USER_CONST.TOKEN_MAX_LENGTH,
        },
    },
    contactEmail: [{
        type: String,
        maxlength: USER_CONST.EMAIL_MAX_LENGTH,
    }],
    lastRequest: {
        resetPassword: Date,
        validateEmail: Date,
    },
    expiredAt: Date,
    chucDanh: {
        type: String,
    },
    hocVi: {
        type: String,
    },
    cq: {
        type: String,
    },
    chucVuQuanLy: {
        type: String,
    },
    chucVuDang: {
        type: String,
    },
    chucVuDoanThe: {
        type: String,
    },
    chucVuBan: {
        type: String,
    },
    donVi: String,
}, {
    timestamps: true,
    collection: USER_DB,
    toJSON: { virtuals: true },
    collation: { locale: "vi" },
});

UserSchema.virtual("khoa", {
    ref: "Khoa",
    localField: "maKhoa",
    foreignField: "maKhoa",
    justOne: true,
});

UserSchema.virtual("nganh", {
    ref: "Nganh",
    localField: "maNganh",
    foreignField: "maNganh",
    justOne: true,
});

UserSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

UserSchema.pre("save", async function save() {
    const nameComponent = StringTool.getNameComponent(this.get("hoTen"));
    this.set("hoTen", nameComponent.fullname);
    this.set("hoDem", nameComponent.lastname);
    this.set("ten", nameComponent.firstname);
    if (this.isModified("password")) {
        const password = this.get("password");
        this.set("password", password ? await bcrypt.hash(password, 10) : undefined);
    }
    if (this.isModified("resetToken.password")) {
        const token = this.get("resetToken.password");
        this.set("resetToken.password", token ? await bcrypt.hash(token, 10) : token);
    }
});

UserSchema.methods.comparePassword = async function comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.compareResetPasswordToken = async function compareResetPasswordToken(token: string): Promise<boolean> {
    return this.resetToken && this.resetToken.password
        ? bcrypt.compare(token, this.resetToken.password)
        : false;
};

export class SystemInfo {
    indentityValidate: boolean;
    emailValidate: boolean;
    thirdPartyAuth: boolean;
}

export class User {
    @ApiProperty()
    @IsString()
    maSv: string;

    @ApiProperty()
    @IsString()
    ten: string;

    @ApiProperty()
    @IsString()
    hoDem: string;

    @ApiProperty()
    @IsFullName()
    hoTen: string;

    @ApiProperty()
    ngaySinh: Date;

    @ApiProperty()
    gioiTinh: EGioiTinh;

    @ApiProperty()
    @IsString()
    cmtCccd: string;

    @Length(4, 64)
    @ApiProperty()
    @IsUsername()
    username: string;

    @ApiProperty()
    @IsPassword()
    password: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: false })
    @IsPhoneNumber()
    soDienThoai: string;

    @ApiProperty({ required: false })
    @IsAddress()
    diaChiHienNay: string;

    danToc: string;
    queQuan: string;
    noiSinh: string;

    @ApiProperty()
    vaiTro: ERole;

    @ApiProperty()
    contactEmail: string[];

    @ApiProperty({ type: "string", format: "binary", required: false })
    anhDaiDien: string;
    jti: string;
    inactive: boolean;
    validated: boolean;
    updatedAt: Date;
    userChatId: string;
    userChatKey: string;
    @ApiProperty()
    @Allow()
    phongBan: EPhongBan;
    systemInfo: SystemInfo;
    facebook: {
        id: string;
    };
    google: {
        id: string;
    };
    lastTimeLogin: Date;
    lastRequest: {
        resetPassword: Date,
        validateEmail: Date,
    };
    resetToken: {
        password: string,
    };
    expiredAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
    compareResetPasswordToken: (password: string) => Promise<boolean>;
}

export interface UserDocument extends User, mongoose.Document { }
