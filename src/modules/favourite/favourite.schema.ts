import { USER_DB } from "./../users/users.schema";
import { ObjectID } from "mongodb";
import { ApiProperty } from "@nestjs/swagger";
import * as mongoose from "mongoose";

export const FAVOURITE_NAME = "Favourite";

export const FavouriteSchema = new mongoose.Schema({
    ngayThem: {
        type: Date,
        default: Date.now(),
    },
    nguoiThem: {
        type: ObjectID,
        ref: USER_DB,
    },
    loai: {
        type: String,
        required: false,
    },
}, {collection: FAVOURITE_NAME, toJSON: {virtuals: true}, timestamps: true});

export class Favourite {
    @ApiProperty()
    ngayThem: Date;

    @ApiProperty()
    loai: string;
    nguoiThem: ObjectID | string;
}

FavouriteSchema.virtual("user", {
    ref: USER_DB,
    localField: "nguoiThem",
    foreignField: "_id",
    justOne: true,
});
export interface FavouriteDocument extends mongoose.Document, Favourite { }
