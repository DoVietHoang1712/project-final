import { Module } from "@nestjs/common";
import { UploadChungService } from "./upload-chung.service";
import { UploadChungController } from "./upload-chung.controller";

@Module({
  providers: [UploadChungService],
  controllers: [UploadChungController],
  exports: [UploadChungService],
})
export class UploadChungModule {}
