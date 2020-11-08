import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ERole } from "../../config/constants";
import { RolesGuard } from "../guards/roles.guard";
import { SystemInfoGuard, SystemInfoSet } from "../guards/system-info.guard";

export const Roles = (...roles: ERole[]) => SetMetadata("roles", roles);

export const SystemInfoData = (info: SystemInfoSet) => SetMetadata("system-info", info);

export const Authorization = () => applyDecorators(
    UseGuards(
        AuthGuard("jwt"),
        RolesGuard,
        SystemInfoGuard,
    ),
    ApiBearerAuth(),
);
