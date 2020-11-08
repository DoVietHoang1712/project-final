export enum ESettingValueType {
    STRING = "string",
    BOOLEAN = "boolean",
    NUMBER = "number",
}

export enum ELoaiBangDiem {
    TOAN_KHOA,
    NAM_HOC,
    KY_HOC,
}

export enum ECapHanhChinh {
    CAP_1 = 1,
    CAP_2 = 2,
    CAP_3 = 3,
}

export enum ETrangThaiDuyetDon {
    CHUA_TIEP_NHAN = "CHUA_TIEP_NHAN",
    DA_TIEP_NHAN = "DA_TIEP_NHAN",
    DA_XU_LY = "DA_XU_LY",
    KHONG_XU_LY = "KHONG_XU_LY",
}

export enum ERole {
    DEVELOPER = -8,
    SINH_VIEN = 0,
    GIANG_VIEN = 1,
    PHU_HUYNH = 2,
    ADMIN = 3,
    GUEST = 4,
    ADMIN_PHONG_BAN = 5,
    CAN_BO_DAO_TAO = 6,
}

export enum EGioiTinh {
    NAM,
    NU,
    KHAC,
}

export enum EDonVi {
    KHOA,
    TRUONG,
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
    GIANG_VIEN,
    DICH_VU_MOT_CUA,
    LICH_THI,
    PHAN_HOI,
    KHAO_SAT,
    TIN_CHI,
    HANH_CHINH,
}

export enum ENotificationSentType {
    SYSTEM,
    ADMIN,
    GIANG_VIEN_TIN_CHI,
    GIANG_VIEN_CO_VAN,
}

export enum ETypeAppVersion {
    IOS,
    ANDROID,
}

export enum ELoaiPhanHoi {
    HOI_DAP,
    KY_THUAT,
}

export enum ETrangThaiPhanHoi {
    DA_TRA_LOI,
    CHUA_TRA_LOI,
}

export enum EKieuLapSuKien {
    NGAY,
    TUAN,
    THANG,
    NAM,
}

export enum ELoaiHocLieuSo {
    HOC_LIEU_TOAN_TRUONG = "HOC_LIEU_TOAN_TRUONG",
    HOC_LIEU_CUA_TOI = "HOC_LIEU_CUA_TOI",
}

export enum ETrangThaiDuyetHocLieuSo {
    DA_PHE_DUYET = "DA_PHE_DUYET",
    CHUA_PHE_DUYET = "CHUA_PHE_DUYET",
    DA_TU_CHOI = "DA_TU_CHOI",
}

export enum EKieuSuaSuKien {
    FROM_THIS,
    ALL,
}

export enum ETrieuChungSucKhoe {
    SOT,
    HO,
    KHO_THO,
    VIEM_PHOI,
    DAU_HONG,
    MET_MOI,
    KHAC,
}

export enum ETiepXuc {
    NGUOI_BENH_HOAC_NGHI_NHIEM,
    DI_TU_VUNG_DICH_VE,
    NGUOI_TU_VUNG_DICH,
}

export enum EMucDichKhaoSat {
    KHAO_SAT,
    BANG_DIEM,
}

export enum ERoleChat {
    ADMIN = "admin",
    MODERATOR = "moderator",
    USER = "user",
}

export enum EHinhThucCachLy {
    TAI_NHA,
    TAP_TRUNG,
}

export enum EYeuCauNhanThongTin {
    THONG_TIN_TUYEN_SINH,
}

export enum EValidateStatus {
    INVALIDATE = "1",
    VALIDATE = "2",
}

export enum ETrangThaiDonDangKiMonHoc {
    CHUA_DUYET = "CHUA_DUYET",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}

export enum ELoaiSuKien {
    CHUNG = "CHUNG",
    LICH_THI = "LICH_THI",
    CA_NHAN = "CA_NHAN",
    LICH_HOC_CDSV = "LICH_HOC_CDSV",
    LOP_TIN_CHI = "LOP_TIN_CHI",
    KHOA_NIEN_KHOA_LOP_HANH_CHINH = "KHOA_NIEN_KHOA_LOP_HANH_CHINH",
}

