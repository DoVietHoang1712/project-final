import { IoAdapter } from "@nestjs/platform-socket.io";
import * as redisIoAdapter from "socket.io-redis";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "./secrets";

const redisAdapter = redisIoAdapter({ host: REDIS_HOST, port: REDIS_PORT, auth_pass: REDIS_PASSWORD });

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
