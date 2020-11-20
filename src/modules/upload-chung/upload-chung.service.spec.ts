import { Test, TestingModule } from "@nestjs/testing";
import { UploadChungService } from "./upload-chung.service";

describe("UploadChungService", () => {
  let service: UploadChungService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadChungService],
    }).compile();

    service = module.get<UploadChungService>(UploadChungService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
