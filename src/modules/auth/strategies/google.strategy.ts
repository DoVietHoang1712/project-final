import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { use } from "passport";
import { BackendErrorDTO } from "../../../common/dto/backend-error.dto";
import { ERole } from "../../../config/constants";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../../config/secrets";
import { AuthToolService } from "../../tool/auth-tool/auth-tool.service";
import { SystemInfo, User } from "../../users/users.schema";
import { UsersService } from "../../users/users.service";
// tslint:disable-next-line:no-var-requires
const GoogleTokenStrategy = require("passport-google-token").Strategy;

@Injectable()
export class GoogleStrategy {
    constructor(
        private readonly userService: UsersService,
        private readonly authToolService: AuthToolService,
    ) {
        this.init();
    }
    init() {
        use(
            "google",
            new GoogleTokenStrategy({
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
            },
                async (
                    accessToken: string,
                    refreshToken: string,
                    profile: any,
                    done: (err: any, user?: any, info?: any) => void,
                ) => {
                    const user = await this.userService.findByGoogleID(profile.id);
                    if (user) {
                        user.password = undefined;
                        return done(null, user);
                    } else {
                        if (profile._json.email) {
                            const check = await this.userService.findByEmail(profile._json.email);
                            if (check) {
                                return done(new BackendErrorDTO(409, "Email duplicate"));
                            }
                        }
                        const password = await bcrypt.hash(this.authToolService.randomToken(), 10);
                        const systemInfo: SystemInfo = {
                            indentityValidate: true,
                            emailValidate: profile._json.email ? true : false,
                            thirdPartyAuth: true,
                        };
                        return done(
                            null,
                            await this.userService.create({
                                username: null,
                                password,
                                hoTen: profile._json.name,
                                email: profile._json.email,
                                google: {
                                    id: profile.id,
                                },
                                vaiTro: ERole.GUEST,
                            } as User, undefined, systemInfo).then(result => {
                                result.password = undefined;
                                return result;
                            }),
                        );
                    }
                },
            ),
        );
    }
}
