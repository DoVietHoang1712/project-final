import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import Bull = require("bull");
import { User } from "./users.schema";

@Injectable()
export class UserQueueService {
    private readonly defaultQueueOption: Bull.JobOptions = {
        removeOnComplete: true,
        delay: 100,
    };
    constructor(
        @InjectQueue("user")
        private readonly userQueue: Queue,
    ) { }
    createUserChatWithQueue(user: User): Promise<Bull.Job> {
        return this.userQueue.add("create-user", user, this.defaultQueueOption);
    }

    updateUserChatWithQueue(user: User): Promise<Bull.Job> {
        return this.userQueue.add("update-user", user, this.defaultQueueOption);
    }

    setAvatarChatWithQueue(user: User): Promise<Bull.Job> {
        return this.userQueue.add("avatar-user", user, this.defaultQueueOption);
    }

    deleteUserChatWithQueue(userId: string): Promise<Bull.Job> {
        return this.userQueue.add("delete-user", userId, this.defaultQueueOption);
    }
}
