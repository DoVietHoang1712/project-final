import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { use } from "passport";
import * as FacebookTokenStrategy from "passport-facebook-token";
import { BackendErrorDTO } from "../../../common/dto/backend-error.dto";
import { ERole } from "../../../config/constants";
import { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from "../../../config/secrets";
import { AuthToolService } from "../../tool/auth-tool/auth-tool.service";
import { User, SystemInfo } from "../../users/users.schema";
import { UsersService } from "../../users/users.service";

@Injectable()
export class FacebookStrategy {
    constructor(
        private readonly userService: UsersService,
        private readonly authToolService: AuthToolService,
    ) {
        this.init();
    }
    init() {
        use("facebook",
            new FacebookTokenStrategy(
                {
                    clientID: FACEBOOK_CLIENT_ID,
                    clientSecret: FACEBOOK_CLIENT_SECRET,
                },
                async (
                    accessToken: string,
                    refreshToken: string,
                    profile: FacebookTokenStrategy.Profile,
                    done: (err: any, user?: any, info?: any) => void,
                ) => {
                    const user = await this.userService.findByFacebookID(profile.id);
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
                        return done(null, await this.userService.create({
                            username: profile.id,
                            password,
                            hoTen: profile._json.name,
                            email: profile._json.email,
                            facebook: {
                                id: profile.id,
                            },
                            vaiTro: ERole.USER,
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
