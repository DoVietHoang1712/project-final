import { RedisToolModule } from "./../redis-tool/redis-tool.module";
import { Module, Global } from "@nestjs/common";
import { AuthToolService } from "./auth-tool.service";

@Global()
@Module({
  imports: [
    RedisToolModule,
  ],
  providers: [AuthToolService],
  exports: [AuthToolService],
})
export class AuthToolModule {}
