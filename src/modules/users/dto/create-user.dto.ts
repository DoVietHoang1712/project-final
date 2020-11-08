import { PartialType } from "@nestjs/swagger";
import { User } from "../users.schema";

export class CreateUserDTO extends PartialType(User) { }
