import { Favourite } from "./../favourite.schema";
import { PartialType } from "@nestjs/swagger";

export class CreateFavourite extends PartialType(Favourite) { }
