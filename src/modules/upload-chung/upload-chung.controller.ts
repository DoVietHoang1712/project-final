import { ResponseTool } from "./../../tools/response.tool";
import { UploadMultiDTO } from "./dto/upload-multi.dto";
import { EUploadFolder, UploadTool } from "./../../tools/upload.tool";
import { UploadChungService } from "./upload-chung.service";
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Authorization } from "../../common/decorators/auth.decorator";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller("upload-chung")
@ApiTags("UploadChung")
//  @Authorization()

export class UploadChungController {
    constructor(
        private readonly uploadChungService: UploadChungService,
    ) {

    }

    @Post("upload")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileFieldsInterceptor([{name: "fileFavourite", maxCount: 4}], UploadTool.imageUpload))
    async getMultiFiles(
        @UploadedFiles() fileFavourite: Express.Multer.File[],
        @Body() body: UploadMultiDTO,
    ): Promise<any> {
        body.fileFavourite = [];
        const dinhKem = (fileFavourite as any).fileFavourite;
        if (dinhKem) {
            for (const file of dinhKem) {
                body.fileFavourite.push(
                    UploadTool.getURL(EUploadFolder.IMAGE, file.filename),
                );
            }
        }
        return ResponseTool.GET_OK(body.fileFavourite);
    }
}
