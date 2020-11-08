import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JWT_EXP, JWT_SECRET } from "../../config/secrets";
import { UsersModule } from "../users/users.module";
import { Authentication } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {
                expiresIn: JWT_EXP,
            },
        }),
        MongooseModule.forFeature([
        ]),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, FacebookStrategy, GoogleStrategy],
    controllers: [Authentication],
    exports: [AuthService],
})
export class AuthModule { }
