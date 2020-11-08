import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Authorization, Roles, SystemInfoData } from "../../common/decorators/auth.decorator";
import { ApiCommonErrors, ApiQueryCond, ApiQueryGetMany, ApiQueryPagination, ApiQuerySelect, QueryGet } from "../../common/decorators/common.decorator";
import { ReqUser } from "../../common/decorators/user.decorator";
import { BackendErrorDTO } from "../../common/dto/backend-error.dto";
import { CommonResponseDTO } from "../../common/dto/common-response.dto";
import { DeleteResultDTO } from "../../common/dto/delete-result.dto";
import { ResponseDTO } from "../../common/dto/response.dto";
import { ERole } from "../../config/constants";
import { QueryPostOption } from "../../tools/request.tool";
import { ResponseTool } from "../../tools/response.tool";
import { UploadTool } from "../../tools/upload.tool";
import { ChangeEmailDTO } from "./dto/change-email.dto";
import { ChangePasswordFirstDTO } from "./dto/change-password-first.dto";
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { ForceActiveDTO } from "./dto/force-active.dto";
import { GetUserDTO } from "./dto/get-user.dto";
import { RegisterUserDTO } from "./dto/register-user.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { UpdateGuestInfoFirstDTO } from "./dto/update-info-first.dto";
import { UpdateMyUserDTO } from "./dto/update-my-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { SystemInfo, User } from "./users.schema";
import { UsersService } from "./users.service";

@Controller("sotay/users")
@ApiCommonErrors()
@ApiTags("Users")
export class UsersController {
    constructor(
        private readonly userService: UsersService,
    ) { }

    @Get("/fieldSchema")
    async getFieldSchema(): Promise<any> {
        const data = await this.userService.getAllSchemaField();
        return ResponseTool.GET_OK(data);
    }

    // @Post("/export-excel")
    // async superExportExcel(@Body() body: GetExportDTO): Promise<any> {
    //     const data = await this.userService.superExportExcel(body);
    //     return ResponseTool.POST_OK(data);
    // }

    @Get()
    @Authorization()
    @Roles(ERole.ADMIN)
    @ApiOkResponse({ type: ResponseDTO })
    @ApiQueryGetMany()
    async findAll(
        @QueryGet() query: QueryPostOption,
    ): Promise<ResponseDTO> {
        const data = await this.userService.findAll(query.options, query.conditions);
        const total = await this.userService.count(query.conditions);
        return ResponseTool.GET_OK(data, total);
    }

    @Get("my/profile")
    @Authorization()
    @ApiOkResponse({ type: ResponseDTO })
    async getMyProfile(
        @ReqUser("_id") userId: string,
    ): Promise<ResponseDTO> {
        return ResponseTool.GET_OK(await this.userService.getProfile(userId));
    }

    @Get(":id")
    @Authorization()
    @Roles(ERole.ADMIN)
    @ApiOkResponse({ type: ResponseDTO })
    async findById(@Param("id") id: string): Promise<ResponseDTO> {
        return ResponseTool.GET_OK(await this.userService.findById(id));
    }

