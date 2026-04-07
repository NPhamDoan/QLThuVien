// ==================== Enums ====================

export enum TinhTrangSach {
  SAN_SANG = "SAN_SANG",
  DA_MUON = "DA_MUON",
  BAO_TRI = "BAO_TRI",
  MAT = "MAT",
}

export enum TrangThaiPhieu {
  DANG_MUON = "DANG_MUON",
  DA_TRA = "DA_TRA",
}

export enum VaiTro {
  THU_THU = "THU_THU",
  QUAN_TRI_VIEN = "QUAN_TRI_VIEN",
}

export enum TrangThaiTaiKhoan {
  HOAT_DONG = "HOAT_DONG",
  BI_KHOA = "BI_KHOA",
}

export enum LoginError {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  WRONG_PASSWORD = "WRONG_PASSWORD",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
}

// ==================== Entity Interfaces ====================

export interface Sach {
  maSach: string;
  tieuDe: string;
  tacGia: string;
  tinhTrang: TinhTrangSach;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocGia {
  maDocGia: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  ngayHetHan: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhieuMuon {
  maPhieu: string;
  maDocGia: string;
  maSach: string;
  ngayMuon: Date;
  hanTra: Date;
  ngayTraThucTe: Date | null;
  trangThai: TrangThaiPhieu;
  tienPhat: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaiKhoan {
  maTaiKhoan: string;
  tenDangNhap: string;
  matKhau: string;
  vaiTro: VaiTro;
  trangThai: TrangThaiTaiKhoan;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== DTOs ====================

export interface SachDTO {
  maSach: string;
  tieuDe: string;
  tacGia: string;
  tinhTrang: TinhTrangSach;
}

export interface DocGiaDTO {
  maDocGia: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  ngayHetHan: Date;
}

export interface PhieuMuonDTO {
  maPhieu: string;
  maDocGia: string;
  maSach: string;
  ngayMuon: Date;
  hanTra: Date;
  ngayTraThucTe: Date | null;
  trangThai: TrangThaiPhieu;
  tienPhat: number;
  tenDocGia?: string;
  tenSach?: string;
}

export interface LoginResult {
  success: boolean;
  taiKhoan?: TaiKhoan;
  error?: LoginError;
}

// ==================== Input Types ====================

export interface CreateSachInput {
  tieuDe: string;
  tacGia: string;
}

export interface UpdateSachInput {
  tieuDe?: string;
  tacGia?: string;
  tinhTrang?: TinhTrangSach;
}

export interface CreateDocGiaInput {
  hoTen: string;
  email: string;
  soDienThoai: string;
  ngayHetHan: Date;
}

export interface UpdateDocGiaInput {
  hoTen?: string;
  email?: string;
  soDienThoai?: string;
  ngayHetHan?: Date;
}

export interface CreatePhieuMuonInput {
  maDocGia: string;
  maSach: string;
}

// ==================== Result Types ====================

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface BookStatus {
  available: boolean;
  tinhTrang: TinhTrangSach;
  message?: string;
}

export interface DeleteResult {
  success: boolean;
  message?: string;
}

export interface ReturnResult {
  success: boolean;
  tienPhat: number;
  ngayTraThucTe: Date;
  message?: string;
}

export interface InventoryReport {
  sanSang: number;
  daMuon: number;
  baoTri: number;
  mat: number;
  tongCong: number;
}
