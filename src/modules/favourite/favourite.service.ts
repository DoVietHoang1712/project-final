import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FavouriteDocument, FAVOURITE_NAME } from "./favourite.schema";
import { BaseService } from "./../../common/base/base.service";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FavouriteService extends BaseService<FavouriteDocument> {
    constructor(
        @InjectModel(FAVOURITE_NAME)
        private readonly favouriteModel: Model<FavouriteDocument>,
    ) {
        super(favouriteModel);
    }
}
