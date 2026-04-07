# Kế hoạch Triển khai: Hệ thống Quản lý Thư viện

## Tổng quan

Triển khai hệ thống quản lý thư viện với 6 module chính: xác thực (mod-auth), quản lý độc giả (mod-reader), quản lý sách (mod-book), mượn/trả/gia hạn (mod-borrow), thống kê báo cáo (mod-report), và quét mã vạch (mod-scanner - optional). Sử dụng SQLite làm cơ sở dữ liệu thông qua better-sqlite3 (raw SQL, không ORM).

## Tasks

- [x] 1. Thiết lập cấu trúc dự án và cơ sở dữ liệu
  - [x] 1.1 Khởi tạo dự án TypeScript với cấu hình cần thiết
    - Tạo package.json với dependencies: better-sqlite3, express, bcrypt, jest, fast-check
    - Cấu hình tsconfig.json
    - _Yêu cầu: Cơ sở hạ tầng dự án_

  - [x] 1.2 Tạo SQLite database schema với better-sqlite3
    - Viết file khởi tạo database với các câu lệnh CREATE TABLE: DocGia, Sach, PhieuMuon, TaiKhoan
    - Định nghĩa CHECK constraints cho enum fields (TinhTrangSach, TrangThaiPhieu, VaiTro, TrangThaiTaiKhoan)
    - Tạo indexes cho tìm kiếm và foreign keys
    - Bật PRAGMA foreign_keys = ON và journal_mode = WAL
    - _Yêu cầu: Mô hình dữ liệu trong design.md_

  - [x] 1.3 Tạo các interface TypeScript cho entities và DTOs
    - Interface: Sach, DocGia, PhieuMuon, TaiKhoan
    - DTO: SachDTO, DocGiaDTO, PhieuMuonDTO, LoginResult
    - _Yêu cầu: Lớp thực thể trong design.md_

  - [x] 1.4 Migration: Gỡ bỏ Prisma và cài đặt better-sqlite3
    - Gỡ dependencies: @prisma/client, prisma
    - Cài đặt dependencies: better-sqlite3, @types/better-sqlite3
    - Xóa thư mục prisma/ và file prisma/schema.prisma
    - Xóa scripts prisma:generate, prisma:migrate, prisma:studio trong package.json
    - Cập nhật src/types/index.ts: thay thế import từ @prisma/client bằng enum tự định nghĩa
    - _Yêu cầu: Chuyển đổi persistence layer_

- [x] 2. Triển khai mod-auth: Xác thực và phân quyền
  - [x] 2.1 Implement TaiKhoanController với better-sqlite3
    - Refactor TaiKhoanController: thay PrismaClient bằng better-sqlite3 Database instance
    - dangNhap(tenDangNhap, matKhau): sử dụng raw SQL SELECT để kiểm tra tài khoản, mật khẩu, trạng thái
    - dangXuat(maTaiKhoan): xử lý đăng xuất
    - kiemTraQuyen(maTaiKhoan, quyen): sử dụng raw SQL SELECT để kiểm tra quyền theo vai trò
    - _Yêu cầu: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 2.2 Viết property test cho validation đăng nhập
    - **Property 13: Validation đăng nhập trả về kết quả chính xác**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

- [x] 3. Checkpoint - Đảm bảo module xác thực hoạt động
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

- [ ] 4. Triển khai mod-reader: Quản lý độc giả
  - [x] 4.1 Implement DocGiaController với better-sqlite3
    - Refactor DocGiaController: thay PrismaClient bằng better-sqlite3 Database instance
    - createMember(data): sử dụng INSERT INTO DocGia để tạo độc giả mới với mã tự động sinh
    - updateMember(maDocGia, data): sử dụng UPDATE DocGia SET để cập nhật thông tin
    - deleteMember(maDocGia): sử dụng DELETE FROM DocGia với kiểm tra ràng buộc
    - hasActiveLoans(maDocGia): sử dụng SELECT COUNT(*) FROM PhieuMuon để kiểm tra phiếu mượn chưa trả
    - _Yêu cầu: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 4.2 Viết property test cho xóa độc giả
    - **Property 7: Xóa độc giả tuân thủ ràng buộc nghiệp vụ**
    - **Validates: Requirements 6.3, 6.4, 6.5**

