import { CreateFavourite } from "./dto/create-favourite.dto";
import { ResponseTool } from "./../../tools/response.tool";
import { ResponseDTO } from "./../../common/dto/response.dto";
import { QueryPostOption } from "./../../tools/request.tool";
import { FavouriteService } from "./favourite.service";
import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Authorization, Roles } from "src/common/decorators/auth.decorator";
import { ERole } from "src/config/constants";
import { ApiQueryCond, ApiQueryGetMany, QueryGet } from "src/common/decorators/common.decorator";
import { User } from "../users/users.schema";

@Controller("favourite")
@ApiTags("Favourite")
@Authorization()
export class FavouriteController {
    constructor(
        private readonly favouriteService: FavouriteService,
    ) {}

    @Get()
    @Roles(ERole.ADMIN)
    @ApiQueryGetMany()
    async getByCond(
        @QueryGet() query: QueryPostOption,
    ): Promise<any> {
        const result = await Promise.all([
            this.favouriteService.getMany(query),
            this.favouriteService.count(query.conditions),
        ]);
        return ResponseTool.GET_OK(result[0], result[1]);
    }

    @Get("my")
    async getMy(
        @Req() req: Express.Request,
    ): Promise<any> {
        const id = (req.user as any)._id;
        const cond = {nguoiThem: id};
        const data = await this.favouriteService.getMany(cond as any);
        return ResponseTool.GET_OK(data);
    }

    @Post("my")
    async postMy(
        @Body() body: CreateFavourite,
        @Req() req: Express.Request,
    ): Promise<any> {
        body.nguoiThem = (req.user as any)._id;
        const data = await this.favouriteService.create(body);
        return ResponseTool.CREATED(data);
    }
}
