import { AuthToolModule } from "./../tool/auth-tool/auth-tool.module";
import { BullModule } from "@nestjs/bull";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../../config/secrets";
import { AuthModule } from "../auth/auth.module";
import { UserQueueService } from "./users-queue.service";
import { UsersController } from "./users.controller";
import { UserSchema, USER_DB } from "./users.schema";
import { UsersService } from "./users.service";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        BullModule.registerQueue({
            name: "user",
            redis: {
                host: REDIS_HOST,
                port: REDIS_PORT,
                password: REDIS_PASSWORD,
            },
        }),
        MongooseModule.forFeature([
            { name: USER_DB, schema: UserSchema },
        ]),
        AuthToolModule,
    ],
    controllers: [UsersController],
    providers: [
        UserQueueService,
        UsersService,
        AuthToolModule,
    ],
    exports: [UsersService, UserQueueService],
})
export class UsersModule { }