- [ ] 5. Triển khai mod-book: Quản lý sách
  - [x] 5.1 Implement SachController với better-sqlite3
    - createBook(data): sử dụng INSERT INTO Sach để tạo sách mới với tinhTrang = SAN_SANG
    - updateBook(maSach, data): sử dụng UPDATE Sach SET để cập nhật thông tin
    - deleteBook(maSach): sử dụng DELETE FROM Sach với kiểm tra ràng buộc
    - isBookOnLoan(maSach): sử dụng SELECT để kiểm tra sách đang được mượn
    - _Yêu cầu: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 5.2 Viết property test cho tạo sách mới
    - **Property 9: Sách mới có trạng thái mặc định đúng**
    - **Validates: Requirements 7.1**

  - [ ]* 5.3 Viết property test cho xóa sách
    - **Property 8: Xóa sách tuân thủ ràng buộc nghiệp vụ**
    - **Validates: Requirements 7.3, 7.4, 7.5**

  - [x] 5.4 Implement TraCuuHeThong (Search Controller) với better-sqlite3
    - searchByTitle(keyword): sử dụng SELECT ... WHERE tieuDe LIKE ? để tìm sách theo tiêu đề
    - searchByAuthor(keyword): sử dụng SELECT ... WHERE tacGia LIKE ? để tìm sách theo tác giả
    - searchByCode(maSach): sử dụng SELECT ... WHERE maSach = ? để tìm sách theo mã
    - _Yêu cầu: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 5.5 Viết property test cho tìm kiếm sách
    - **Property 6: Tìm kiếm sách trả về kết quả chính xác**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 6. Checkpoint - Đảm bảo module độc giả và sách hoạt động
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

- [ ] 7. Triển khai mod-borrow: Mượn sách
  - [x] 7.1 Implement validation functions cho mượn sách với better-sqlite3
    - validateMember(maDocGia): sử dụng SELECT để kiểm tra độc giả tồn tại và thẻ còn hạn
    - checkBookAvailability(maSach): sử dụng SELECT để kiểm tra sách tồn tại và tinhTrang = SAN_SANG
    - _Yêu cầu: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 7.2 Viết property test cho validation độc giả và sách
    - **Property 1: Validation độc giả và sách trả về kết quả chính xác**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

  - [x] 7.3 Implement createLoan trong PhieuMuonController với better-sqlite3
    - Sử dụng transaction (db.transaction) để tạo phiếu mượn và cập nhật trạng thái sách
    - INSERT INTO PhieuMuon với ngayMuon = ngày hiện tại, hanTra = ngayMuon + 14 ngày
    - UPDATE Sach SET tinhTrang = 'DA_MUON' WHERE maSach = ?
    - Trạng thái phiếu = DANG_MUON
    - _Yêu cầu: 1.7, 1.8, 1.9, 1.10_

  - [ ]* 7.4 Viết property test cho tạo phiếu mượn
    - **Property 2: Tạo phiếu mượn cập nhật đúng trạng thái**
    - **Validates: Requirements 1.5, 1.6**

- [ ] 8. Triển khai mod-borrow: Trả sách
  - [x] 8.1 Implement findLoan trong PhieuMuonController với better-sqlite3
    - Sử dụng SELECT để tìm phiếu mượn theo mã phiếu hoặc mã sách
    - _Yêu cầu: 2.1, 2.2, 2.3_

  - [ ]* 8.2 Viết property test cho tìm phiếu mượn
    - **Property 12: Tìm phiếu mượn theo mã phiếu hoặc mã sách**
    - **Validates: Requirements 2.1, 4.1**

  - [x] 8.3 Implement calculateFine trong PhieuMuonController
    - Nếu ngayTraThucTe > hanTra: tienPhat = soNgayQuaHan * 5000
    - Nếu ngayTraThucTe <= hanTra: tienPhat = 0
    - _Yêu cầu: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 8.4 Viết property test cho tính tiền phạt
    - **Property 4: Tính tiền phạt đúng công thức**
    - **Validates: Requirements 3.1, 3.3**

  - [x] 8.5 Implement returnBook trong PhieuMuonController với better-sqlite3
    - Sử dụng transaction (db.transaction) để cập nhật đồng thời phiếu mượn và sách
    - UPDATE Sach SET tinhTrang = 'SAN_SANG' WHERE maSach = ?
    - UPDATE PhieuMuon SET trangThai = 'DA_TRA', ngayTraThucTe = ?, tienPhat = ? WHERE maPhieu = ?
    - _Yêu cầu: 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 8.6 Viết property test cho trả sách
    - **Property 3: Trả sách cập nhật đúng trạng thái**
    - **Validates: Requirements 2.4, 2.5**

