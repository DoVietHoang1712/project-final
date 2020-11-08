import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { ApiCommonErrors } from "../../common/decorators/common.decorator";
import { User, UserDocument } from "../users/users.schema";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto";
import { ExternalLoginDTO } from "./dto/external-login.dto";
import { LoginResponseDTO } from "./dto/login-response.dto";
import { LogoutResponseDTO } from "./dto/logout-response.dto";

@Controller("auth")
@ApiTags("Auth")
@ApiCommonErrors()
export class Authentication {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard("local"))
    @Post("login")
    @ApiOkResponse({ type: LoginResponseDTO })
    @ApiBody({ type: AuthDTO })
    async login(@Req() req: Request): Promise<LoginResponseDTO> {
        return await this.authService.login(req.user as UserDocument);
    }

    @Post("logout")
    @UseGuards(AuthGuard("jwt"))
    @ApiResponse({ type: LogoutResponseDTO })
    @ApiBearerAuth()
    async logout(@Req() req: Request): Promise<LogoutResponseDTO> {
        return await this.authService.logout(req.user as UserDocument);
    }

    @Post("login/facebook")
    @UseGuards(AuthGuard("facebook"))
    @ApiOkResponse({ type: LoginResponseDTO })
    @ApiBody({ type: ExternalLoginDTO })
    async loginWithFacebook(@Req() req: Request): Promise<LoginResponseDTO> {
        return await this.authService.login(req.user as UserDocument);
    }

    @Post("login/google")
    @UseGuards(AuthGuard("google"))
    @ApiOkResponse({ type: LoginResponseDTO })
    @ApiBody({ type: ExternalLoginDTO })
    async loginWithGoogle(@Req() req: Request): Promise<LoginResponseDTO> {
        return await this.authService.login(req.user as UserDocument);
    }
}
