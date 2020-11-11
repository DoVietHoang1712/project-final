import { PROJECT_NAME, AV_BACKGROUND_2 } from "../config/secrets";

export interface PugResponse {
    projectName: string;
    headerBackground: string;
    [field: string]: any;
}

export class PugTools {
    static res(obj: object): PugResponse {
        return {
            projectName: PROJECT_NAME,
            headerBackground: AV_BACKGROUND_2,
            ...obj,
        };
    }
}