- [ ] 9. Triển khai mod-borrow: Gia hạn
  - [x] 9.1 Implement extendLoan trong PhieuMuonController với better-sqlite3
    - Sử dụng SELECT để kiểm tra phiếu mượn tồn tại và trangThai = DANG_MUON
    - UPDATE PhieuMuon SET hanTra = datetime(hanTra, '+7 days') WHERE maPhieu = ?
    - _Yêu cầu: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 9.2 Viết property test cho gia hạn
    - **Property 5: Gia hạn cập nhật đúng hạn trả**
    - **Validates: Requirements 4.3**

- [x] 10. Checkpoint - Đảm bảo module mượn/trả/gia hạn hoạt động
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

- [ ] 11. Triển khai mod-report: Thống kê và báo cáo
  - [x] 11.1 Implement BaoCaoController với better-sqlite3
    - getOverdueLoans(): sử dụng SELECT ... WHERE trangThai = 'DANG_MUON' AND hanTra < datetime('now')
    - getInventoryStatus(): sử dụng SELECT tinhTrang, COUNT(*) FROM Sach GROUP BY tinhTrang
    - _Yêu cầu: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 11.2 Viết property test cho báo cáo sách quá hạn
    - **Property 10: Báo cáo sách quá hạn chính xác**
    - **Validates: Requirements 8.1**

  - [ ]* 11.3 Viết property test cho báo cáo tình trạng kho
    - **Property 11: Báo cáo tình trạng kho chính xác**
    - **Validates: Requirements 8.2**

- [ ] 12. Tích hợp và kết nối các module
  - [x] 12.1 Tạo API routes cho tất cả controllers
    - Routes cho TaiKhoanController: /auth/login, /auth/logout
    - Routes cho DocGiaController: /readers (CRUD)
    - Routes cho SachController: /books (CRUD + search)
    - Routes cho PhieuMuonController: /loans (mượn/trả/gia hạn)
    - Routes cho BaoCaoController: /reports
    - _Yêu cầu: Tất cả UC_

  - [x] 12.2 Implement middleware xác thực và phân quyền
    - Kiểm tra token/session cho mỗi request
    - Kiểm tra quyền truy cập theo vai trò
    - _Yêu cầu: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 12.3 Viết integration tests cho các luồng chính
    - Test luồng mượn sách end-to-end
    - Test luồng trả sách end-to-end
    - Test luồng gia hạn end-to-end
    - _Yêu cầu: UC01, UC02, UC03_

- [x] 13. Checkpoint cuối - Đảm bảo toàn bộ hệ thống hoạt động
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

- [ ] 14. (ADDON - Optional) Triển khai mod-scanner: Quét mã vạch
  - [ ]* 14.1 Implement BarcodeScanner interface
    - Nhận dữ liệu từ thiết bị quét
    - Xác định loại mã (sách/độc giả)
    - Tự động điền vào trường nhập liệu
    - _Yêu cầu: 9.1, 9.2, 9.3, 9.4_

## Ghi chú

- GUI tasks được tách riêng tại: `tasks_gui.md`

- Tasks đánh dấu `*` là optional và có thể bỏ qua để MVP nhanh hơn
- Mỗi task tham chiếu đến yêu cầu cụ thể để đảm bảo traceability
- Checkpoints đảm bảo validation từng giai đoạn
- Property tests kiểm tra 13 correctness properties từ design document
- UC08 (Quét mã vạch) là ADDON, có thể triển khai sau
- **Migration note**: Task 1.4 phải hoàn thành trước khi thực hiện task 1.2 và 2.1 (chuyển đổi từ Prisma sang better-sqlite3)
