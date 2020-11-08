import { VerifyModule } from "./modules/verify/verify.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpExceptionFilter } from "./common/exception-filter/http-exception.filter";
import { DATABASE_URI } from "./config/secrets";
// tslint:disable-next-line:no-var-requires
const redisStore = require("cache-manager-redis-store");

@Module({
    imports: [
        MongooseModule.forRoot(DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            retryDelay: 5000,
        }),
        UsersModule,
        AuthModule,
        VerifyModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule { }
