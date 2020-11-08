import { Logger } from "@nestjs/common";
import * as OneSignal from "onesignal-node";
import { ENotificationType } from "./constants.js";
import { ONE_SIGNAL_API_KEY, ONE_SIGNAL_APP_ID } from "./secrets.js";

export interface OneSignalData {
    type: ENotificationType;
    [field: string]: any;
}

export interface OneSignalOption {
    data: OneSignalData;
    [options: string]: any;
}

class OneSignalNotification {
    private readonly limitEntries: number = 2000;
    private readonly logger: Logger = new Logger("OneSignal");

    private appId: string;
    private apiKey: string;
    private client: OneSignal.Client;

    constructor(appId: string, apiKey: string) {
        this.appId = appId;
        this.apiKey = apiKey;
        this.client = new OneSignal.Client(this.appId, this.apiKey);
    }

    async subscribe(oneSignalID: string) {
        try {
            return this.client.editDevice(oneSignalID, { notification_types: 1 });
        } catch (err) {
            console.error(JSON.stringify(err));
        }
    }

    async unsubscribe(oneSignalID: string) {
        try {
            return this.client.editDevice(oneSignalID, { notification_types: -2 });
        } catch (err) {
            console.error(JSON.stringify(err));
        }
    }

    sendPeople(
        title: string,
        content: string,
        people: string[],
        notificationOptions: OneSignalOption,
        bigPictureUrl?: string,
    ): void {
        try {
            while (people.length > 0) {
                const block = people.splice(0, this.limitEntries);
                const notification = {
                    headings: { en: title },
                    contents: { en: content },
                    include_player_ids: block,
                    adm_big_picture: bigPictureUrl,
                    big_picture: bigPictureUrl,
                    chrome_web_image: bigPictureUrl,
                    chrome_big_picture: bigPictureUrl,
                    ...notificationOptions,
                };
                this.client.createNotification(notification).then(data => {
                    this.logger.log(data.body);
                }).catch(err => {
                    console.error(JSON.stringify(err));
                });
            }
        } catch (err) {
            this.logger.warn("OneSignal error sendPeople");
        }
    }

    sendAll(title: string, content: string, notificationOptions: OneSignalOption): void {
        try {
            const notification = {
                headings: { en: title },
                contents: { en: content },
                included_segments: ["Active Users", "Inactive Users"],
                ...notificationOptions,
            };
            this.client.createNotification(notification).then(data => {
                this.logger.log(data.body);
            }).catch(err => {
                console.error(JSON.stringify(err));
            });
        } catch (err) {
            this.logger.warn("OneSignal error sendAll");
        }
    }

    async setNoti(
        title: string,
        content: string,
        people: string[],
        notificationOptions: OneSignalOption) {
        try {
            while (people.length > 0) {
                const block = people.splice(0, this.limitEntries);
                const notification = {
                    headings: { en: title },
                    contents: { en: content },
                    include_player_ids: block,
                    ...notificationOptions,
                };
                return this.client.createNotification(notification).then(data => {
                    this.logger.log(data.body);
                    return data;
                }).catch(err => {
                    console.error(JSON.stringify(err));
                });
            }
        } catch (err) {
            this.logger.warn("OneSignal error sendPeople");
        }
    }

    sendAllV2(title: string, content: string, notificationOptions: OneSignalOption) {
        try {
            const notification = {
                headings: { en: title },
                contents: { en: content },
                included_segments: ["Active Users", "Inactive Users"],
                ...notificationOptions,
            };
            return this.client.createNotification(notification).then(data => {
                this.logger.log(data.body);
                return data;
            }).catch(err => {
                console.error(JSON.stringify(err));
            });
        } catch (err) {
            this.logger.warn("OneSignal error sendAll");
        }
    }

    cancelNoti(notiID: string): void {
        try {
            this.client.cancelNotification(notiID);
        } catch (err) {

            this.logger.warn("OneSignal error cancle noti");
        }
    }
}

export const OneSignalService = new OneSignalNotification(ONE_SIGNAL_APP_ID, ONE_SIGNAL_API_KEY);
