import { MongooseModule } from "@nestjs/mongoose";
import { FavouriteService } from "./favourite.service";
import { Module } from "@nestjs/common";
import { FavouriteController } from "./favourite.controller";
import { FAVOURITE_NAME, FavouriteSchema } from "./favourite.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: FAVOURITE_NAME, schema: FavouriteSchema},
    ]),
  ],
  controllers: [FavouriteController],
  providers: [FavouriteService, FavouriteController],
  exports: [FavouriteService],
})
export class FavouriteModule {}
