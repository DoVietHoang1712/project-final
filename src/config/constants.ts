
export enum ERole {
    DEVELOPER = -8,
    USER = 0,
    ADMIN = 1,
}

export enum EGioiTinh {
    NAM,
    NU,
    KHAC,
}

export enum ENotificationStatus {
    UNREAD,
    READ,
}

export enum ENotificationType {
    CHUNG,
    TIN_TUC,
    TAI_LIEU,
    TIN_NHAN,
}

export enum ENotificationSentType {
    SYSTEM,
    ADMIN,
}

export enum ETypeAppVersion {
    IOS,
    ANDROID,
}

export const DEFAULT_CONCURRENCY_LOW = 16;
export const DEFAULT_CONCURRENCY_MEDIUM = 64;
export const DEFAULT_CONCURRENCY_HIGH = 256;
