import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { VerifyService } from "./verify.service";
import { ApiCommonErrors } from "../../common/decorators/common.decorator";

@ApiTags("Verify")
@Controller("verify")
@ApiCommonErrors()
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) { }

    @Get("register/:activeToken")
    async verifyUser(@Param("activeToken") activeToken: string, @Res() res: Response): Promise<void> {
        res.render("users/verify", await this.verifyService.userRegister(activeToken));
    }

    @Get("email/:activeToken")
    async validateEmail(@Param("activeToken") activeToken: string, @Res() res: Response): Promise<void> {
        res.render("users/verify", await this.verifyService.verifyEmail(activeToken));
    }

}
