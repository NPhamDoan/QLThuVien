import Database from 'better-sqlite3';

let db: Database.Database | null = null;

export function initializeDatabase(dbPath: string = './dev.db'): Database.Database {
  db = new Database(dbPath);

  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS DocGia (
      maDocGia    TEXT PRIMARY KEY,
      hoTen       TEXT NOT NULL,
      email       TEXT NOT NULL UNIQUE,
      soDienThoai TEXT NOT NULL,
      ngayHetHan  TEXT NOT NULL,
      createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS Sach (
      maSach    TEXT PRIMARY KEY,
      tieuDe    TEXT NOT NULL,
      tacGia    TEXT NOT NULL,
      tinhTrang TEXT NOT NULL DEFAULT 'SAN_SANG' CHECK (tinhTrang IN ('SAN_SANG', 'DA_MUON', 'BAO_TRI', 'MAT')),
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS PhieuMuon (
      maPhieu       TEXT PRIMARY KEY,
      maDocGia      TEXT NOT NULL,
      maSach        TEXT NOT NULL,
      ngayMuon      TEXT NOT NULL,
      hanTra        TEXT NOT NULL,
      ngayTraThucTe TEXT,
      trangThai     TEXT NOT NULL DEFAULT 'DANG_MUON' CHECK (trangThai IN ('DANG_MUON', 'DA_TRA')),
      tienPhat      REAL NOT NULL DEFAULT 0,
      createdAt     TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt     TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (maDocGia) REFERENCES DocGia(maDocGia),
      FOREIGN KEY (maSach) REFERENCES Sach(maSach)
    );

    CREATE TABLE IF NOT EXISTS TaiKhoan (
      maTaiKhoan  TEXT PRIMARY KEY,
      tenDangNhap TEXT NOT NULL UNIQUE,
      matKhau     TEXT NOT NULL,
      vaiTro      TEXT NOT NULL DEFAULT 'THU_THU' CHECK (vaiTro IN ('THU_THU', 'QUAN_TRI_VIEN')),
      trangThai   TEXT NOT NULL DEFAULT 'HOAT_DONG' CHECK (trangThai IN ('HOAT_DONG', 'BI_KHOA')),
      createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_sach_tieuDe ON Sach(tieuDe);
    CREATE INDEX IF NOT EXISTS idx_sach_tacGia ON Sach(tacGia);
    CREATE INDEX IF NOT EXISTS idx_phieumuon_maDocGia ON PhieuMuon(maDocGia);
    CREATE INDEX IF NOT EXISTS idx_phieumuon_maSach ON PhieuMuon(maSach);
    CREATE INDEX IF NOT EXISTS idx_phieumuon_trangThai ON PhieuMuon(trangThai);
  `);

  return db;
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export type { Database };
