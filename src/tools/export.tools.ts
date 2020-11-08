import * as XLSX from "xlsx";
import { SERVER_ADDRESS } from "../config/secrets";

export class ExportTool {
    static async exportExcel(data: any[], sheetName: string) {
        const wb = XLSX.utils.book_new();
        wb.SheetNames.push(sheetName);
        const ws = XLSX.utils.json_to_sheet(data);
        const cols = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 },
            { wch: 30 },
        ];
        ws["!cols"] = cols;
        wb.Sheets[sheetName] = ws;
        const fileName = `${sheetName}_${Date.now()}.xlsx`;
        const wopts = { bookType: "xlsx", bookSST: false, type: "array" };
        XLSX.writeFile(wb, `./uploads/data/${fileName}`);
        return {
            url: `${SERVER_ADDRESS}/data/${fileName}`,
        };
    }

    static async exportExcelAdvance(data: any[], sheetName: string, query: string[]) {
        const wb = XLSX.utils.book_new();
        wb.SheetNames.push(sheetName);
        const newData = data.map(value => {
            const c: any[] = [];
            query.forEach(gt => {
                c.push((value as any)[gt]);
            });
            return c;
        });
        const res = newData.map(val => {
            const test = Object.create({});
            let i = 0;
            for (const va of val) {
                (test as any)[query[i]] = va;
                i++;
            }
            return test;
        });
        const ws = XLSX.utils.json_to_sheet(res);
        const cols = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 },
            { wch: 30 },
        ];
        ws["!cols"] = cols;
        wb.Sheets[sheetName] = ws;
        const fileName = `${sheetName}.xlsx`;
        const wopts = { bookType: "xlsx", bookSST: false, type: "array" };
        XLSX.writeFile(wb, `./uploads/data/${fileName}`);
        return {
            url: `${SERVER_ADDRESS}/data/${fileName}`,
        };
    }
}
