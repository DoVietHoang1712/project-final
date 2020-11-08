import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema, USER_DB } from "../users/users.schema";
import { VerifyController } from "./verify.controller";
import { VerifyService } from "./verify.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: USER_DB, schema: UserSchema },
    ]),
  ],
  controllers: [VerifyController],
  providers: [VerifyService],
})
export class VerifyModule { }
