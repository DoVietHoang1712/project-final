import { Favourite } from "./../favourite.schema";
import { PartialType } from "@nestjs/swagger";

export class UpdateFavourite extends PartialType(Favourite) { }
