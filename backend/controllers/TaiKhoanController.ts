import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { LoginResult, LoginError, TaiKhoan, VaiTro, TrangThaiTaiKhoan } from '../types';

export class TaiKhoanController {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  async dangNhap(tenDangNhap: string, matKhau: string): Promise<LoginResult> {
    const row = this.db.prepare(
      'SELECT * FROM TaiKhoan WHERE tenDangNhap = ?'
    ).get(tenDangNhap) as Record<string, unknown> | undefined;

    if (!row) {
      return { success: false, error: LoginError.USER_NOT_FOUND };
    }

    const passwordMatch = await bcrypt.compare(matKhau, row.matKhau as string);
    if (!passwordMatch) {
      return { success: false, error: LoginError.WRONG_PASSWORD };
    }

    if (row.trangThai === TrangThaiTaiKhoan.BI_KHOA) {
      return { success: false, error: LoginError.ACCOUNT_LOCKED };
    }

    const taiKhoan: TaiKhoan = {
      maTaiKhoan: row.maTaiKhoan as string,
      tenDangNhap: row.tenDangNhap as string,
      matKhau: row.matKhau as string,
      vaiTro: row.vaiTro as VaiTro,
      trangThai: row.trangThai as TrangThaiTaiKhoan,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    };

    return { success: true, taiKhoan };
  }

  async dangXuat(_maTaiKhoan: string): Promise<void> {
    // No-op: session management handled at middleware level
  }

  kiemTraQuyen(maTaiKhoan: string, quyen: string): boolean {
    const row = this.db.prepare(
      'SELECT vaiTro FROM TaiKhoan WHERE maTaiKhoan = ?'
    ).get(maTaiKhoan) as { vaiTro: string } | undefined;

    if (!row) {
      return false;
    }

    return row.vaiTro === quyen;
  }
}
