import { EUploadFolder, UploadTool } from "src/tools/upload.tool";
import * as XLSX from "xlsx";
import { SERVER_ADDRESS } from "../config/secrets";

export class HandleExcelTool {
    static async exportTemplate() {
        return {
            url: `${SERVER_ADDRESS}/data/template.xlsx`,
        };
    }

    static async handleImport(file: Express.Multer.File) {
        const url = UploadTool.getURL(EUploadFolder.DATA, file.filename);
        const path = UploadTool.getPath(url);
        try {
            const res: any[] = [];
            const workbook = XLSX.readFile(path);
            UploadTool.removeFile(url);
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            for (const khaoSat of data) {
                console.log(khaoSat);
                res.push(
                    (khaoSat as any).cauTraLoi,
                );
            }
            return res;
        } catch (error) {
            console.log(error);
        }
    }
}
