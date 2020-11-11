import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from "jsonwebtoken";
import { Model } from "mongoose";
import { PugTools } from "src/tools/pug.tools";
import { JWT_SECRET } from "../../config/secrets";
import { AuthService } from "../auth/auth.service";
import { PayloadDTO } from "../auth/dto/payload.dto";
import { UserDocument, USER_DB } from "../users/users.schema";

@Injectable()
export class VerifyService {
    constructor(
        @InjectModel(USER_DB) private readonly userModel: Model<UserDocument>,
        private readonly authService: AuthService,
    ) { }

    async userRegister(activeToken: string): Promise<any> {
        try {
            const id = (jwt.verify(activeToken, JWT_SECRET) as PayloadDTO).sub;
            const user = await this.userModel.findById(id).select("-createdAt -updatedAt").lean().exec() as UserDocument;
            if (user) {
                return this.userModel.findByIdAndUpdate(
                    user._id,
                    { $unset: { expiredAt: true }, $set: { "systemInfo.emailValidate": true } },
                    { runValidators: true },
                )
                    .then(async () => {
                        await this.authService.invalidateOtherUserTokens(user._id, null);
                        return PugTools.res({
                            message: "ACTIVE_SUCCESS",
                            success: true,
                        });
                    }).catch(err => {
                        console.error(err);
                        return PugTools.res({
                            message: "ACTIVE_USER_ERROR",
                        });
                    });
            } else {
                return PugTools.res({
                    message: "Token invalid",
                });
            }
        } catch (err) {
            return PugTools.res({
                message: "Token invalid",
            });
        }
    }

    async verifyEmail(activeToken: string): Promise<any> {
        try {
            const id = (jwt.verify(activeToken, JWT_SECRET) as PayloadDTO).sub;
            const user = await this.userModel.findById(id).select("-createdAt -updatedAt").exec() as UserDocument;
            if (user) {
                if (user.validated === true) {
                    return PugTools.res({
                        message: "Email verify",
                    });
                }
                user.validated = true;
                return user.save().then(async () => {
                    await this.authService.invalidateOtherUserTokens(user._id, null);
                    return PugTools.res({
                        message: "Email verify",
                    });
                }).catch(err => {
                    console.error(err);
                    return PugTools.res({
                        message: "ACTIVE_USER_ERROR",
                    });
                });
            } else {
                return PugTools.res({
                    message: "Token invalid",
                });
            }
        } catch (err) {
            return PugTools.res({
                message: "Token invalid",
            });
        }
    }
}
