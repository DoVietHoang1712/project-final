import { UploadTool } from "./../../tools/upload.tool";
import { CreateFavourite } from "./dto/create-favourite.dto";
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

    async createFav(body: any): Promise<any> {
        const res = await this.favouriteModel.create(body);
        if (res.files.length > 0) {
            console.log("123");
            for (const file of res.files) {
                const path = res.files.map(file => UploadTool.getPath(file));
                res.fileURL = await (await UploadTool.createZipArchive("Favourite", path)).url;
                await res.save();
            }
        }
        return res;
    }
}
