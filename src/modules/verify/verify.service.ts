import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from "jsonwebtoken";
import { Model } from "mongoose";
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
            console.log(user);
            if (user) {
                return this.userModel.findByIdAndUpdate(
                    user._id,
                    { $unset: { expiredAt: true }, $set: { "systemInfo.emailValidate": true } },
                    { runValidators: true },
                )
                    .then(async () => {
                        await this.authService.invalidateOtherUserTokens(user._id, null);
                    }).catch(err => {
                        console.error(err);
                    });
            } else {
                return console.log("Token invalid");
            }
        } catch (err) {
            throw new Error("Token Invalid");
        }
    }

    async verifyEmail(activeToken: string): Promise<any> {
        try {
            const id = (jwt.verify(activeToken, JWT_SECRET) as PayloadDTO).sub;
            const user = await this.userModel.findById(id).select("-createdAt -updatedAt").exec() as UserDocument;
            if (user) {
                if (user.validated === true) {
                    return console.log("Email verify");
                }
                user.validated = true;
                return user.save().then(async () => {
                    await this.authService.invalidateOtherUserTokens(user._id, null);
                    console.log("Email verify");
                }).catch(err => {
                    return console.error(err);
                });
            } else {
                return console.log("Token invalid");
            }
        } catch (err) {
            return console.log("Token invalid");
        }
    }
}
