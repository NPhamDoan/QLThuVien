import { initializeDatabase } from './database';
import bcrypt from 'bcrypt';

async function seed() {
  const db = initializeDatabase('./dev.db');

  // Clear existing data (order matters for FK)
  db.exec('DELETE FROM PhieuMuon');
  db.exec('DELETE FROM Sach');
  db.exec('DELETE FROM DocGia');
  db.exec('DELETE FROM TaiKhoan');

  // === Tài khoản ===
  const hashedPass = await bcrypt.hash('123456', 10);

  db.prepare(`
    INSERT INTO TaiKhoan (maTaiKhoan, tenDangNhap, matKhau, vaiTro, trangThai)
    VALUES (?, ?, ?, ?, ?)
  `).run('TK001', 'thuthu', hashedPass, 'THU_THU', 'HOAT_DONG');

  db.prepare(`
    INSERT INTO TaiKhoan (maTaiKhoan, tenDangNhap, matKhau, vaiTro, trangThai)
    VALUES (?, ?, ?, ?, ?)
  `).run('TK002', 'admin', hashedPass, 'QUAN_TRI_VIEN', 'HOAT_DONG');

  // === Độc giả ===
  const readers = [
    ['DG001', 'Nguyen Van An', 'an@email.com', '0901000001', '2027-12-31'],
    ['DG002', 'Tran Thi Binh', 'binh@email.com', '0901000002', '2027-06-30'],
    ['DG003', 'Le Van Cuong', 'cuong@email.com', '0901000003', '2026-03-15'],
    ['DG004', 'Pham Thi Dung', 'dung@email.com', '0901000004', '2025-01-01'],
    ['DG005', 'Hoang Van Em', 'em@email.com', '0901000005', '2027-09-30'],
    ['DG006', 'Vo Thi Phuong', 'phuong@email.com', '0901000006', '2027-08-15'],
    ['DG007', 'Dang Van Giang', 'giang@email.com', '0901000007', '2027-11-20'],
    ['DG008', 'Bui Thi Hanh', 'hanh@email.com', '0901000008', '2026-07-01'],
    ['DG009', 'Ngo Van Ich', 'ich@email.com', '0901000009', '2027-04-10'],
    ['DG010', 'Do Thi Kim', 'kim@email.com', '0901000010', '2027-02-28'],
    ['DG011', 'Ly Van Lam', 'lam@email.com', '0901000011', '2026-12-31'],
    ['DG012', 'Truong Thi Mai', 'mai@email.com', '0901000012', '2027-05-15'],
    ['DG013', 'Dinh Van Nam', 'nam@email.com', '0901000013', '2027-10-01'],
    ['DG014', 'Cao Thi Oanh', 'oanh@email.com', '0901000014', '2026-09-20'],
    ['DG015', 'Duong Van Phuc', 'phuc@email.com', '0901000015', '2027-01-15'],
    ['DG016', 'Ha Thi Quyen', 'quyen@email.com', '0901000016', '2027-07-30'],
    ['DG017', 'Vu Van Rong', 'rong@email.com', '0901000017', '2026-06-01'],
    ['DG018', 'Mai Thi Son', 'son@email.com', '0901000018', '2027-03-25'],
    ['DG019', 'Tang Van Tai', 'tai@email.com', '0901000019', '2025-06-01'],
    ['DG020', 'Luu Thi Uyen', 'uyen@email.com', '0901000020', '2027-08-08'],
    ['DG021', 'Chau Van Vinh', 'vinh@email.com', '0901000021', '2026-11-11'],
    ['DG022', 'Trinh Thi Xuan', 'xuan@email.com', '0901000022', '2027-12-25'],
  ];

  const insertReader = db.prepare(`
    INSERT INTO DocGia (maDocGia, hoTen, email, soDienThoai, ngayHetHan)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const r of readers) insertReader.run(...r);

  // === Sách ===
  const books = [
    ['S001', 'Lập trình TypeScript', 'Nguyen Minh Tuan', 'SAN_SANG'],
    ['S002', 'Cấu trúc dữ liệu và giải thuật', 'Tran Quoc Bao', 'SAN_SANG'],
    ['S003', 'Nhập môn Machine Learning', 'Le Hoang Nam', 'SAN_SANG'],
    ['S004', 'Thiết kế hệ thống phần mềm', 'Pham Van Hoa', 'DA_MUON'],
    ['S005', 'Lập trình Web với React', 'Vo Thi Lan', 'SAN_SANG'],
    ['S006', 'Cơ sở dữ liệu nâng cao', 'Nguyen Duc Thanh', 'SAN_SANG'],
    ['S007', 'Mạng máy tính', 'Tran Van Hung', 'BAO_TRI'],
    ['S008', 'Trí tuệ nhân tạo', 'Le Minh Duc', 'SAN_SANG'],
    ['S009', 'Hệ điều hành Linux', 'Pham Quoc Viet', 'MAT'],
    ['S010', 'Python cho Data Science', 'Hoang Thi Mai', 'DA_MUON'],
    ['S011', 'Java Spring Boot', 'Nguyen Van Tung', 'SAN_SANG'],
    ['S012', 'Docker và Kubernetes', 'Tran Minh Quang', 'SAN_SANG'],
    ['S013', 'Lập trình C++ hiện đại', 'Le Thi Hoa', 'SAN_SANG'],
    ['S014', 'Angular từ cơ bản đến nâng cao', 'Pham Duc Long', 'SAN_SANG'],
    ['S015', 'Node.js và Express', 'Vo Van Thanh', 'DA_MUON'],
    ['S016', 'Toán rời rạc', 'Nguyen Thi Nga', 'SAN_SANG'],
    ['S017', 'Xử lý ảnh số', 'Tran Van Dat', 'BAO_TRI'],
    ['S018', 'Lập trình di động với Flutter', 'Le Van Hai', 'SAN_SANG'],
    ['S019', 'An toàn thông tin', 'Pham Thi Loan', 'SAN_SANG'],
    ['S020', 'Kiến trúc vi dịch vụ', 'Hoang Van Duc', 'SAN_SANG'],
    ['S021', 'Phân tích dữ liệu với R', 'Vo Thi Huong', 'SAN_SANG'],
    ['S022', 'Blockchain và ứng dụng', 'Nguyen Quoc Anh', 'MAT'],
    ['S023', 'DevOps thực hành', 'Tran Thi Thao', 'SAN_SANG'],
    ['S024', 'Lập trình game với Unity', 'Le Duc Minh', 'SAN_SANG'],
    ['S025', 'SQL Server nâng cao', 'Pham Van Khanh', 'SAN_SANG'],
  ];

  const insertBook = db.prepare(`
    INSERT INTO Sach (maSach, tieuDe, tacGia, tinhTrang)
    VALUES (?, ?, ?, ?)
  `);
  for (const b of books) insertBook.run(...b);

  // === Phiếu mượn ===
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  // Phiếu đang mượn - quá hạn (S004)
  const pastDue1 = new Date(today);
  pastDue1.setDate(pastDue1.getDate() - 20);
  const pastDue1Han = new Date(pastDue1);
  pastDue1Han.setDate(pastDue1Han.getDate() + 14);
  db.prepare(`
    INSERT INTO PhieuMuon (maPhieu, maDocGia, maSach, ngayMuon, hanTra, trangThai)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('PM001', 'DG001', 'S004', fmt(pastDue1), fmt(pastDue1Han), 'DANG_MUON');

  // Phiếu đang mượn - quá hạn (S010)
  const pastDue2 = new Date(today);
  pastDue2.setDate(pastDue2.getDate() - 30);
  const pastDue2Han = new Date(pastDue2);
  pastDue2Han.setDate(pastDue2Han.getDate() + 14);
  db.prepare(`
    INSERT INTO PhieuMuon (maPhieu, maDocGia, maSach, ngayMuon, hanTra, trangThai)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('PM002', 'DG002', 'S010', fmt(pastDue2), fmt(pastDue2Han), 'DANG_MUON');

  // Phiếu đã trả
  db.prepare(`
    INSERT INTO PhieuMuon (maPhieu, maDocGia, maSach, ngayMuon, hanTra, trangThai, ngayTraThucTe, tienPhat)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('PM003', 'DG003', 'S001', '2025-02-01', '2025-02-15', 'DA_TRA', '2025-02-14', 0);

  // Phiếu đã trả - có phạt
  db.prepare(`
    INSERT INTO PhieuMuon (maPhieu, maDocGia, maSach, ngayMuon, hanTra, trangThai, ngayTraThucTe, tienPhat)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('PM004', 'DG005', 'S002', '2025-01-10', '2025-01-24', 'DA_TRA', '2025-01-27', 15000);

  console.log('Seed data created successfully!');
  console.log('');
  console.log('Tài khoản đăng nhập:');
  console.log('  Thủ thư:       thuthu / 123456');
  console.log('  Quản trị viên: admin / 123456');
  console.log('');
  console.log('Độc giả: DG001 - DG022 (22 người, 2+ pages)');
  console.log('Sách: S001 - S025 (25 cuốn, 2+ pages)');
  console.log('Phiếu mượn: PM001-PM004');

  db.close();
}

seed().catch(console.error);