    @Post()
    @Authorization()
    @Roles(ERole.ADMIN, ERole.USER)
    @ApiCreatedResponse({ type: GetUserDTO })
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("anhDaiDien", UploadTool.imageUpload))
    async create(
        @Body() user: CreateUserDTO,
        @UploadedFile() anhDaiDien: Express.Multer.File,
    ): Promise<User> {
        const systemInfo: SystemInfo = {
            indentityValidate: true,
            emailValidate: true,
            thirdPartyAuth: false,
        };
        return await this.userService.create(user as User, anhDaiDien, systemInfo);
    }

    // @Post("guest")
    // @ApiCreatedResponse({ type: GetUserDTO })
    // async createGuess(@Body() user: CreateGuestDTO) {
    //     return await this.userService.createGuest(user);
    // }

    @Authorization()
    @Post("my/change-password/first-time")
    @ApiOkResponse({ type: ChangePasswordDTO })
    async changePasswordFirstTime(
        @Body() data: ChangePasswordFirstDTO,
        @ReqUser("_id") userId: string,
        @ReqUser("jti") jti: string,
    ): Promise<CommonResponseDTO> {
        return await this.userService.changePasswordFirstByUserID(userId, data, jti);
    }

    @Authorization()
    @Post("my/change-password")
    @ApiOkResponse({ type: ChangePasswordDTO })
    async changePassword(
        @Body() data: ChangePasswordDTO,
        @ReqUser("_id") userId: string,
        @ReqUser("jti") jti: string,
    ): Promise<CommonResponseDTO> {
        return await this.userService.changePasswordByUserID(userId, data, jti);
    }

    @Post("force/activate")
    @Authorization()
    @Roles(ERole.ADMIN)
    @ApiBody({ type: ForceActiveDTO })
    async forceActivate(
        @Req() req: Request,
        @Body("idUser") id: string,
    ): Promise<ResponseDTO> {
        const jti = (req.user as User).jti;
        const data = await this.userService.forceActivate(id, jti);
        return ResponseTool.POST_OK(data);
    }

    @Post("force/reset-password")
    @Authorization()
    @Roles(ERole.ADMIN)
    @ApiBody({ type: ForceActiveDTO })
    async forceResetPassword(
        @Body("idUser") id: string,
    ): Promise<ResponseDTO> {
        const data = await this.userService.forceResetPassword(id);
        return ResponseTool.POST_OK(data);
    }

    @Post("force/reset-password-by-cond")
    @Authorization()
    @Roles(ERole.ADMIN)
    @ApiQueryCond()
    async forceResetPassByCond(
        @QueryGet() query: QueryPostOption,
    ) {
        const res = await this.userService.forceResetPasswordByCond(query.conditions);
        return ResponseTool.POST_OK(res);
    }

    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("anhDaiDien", UploadTool.imageUpload))
    @Post("register")
    @ApiOkResponse()
    registerUser(
        @Body() user: RegisterUserDTO,
        @UploadedFile() anhDaiDien: Express.Multer.File,
    ): Promise<CommonResponseDTO> {
        return this.userService.register(user as User, anhDaiDien);
    }

    @Post("my/resend-active")
    @ApiOkResponse()
    @Authorization()
    @SystemInfoData({
        emailValidate: [false],
        indentityValidate: [true],
        thirdPartyAuth: [false, true],
    })
    async resendToken(@Req() req: Request): Promise<CommonResponseDTO> {
        const user = req.user as User;
        return await this.userService.resendActiveToken(user.email);
    }

    @Post("my/change-email")
    @ApiOkResponse()
    @Authorization()
    async changeEmail(@Req() req: Request, @Body() body: ChangeEmailDTO): Promise<CommonResponseDTO> {
        const user = req.user as User;
        return await this.userService.changeEmail(user.username, body, user.jti);
    }

    @Post("forgot-password")
    @ApiOkResponse({ type: CommonResponseDTO })
    @ApiNotFoundResponse({ type: BackendErrorDTO })
    async resetPassword(@Body() data: ResetPasswordDTO): Promise<CommonResponseDTO> {
        return await this.userService.forgetPassword(data.email);
    }

    @Put("my/profile")
    @ApiOkResponse({ type: GetUserDTO })
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("anhDaiDien", UploadTool.imageUpload))
    @Authorization()
    async updateMyUser(
        @Body() user: UpdateMyUserDTO,
        @UploadedFile() anhDaiDien: Express.Multer.File,
        @ReqUser("_id") userId: string,
        @ReqUser("jti") jti: string,
    ): Promise<User> {
        return await this.userService.updateById(userId, user as User, anhDaiDien, jti);
    }

    @Delete("username/:username")
    @Authorization()
    @Roles(ERole.ADMIN)
    @ApiOkResponse({ type: DeleteResultDTO })
    async deleteByUsername(
        @Param("username") username: string,
        @Req() req: Request,
    ): Promise<DeleteResultDTO> {
        const jti = (req.user as User).jti;
        return await this.userService.deleteByUsername(username, jti);
    }

    @Delete(":id")
    @Authorization()
    @Roles(ERole.ADMIN)
    @ApiOkResponse({ type: DeleteResultDTO })
    async deleteById(
        @Param("id") id: string,
        @Req() req: Request,
    ): Promise<DeleteResultDTO> {
        const jti = (req.user as User).jti;
        return await this.userService.deleteById(id, jti);
    }

}
