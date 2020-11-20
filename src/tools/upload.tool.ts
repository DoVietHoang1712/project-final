import multer = require("multer");
import * as fs from "fs";
import * as sharp from "sharp";
import * as archiver from "archiver";
import * as bluebird from "bluebird";
import * as path from "path";
import { parse } from "url";
import { BackendErrorDTO } from "../common/dto/backend-error.dto";
import { SERVER_ADDRESS } from "../config/secrets";
import { StringTool } from "./string.tool";
import { Schema, Model, model, Document } from "mongoose";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
export enum EUploadFolder {
    IMAGE = "images",
    DOCUMENT = "documents",
    DATA = "data",
}

export const UPLOAD_PATH_MODEL = "UploadPath";

export const UploadPathSchema = new Schema({
    folder: {
        type: String,
        enum: Object.values(EUploadFolder),
    },
    url: String,
    path: String,
}, { timestamps: true, collection: "UploadPath" });

export class UploadPath {
    folder: string;
    url: string;
    path: string;
}

export interface UploadPathDocument extends UploadPath, Document { }
export class UploadTool {
    private static readonly uploadPathModel = model<UploadPathDocument>(UPLOAD_PATH_MODEL, UploadPathSchema);

    private static createUploadPath(
        folder: EUploadFolder,
        url: string,
        path: string,
    ): Promise<UploadPathDocument> {
        return this.uploadPathModel.create({ folder, url, path });
    }

    private static isImageFile(fileMimetype: string) {
        return [
            "image/img",
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/svg+xml",
        ].includes(fileMimetype);
    }

    static getURL(directory: EUploadFolder, filename: string) {
        return `${SERVER_ADDRESS}:3020/${directory}/${filename}`;
    }

    static getURLMultiDir(directory: string, filename: string) {
        return `${SERVER_ADDRESS}:3020/${directory}/${filename}`;
    }

    static getPath(fileUrl: string) {
        return `./uploads${decodeURIComponent(parse(fileUrl).pathname)}`;
    }

    static removeFile(fileURL: string) {
        if (fileURL) {
            const path = this.getPath(fileURL);
            fs.unlink(path, (err: Error) => {
                if (err) {
                    console.error(err);
                } else {
                    this.uploadPathModel.findOneAndDelete({ url: fileURL }).exec()
                        .then(() => {
                            console.log(`Deleted ${fileURL}`);
                        })
                        .catch(err => {
                            console.error(`Error delete ${fileURL}: ${err.message}`);
                        });
                }
            });
        }
    }

    static imageCompress = async (file: any, quality: number): Promise<any> => {
        await sharp(file.path)
            .toFormat("jpeg")
            .jpeg({
                quality,
            })
            .toBuffer()
            .then((data) => {
                return fs.writeFileSync(file.path, data);
            });
    }

    static removeFileURL(fileURL: string) {
        if (fileURL) {
            const filePath = this.getPath(fileURL);
            fs.unlink(filePath, (err1: Error) => {
                if (err1) {
                    console.error(err1);
                } else {
                    this.uploadPathModel
                        .findOneAndDelete({ url: fileURL })
                        .exec()
                        .then(() => {
                            console.log(`Deleted ${fileURL}`);
                        })
                        .catch(err2 => {
                            console.error(
                                `Error delete ${fileURL}: ${err2.message}`,
                            );
                        });
                }
            });
        }
    }

    static imageUpload: MulterOptions = {
        storage: multer.diskStorage({
            destination: `./uploads/${EUploadFolder.IMAGE}`,
            filename: async (req: Express.Request, file: Express.Multer.File, cb) => {
                const safeName = StringTool.normalizeFileName(file.originalname);
                const filename = `${file.fieldname}-${Date.now()}-${safeName}`;
                if (!UploadTool.isImageFile(file.mimetype)) {
                    return cb(new BackendErrorDTO(403, "IMAGE_FILE_TYPE_ONLY"), filename);
                }
                const url = UploadTool.getURL(EUploadFolder.IMAGE, filename);
                const path = UploadTool.getPath(url);
                await UploadTool.createUploadPath(EUploadFolder.IMAGE, url, path);
                cb(null, filename);
            },
        }),
    };

    static documentUpload: MulterOptions = {
        storage: multer.diskStorage({
            destination: `./uploads/${EUploadFolder.DOCUMENT}`,
            filename: async (req: Express.Request, file: Express.Multer.File, cb) => {
                const match = [
                    "application/pdf",
                    "image/img",
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/msword",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                ];
                const safeName = StringTool.normalizeFileName(file.originalname);
                const filename = `${file.fieldname}-${Date.now()}-${safeName}`;
                if (!match.includes(file.mimetype)) {
                    return cb(new BackendErrorDTO(403, "DOCUMENT_FILE_TYPE_ONLY"), filename);
                }
                const url = UploadTool.getURL(EUploadFolder.DOCUMENT, filename);
                const path = UploadTool.getPath(url);
                await UploadTool.createUploadPath(EUploadFolder.DOCUMENT, url, path);
                cb(null, filename);
            },
        }),
    };

    static dataUpload: MulterOptions = {
        storage: multer.diskStorage({
            destination: `./uploads/${EUploadFolder.DATA}`,
            filename: async (req: Express.Request, file: Express.Multer.File, cb) => {
                const safeName = StringTool.normalizeFileName(file.originalname);
                const filename = `${file.fieldname}-${Date.now()}-${safeName}`;
                const url = UploadTool.getURL(EUploadFolder.DATA, filename);
                const path = UploadTool.getPath(url);
                await UploadTool.createUploadPath(EUploadFolder.DATA, url, path);
                cb(null, filename);
            },
        }),
    };

    static async createZipArchive(
        archiveName: string,
        relativeFilePaths: string[],
    ): Promise<{
        absolutePath: string;
        url: string;
    }> {
        const archiveZipName = `${archiveName}.zip`;
        const archivePath = path.join(
            __dirname,
            `../../uploads/${EUploadFolder.IMAGE}/${archiveZipName}`,
        );
        const archiveURL = UploadTool.getURL(
            EUploadFolder.IMAGE,
            archiveZipName,
        );
        const archive = archiver("zip", {
            zlib: { level: 9 },
        });
        const output = fs.createWriteStream(archivePath);
        archive.pipe(output);
        const p = new Promise<{
            absolutePath: string;
            url: string;
        }>(async (resolve1, reject1) => {
            // Handle output events
            output.on("close", () => {
                console.log(archive.pointer(), "total bytes");
                resolve1({
                    absolutePath: archivePath,
                    url: archiveURL,
                });
            });
            // Handle archive events
            archive.on("error", err => {
                reject1(err);
            });
            await bluebird.Promise.map(relativeFilePaths, async filePath => {
                const filename = path.basename(filePath);
                const stream = fs.createReadStream(filePath);
                archive.append(stream, { name: filename });
                return new Promise((resolve2, reject2) => {
                    stream.on("error", err => {
                        reject2(err);
                    });
                    stream.on("close", () => {
                        resolve2();
                    });
                });
            }).catch(err => {
                reject1(err);
            });
            archive.finalize();
        }).catch(err => {
            UploadTool.removeFileURL(
                UploadTool.getURL(
                    EUploadFolder.IMAGE,
                    path.basename(archivePath),
                ),
            );
            throw err;
        });
        return p;
    }
}
