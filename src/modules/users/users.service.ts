import { StringTool } from "./../../tools/string.tool";
import { forwardRef, HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Promise } from "bluebird";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import { MongoError } from "mongodb";
import { Model } from "mongoose";
import { isNullOrUndefined } from "util";
import { BackendErrorDTO } from "../../common/dto/backend-error.dto";
import { CommonResponseDTO } from "../../common/dto/common-response.dto";
import { DeleteResultDTO } from "../../common/dto/delete-result.dto";
import { DEFAULT_CONCURRENCY_LOW, ERole } from "../../config/constants";
import { SMTPMailer } from "../../config/mailer";
import { AV_BACKGROUND_1, AV_BACKGROUND_2, AV_TEXT_1, AV_TEXT_2, DEFAULT_USER_PASSWORD, JWT_SECRET, PROJECT_NAME } from "../../config/secrets";
import { EmailTool } from "../../tools/email.tools";
import { QueryOption, QueryPostOption } from "../../tools/request.tool";
import { EUploadFolder, UploadTool } from "../../tools/upload.tool";
import { AuthService } from "../auth/auth.service";
import { AuthToolService } from "../tool/auth-tool/auth-tool.service";
import { ChangeEmailDTO } from "./dto/change-email.dto";
import { ChangePasswordFirstDTO } from "./dto/change-password-first.dto";
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { UserQueueService } from "./users-queue.service";
import { SystemInfo, User, UserDocument, USER_DB } from "./users.schema";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(USER_DB)
        private readonly userModel: Model<UserDocument>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        private readonly userQueueService: UserQueueService,
        private readonly authTool: AuthToolService,
    ) { }

    async count(filter?: object): Promise<number> {
        return filter
            ? await this.userModel.countDocuments(filter).exec()
            : await this.userModel.estimatedDocumentCount().exec();
    }

    async findAll(option: QueryOption, conditions: object = {}): Promise<UserDocument[]> {
        return this.userModel.find(conditions);
            // .sort(option.sort)
            // .select({ password: 0 })
            // .skip(option.skip)
            // .limit(option.limit)
            // .lean()
            // .exec();
    }

    async findById(id: string): Promise<UserDocument> {
        return this.userModel.findById(id).select({ password: 0 }).exec();
    }

    async findByUsernameOrEmail(username: string): Promise<UserDocument> {
        return this.userModel.findOne({
            $or: [
                { username },
                { email: username },
            ],
        }).exec();
    }

    async findByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByFacebookID(id: string): Promise<UserDocument> {
        return this.userModel.findOne({ "facebook.id": id }).exec();
    }

    async findByGoogleID(id: string): Promise<UserDocument> {
        return this.userModel.findOne({ "google.id": id }).exec();
    }

    async getProfile(id: string): Promise<any> {
        return await this.userModel.findByIdAndUpdate(
            id,
            { $set: { lastTimeLogin: new Date() } },
            { new: true },
        ).lean().then(async (res: User) => {
            return {
                ...res,
            };
        });
    }

    async changePasswordFirstByUserID(userID: string, data: ChangePasswordFirstDTO, jti: string): Promise<CommonResponseDTO> {
        const user = await this.userModel.findById(userID).exec();
        if (user) {
            if (await user.comparePassword(data.newPassword)) {
                throw new BackendErrorDTO(HttpStatus.CONFLICT, "DUPLICATE");
            }
            user.password = data.newPassword;
            user.email = data.email;
            user.soDienThoai = data.soDienThoai;

            if (data.email) {
                user.inactive = true;
            }

            user.validated = true;

            try {
                await user.save();
                if (data.email)
                    this.resendActiveToken(data.email);
                await this.authService.invalidateOtherUserTokens(userID, jti);
                return this.authService.login(user).then(result => {
                    return { success: true, data: result };
                });
            } catch (err) {
                console.error(err);
                throw new BackendErrorDTO(HttpStatus.INTERNAL_SERVER_ERROR, err.message);
            }
        }
        throw new NotFoundException();
    }

    async changePasswordByUserID(userID: string, data: ChangePasswordDTO, jti: string): Promise<CommonResponseDTO> {
        const user = await this.userModel.findById(userID).exec();
        if (user) {
            const [usePassword, useResetToken] = await Promise.all([
                user.comparePassword(data.oldPassword),
                user.compareResetPasswordToken(data.oldPassword),
            ]);
            if (user && (usePassword || useResetToken)) {
                const [dupPassword, dupResetToken] = await Promise.all([
                    user.comparePassword(data.newPassword),
                    user.compareResetPasswordToken(data.newPassword),
                ]);
                if (dupPassword || dupResetToken) {
                    return { success: false, message: "DUPLICATE" };
                }
                user.password = data.newPassword;
                try {
                    await user.save();
                    await this.authService.invalidateOtherUserTokens(userID, jti); return this.authService.login(user).then(result => {
                        return { success: true, data: result };
                    });
                } catch (err) {
                    console.error(err);
                    return { success: false, message: err.message };
                }
            }
            return { success: false, message: "UNAUTHORIZED" };
        }
        return { success: false };
    }

    async create(user: User, anhDaiDien: Express.Multer.File, systemInfo: SystemInfo): Promise<UserDocument> {
        if (!this.authTool.validateUsernameOrEmail(user.username)) {
            throw new BackendErrorDTO(400, "USERNAME_INVALID");
        }
        user.anhDaiDien = user.vaiTro === ERole.USER
            ? encodeURI(`https://ui-avatars.com/api/?rounded=true&bold=true&size=128&name=${user.hoTen}&background=${AV_BACKGROUND_1}&color=${AV_TEXT_1}`)
            : encodeURI(`https://ui-avatars.com/api/?rounded=true&bold=true&size=128&name=${user.hoTen}&background=${AV_BACKGROUND_2}&color=${AV_TEXT_2}`);
        if (anhDaiDien) {
            user.anhDaiDien = UploadTool.getURL(EUploadFolder.IMAGE, anhDaiDien.filename);
        }
        user.systemInfo = systemInfo;
        return this.userModel.create(user)
            .then(result => {
                if (!result.systemInfo.thirdPartyAuth)
                    this.userQueueService.createUserChatWithQueue(user);
                return result;
            })
            .catch((err) => {
                if ((err as MongoError).code === 11000) {
                    const field = Object.keys((err as any).keyPattern)[0];
                    throw new BackendErrorDTO(409, `${field} đã được sử dụng!`);
                }
                throw err;
            });
    }

    async register(user: User, anhDaiDien: Express.Multer.File): Promise<CommonResponseDTO> {
        console.log(user);
        user.username = user.username.toLowerCase();
        user.email = user.email.toLowerCase();
        if (!this.authTool.validateUsernameOrEmail(user.username)) {
            throw new BackendErrorDTO(400, "USERNAME_INVALID");
        }
        const hasUser = await this.userModel.findOne({ username: user.username }).exec().then(result => result ? 1 : 0);
        if (hasUser > 0) {
            throw new BackendErrorDTO(409, "USERNAME_DUPLICATED");
        }
        const hasEmail = await this.userModel.findOne({ email: user.email }).exec().then(result => result ? 1 : 0);
        if (hasEmail > 0) {
            throw new BackendErrorDTO(409, "EMAIL_DUPLICATED");
        }

        try {
            user.anhDaiDien = encodeURI(`https://ui-avatars.com/api/?rounded=true&bold=true&size=128&name=${user.hoTen}&background=${AV_BACKGROUND_1}&color=${AV_TEXT_1}`);
            if (anhDaiDien) {
                user.anhDaiDien = UploadTool.getURL(EUploadFolder.IMAGE, anhDaiDien.filename);
            }
            user.vaiTro = ERole.USER;
            user.validated = false;
            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() + 3);
            user.expiredAt = expiredDate;

            const result = await this.userModel.create(user);
            const activeToken = jwt.sign({ sub: result._id }, JWT_SECRET);
            SMTPMailer.sendMail(
                user.email,
                `Kích hoạt tài khoản đăng ký ${PROJECT_NAME}`,
                EmailTool.activeRegister(user, activeToken),
            );
            return { success: true };
        } catch (err) {
            if (err.code === 11000) {
                const field = Object.keys((err as any).keyPattern)[0];
                throw new BackendErrorDTO(HttpStatus.CONFLICT, `${field} đã được sử dụng!`);
            } else {
                throw new BackendErrorDTO(HttpStatus.INTERNAL_SERVER_ERROR, err.message);
            }
        }
    }

    async resendActiveToken(email: string): Promise<CommonResponseDTO> {
        email = email.toLowerCase();
        const user = await this.userModel.findOne({
            email,
            "systemInfo.emailValidate": false,
        }).exec();
        if (user) {
            if (!isNullOrUndefined(user.lastRequest.validateEmail) && moment().diff(user.lastRequest.validateEmail, "minutes") < 1)
                throw new BackendErrorDTO(410, "TOO_MANY_REQUEST");
            user.lastRequest.validateEmail = new Date();
            await user.save();

            const activeToken = jwt.sign({ sub: user._id }, JWT_SECRET);
            SMTPMailer.sendMail(
                user.email,
                "Xác thực thông tin website",
                EmailTool.activeRegister(user as User, activeToken),
            );
            return { success: true };
        }
        throw new BackendErrorDTO(410, "ACTIVE_USER_EXPIRY");
    }

    async changeEmail(username: string, body: ChangeEmailDTO, jti: string): Promise<CommonResponseDTO> {
        // Xác thực thông tin user
        const user = await this.authService.validateUser(username, body.password);
        // Nếu thông tin xác thực là chính xác
        if (user) {
            // Nếu user chưa có email hoặc email đổi khác email cũ
            if (!user.email || user.email !== body.email) {
                // Kiểm tra xem đã tồn tại email này chưa
                const check = await this.userModel.findOne({ email: body.email });
                if (check) {
                    throw new BackendErrorDTO(HttpStatus.CONFLICT, "EMAIL_DUPLICATED");
                }
                // Nếu chưa tồn tại thì gán email mới và đặt validated = false
                const newUser = await this.userModel.findByIdAndUpdate(
                    user._id,
                    { email: body.email, validated: false },
                    { new: true },
                );
                const activeToken = jwt.sign({ sub: user._id }, JWT_SECRET);
                // Gửi mail xác thực tới địa chỉ email mới
                SMTPMailer.sendMail(
                    body.email,
                    "Xác thực email",
                    EmailTool.validateEmail(user.hoTen, user.username, activeToken),
                );
                // Invalidate cac token
                this.authService.invalidateOtherUserTokens(user._id, jti);
                const payload = await this.authService.login(newUser);
                return { success: true, data: payload };
            } else {
                throw new BackendErrorDTO(HttpStatus.INTERNAL_SERVER_ERROR, "EMAIL_DUPLICATED");
            }
        } else {
            throw new BackendErrorDTO(HttpStatus.INTERNAL_SERVER_ERROR, "WRONG_PASSWORD");
        }
    }

    async forgetPassword(email: string): Promise<CommonResponseDTO> {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new BackendErrorDTO(400, "EMAIL_NOT_EXIST");
        }
        const token = this.authTool.randomToken(6);
        user.resetToken.password = token;
        if (!isNullOrUndefined(user.lastRequest.resetPassword) && moment().diff(user.lastRequest.resetPassword, "minutes") < 1)
            throw new BackendErrorDTO(410, "TOO_MANY_REQUEST");
        user.lastRequest.resetPassword = new Date();
        await user.save();
        SMTPMailer.sendMail(
            user.email,
            "Quên mật khẩu tài khoản ứng dụng sổ tay sinh viên",
            EmailTool.resetPasswordEmail(user.hoTen, user.username, token),
        );
        return { success: true };
    }

    /**
     *
     * @param id Id of user profile
     * @param update Update profile information
     * @param anhDaiDien Update profile avatar
     * @param jti User's jti. Do not pass if user profile was updated by admin.
     */
    async updateById(
        id: string,
        update: User,
        anhDaiDien: Express.Multer.File,
        jti: string = null,
    ): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (user) {
            // If admin change password or role of an user then invalidate all JWT Token of that user
            if (update.password || update.vaiTro) {
                await this.authService.invalidateOtherUserTokens(id, jti);
            }
            Object.assign(user, update);
            if (anhDaiDien) {
                user.anhDaiDien = UploadTool.getURL(EUploadFolder.IMAGE, anhDaiDien.filename);
            }
            return user.save().then((result: User) => {
                result.password = undefined;
                return result;
            }).catch((err: MongoError) => {
                if (err.code === 11000) {
                    const field = Object.keys((err as any).keyPattern)[0];
                    throw new BackendErrorDTO(409, `${field} đã được sử dụng!`);
                }
                throw err;
            });
        } else {
            return null;
        }
    }

    async forceActivate(id: string, jti: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id).exec();
        if (user) {
            user.validated = true;
            // AuthTool.deleteJWTKeys(user._id, Date.now());
            await this.authService.invalidateOtherUserTokens(id, jti);
            return user.save().catch(err => {
                console.error(`Error force active user: ${err.message}`);
                return null;
            });
        } else {
            return null;
        }
    }

    async forceResetPassword(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (user) {
            user.password = DEFAULT_USER_PASSWORD;
            return user.save().then((result: User) => {
                result.password = undefined;
                return result;
            });
        } else {
            return null;
        }
    }

    async forceResetPasswordByCond(cond: object) {
        const allU = await this.userModel.find(cond);
        return Promise.map(allU, async (user) => {
            user.password = user.username;
            return user.save();
        });
    }

    async deleteByUsername(
        username: string,
        jti: string,
    ): Promise<DeleteResultDTO> {
        const user = await this.userModel.findOne({
            username,
        });
        if (user && user.vaiTro !== ERole.ADMIN) {
            const id = user._id;
            const anhDaiDien = user.anhDaiDien;
            // AuthTool.deleteJWTKeys(user._id);
            await this.authService.invalidateOtherUserTokens(id, jti);
            const result = await this.userModel.deleteOne({ _id: id }).exec();
            UploadTool.removeFile(anhDaiDien);
            this.userQueueService.deleteUserChatWithQueue(id);
            return result;
        } else {
            if (user) {
                throw new BackendErrorDTO(403, "Không thể xoá tài khoản quản trị!");
            } else {
                return null;
            }
        }
    }

    async deleteById(id: string, jti: string): Promise<DeleteResultDTO> {
        const user = await this.userModel.findById(id).exec();
        if (user && user.vaiTro !== ERole.ADMIN) {
            const anhDaiDien = user.anhDaiDien;
            // AuthTool.deleteJWTKeys(user._id);
            await this.authService.invalidateOtherUserTokens(id, jti);
            const result = await this.userModel.deleteOne({ _id: id }).exec();
            UploadTool.removeFile(anhDaiDien);
            this.userQueueService.deleteUserChatWithQueue(id);
            return result;
        } else {
            if (user) {
                throw new BackendErrorDTO(403, "Không thể xoá tài khoản quản trị!");
            } else {
                return null;
            }
        }
    }

    async findByRole(role: number, option: QueryOption): Promise<User[]> {
        return this.userModel.find({
            vaiTro: role,
        }).sort(option.sort)
            .select({ password: 0 })
            .skip(option.skip)
            .limit(option.limit)
            .lean()
            .exec();
    }

    async getAllSchemaField() {
        const listPath: string[] = [];
        this.userModel.schema.eachPath(path => {
            if (path !== "__v" && path !== "_id" && path !== "createdAt") listPath.push(path);
        });
        return listPath;
    }
}
