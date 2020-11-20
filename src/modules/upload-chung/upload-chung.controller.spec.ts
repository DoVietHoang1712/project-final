import { Test, TestingModule } from "@nestjs/testing";
import { UploadChungController } from "./upload-chung.controller";

describe("UploadChungController", () => {
  let controller: UploadChungController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadChungController],
    }).compile();

    controller = module.get<UploadChungController>(UploadChungController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
