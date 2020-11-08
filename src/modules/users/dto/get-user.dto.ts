import { PartialType } from "@nestjs/swagger";
import { User } from "../users.schema";

export class GetUserDTO extends PartialType(User) { }