export enum EPhongBan {
    QUAN_TRI_THIET_BI = "Phòng Quản trị thiết bị",
    TO_CHUC_HANH_CHINH = "Phòng Tổ chức - Hành chính",
    THU_VIEN = "Thư viện",
    Y_TE = "Phòng Y tế",
    TAI_CHINH = "Phòng Tài chính",
    CHINH_TRI_SINH_VIEN = "Phòng Công tác chính trị và sinh viên",
    TRUYEN_THONG_QUAN_HE = "Phòng Truyền thông và Quan hệ đối ngoại",
    KE_HOACH_TAI_CHINH = "Phòng Kế hoạch tài chính",
    TRUNG_TAM_HO_TRO_SINH_VIEN = "Trung tâm Hỗ trợ Sinh viên",
}

export enum ELoaiNoiNgoaiTru {
    NOI_TRU = "Nội trú",
    NGOAI_TRU = "Ngoại trú",
}

export enum ENhaNoiTru {
    K13 = "K13",
    K14 = "K14",
    K15 = "K15",
}

export const PhongNoiTru = [
    { tang: "1", phong: ["101", "102", "103", "104", "105", "106", "107", "108", "109"] },
    { tang: "2", phong: ["201", "202", "203", "204", "205", "206", "207", "208", "209"] },
    { tang: "3", phong: ["301", "302", "303", "304", "305", "306", "307", "308", "309"] },
    { tang: "4", phong: ["401", "402", "403", "404", "405", "406", "407", "408", "409"] },
    { tang: "5", phong: ["501", "502", "503", "504", "505", "506", "507", "508", "509"] },
];

export const DEFAULT_CONCURRENCY_LOW = 16;
export const DEFAULT_CONCURRENCY_MEDIUM = 64;
export const DEFAULT_CONCURRENCY_HIGH = 256;

export enum ELoaiMonHoc {
    BAT_BUOC_CHUNG = "Bắt buộc chung",
    BAT_BUOC_CHUNG_NHOM_NGANH = "Bắt buộc chung nhóm ngành",
    BO_TRO_NGANH = "Bổ trợ ngành",
    CO_SO_NGANH = "Cơ sở ngành",
    CHUYEN_NGANH = "Chuyên ngành",
    THUC_TAP = "Thực tập",
}

export enum EToHopXetTuyen {
    A00 = "A00",
    A01 = "A01",
    D01 = "D01",
}

export enum EIsHidden {
    HIDDEN = "hidden",
    SHOW = "show",
}

export enum ETringDoSauDaiHoc {
    THAC_SY = "Thạc sỹ",
    TIEN_SY = "Tiến sỹ",
}

export enum EHinhThucHuongDan {
    DOC_LAP = "Độc lập",
    HD1 = "HD1",
    HD2 = "HD2",
}

export enum ELoaiHinhHuongDanSauDH {
    CHUYEN_DE = "Chuyên đề",
    LUAN_VAN = "Luận văn",
    LUAN_AN = "Luận án",
}

export enum ELoaiHinhHuongDanKhac {
    THI = "Hướng dẫn tham gia các cuộc thi sáng tạo và khởi nghiệp cấp quốc gia, quốc tế",
    DE_AN_TIENG_VIET = "Hướng dẫn đề án khởi nghiệp bằng tiếng Việt",
    DE_AN_TIENG_ANH = "Hướng dẫn đề án khởi nghiệp bằng tiếng Anh",
}

export enum ELoaiHinhHuongDanDH {
    KHOA_LUAN_TOT_NGHIEP = "Khóa luận tốt nghiệp",
    THUC_TAP_TOT_NGHIEP_VA_BAO_CAO = "Thực tập tốt nghiệp và Báo cáo",
    THUC_TAP_GIUA_KHOA = "Thực tập giữa khóa",
    CHUYEN_DE_CUOI_KHOA = "Chuyên đề cuối khóa",
    HUONG_DAN_TIEU_LUAN = "Hướng dẫn tiểu luận",
    DI_THUC_TE = "Đi thực tế",
}
