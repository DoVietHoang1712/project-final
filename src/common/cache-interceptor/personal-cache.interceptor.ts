import { Injectable, CacheInterceptor, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { CACHE_KEY_METADATA } from "@nestjs/common/cache/cache.constants";
import { User } from "../../modules/users/users.schema";

@Injectable()
export class PersonalCacheInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined {
        const httpAdapter = this.httpAdapterHost.httpAdapter;
        const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
        const cacheMetadata = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());
        if (!isHttpApp || cacheMetadata) {
            return cacheMetadata;
        }
        const request = context.getArgByIndex(0);
        if (httpAdapter.getRequestMethod(request) !== "GET") {
            return undefined;
        }

        const url = context.switchToHttp().getRequest<Request>().originalUrl;
        const user = context.switchToHttp().getRequest<Request>().user as User;
        return `${url}:${user.username}`;
    }
}
