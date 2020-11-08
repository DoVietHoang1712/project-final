import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_SECRET } from "../../../config/secrets";
import { AuthToolService } from "../../tool/auth-tool/auth-tool.service";
import { User } from "../../users/users.schema";
import { UsersService } from "../../users/users.service";
import { PayloadDTO } from "../dto/payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        private readonly authToolService: AuthToolService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(payload: PayloadDTO): Promise<User> {
        const user = await this.userService.findById(payload.sub);
        if (user) {
            user.jti =  payload.jti;
            const checkJWT = await this.authToolService.checkJWTKey(user._id, user.jti);
            return checkJWT ? user : undefined;
        }
        return undefined;
    }
}
