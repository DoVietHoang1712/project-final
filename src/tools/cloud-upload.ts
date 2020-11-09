import * as Cloud from "@google-cloud/storage";
import * as path from "path";

const serviceKey = path.join(__dirname, "../../../../hoangdo/Desktop/key.json");

const {Storage} = Cloud;
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: "warm-airline-294811",
});

const gc = storage.bucket("base-upload");
