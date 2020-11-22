import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserDocument } from "../../modules/users/users.schema";

export interface SystemInfoSet {
    indentityValidate: boolean[];
    emailValidate: boolean[];
    thirdPartyAuth: boolean[];
}

@Injectable()
export class SystemInfoGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const systemInfoSet: SystemInfoSet = this.reflector.get<SystemInfoSet>("system-info", context.getHandler())
            || this.reflector.get<SystemInfoSet>("system-info", context.getClass())
            ||
        {
            indentityValidate: [true],
            emailValidate: [false, true],
            thirdPartyAuth: [false, true],
        };
        const user = context.switchToHttp().getRequest().user as UserDocument;
        if (!user) {
            return false;
        }
        return systemInfoSet.indentityValidate.includes(user.systemInfo.indentityValidate)
            && systemInfoSet.emailValidate.includes(user.systemInfo.emailValidate)
            && systemInfoSet.thirdPartyAuth.includes(user.systemInfo.thirdPartyAuth);
    }
}
