# Kế hoạch Triển khai GUI: Hệ thống Quản lý Thư viện

## Tổng quan

Triển khai giao diện người dùng (GUI) cho hệ thống quản lý thư viện sử dụng React + TypeScript + Vite. Kết nối với backend API đã triển khai trong tasks.md (backend sử dụng SQLite + Prisma ORM).

## Tasks

- [x] 1. Khởi tạo dự án React và cấu hình routing
  - Tạo React app (Vite + React + TypeScript)
  - Cài đặt dependencies: react-router-dom, axios, antd hoặc MUI
  - Cấu hình routing cho các trang chính
  - _Yêu cầu: UI Layer trong design.md_

- [x] 2. Trang đăng nhập
  - Form nhập tên đăng nhập và mật khẩu
  - Gọi API /auth/login
  - Redirect theo vai trò (THU_THU / QUAN_TRI_VIEN)
  - Hiển thị lỗi: tài khoản không tồn tại, sai mật khẩu, bị khóa
  - _Yêu cầu: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 3. Layout chính và navigation
  - Sidebar/menu theo vai trò người dùng
  - Header với thông tin người dùng và nút đăng xuất
  - Protected routes (yêu cầu đăng nhập)
  - _Yêu cầu: 10.5_

- [x] 4. Trang mượn sách
  - Form nhập/quét mã độc giả → hiển thị thông tin độc giả
  - Form nhập/quét mã sách → hiển thị thông tin sách + trạng thái
  - Nút xác nhận mượn → gọi API tạo phiếu mượn
  - Hiển thị kết quả phiếu mượn
  - _Yêu cầu: 1.1 - 1.10_

- [x] 5. Trang trả sách
  - Form nhập mã phiếu/mã sách → hiển thị thông tin phiếu mượn
  - Hiển thị tiền phạt tự động (nếu quá hạn)
  - Nút xác nhận trả sách
  - Hiển thị kết quả trả sách
  - _Yêu cầu: 2.1 - 2.8, 3.1 - 3.4_

- [x] 6. Trang gia hạn mượn sách
  - Form nhập mã phiếu → hiển thị thông tin phiếu mượn
  - Nút gia hạn → hiển thị hạn trả mới
  - _Yêu cầu: 4.1 - 4.5_

- [x] 7. Trang tra cứu sách
  - Ô tìm kiếm theo tiêu đề, tác giả, mã sách
  - Bảng kết quả hiển thị: mã sách, tiêu đề, tác giả, trạng thái
  - _Yêu cầu: 5.1 - 5.6_

- [x] 8. Trang quản lý độc giả
  - Bảng danh sách độc giả
  - Form thêm/sửa độc giả
  - Nút xóa với kiểm tra ràng buộc
  - _Yêu cầu: 6.1 - 6.6_

- [x] 9. Trang quản lý sách
  - Bảng danh sách sách
  - Form thêm/sửa sách
  - Nút xóa với kiểm tra ràng buộc
  - _Yêu cầu: 7.1 - 7.6_

- [x] 10. Trang thống kê và báo cáo
  - Báo cáo sách quá hạn (bảng danh sách)
  - Báo cáo tình trạng kho (biểu đồ)
  - Báo cáo thống kê mượn trả theo khoảng thời gian
  - _Yêu cầu: 8.1 - 8.4_

- [x] 11. Checkpoint - Đảm bảo GUI hoạt động với backend
  - Kiểm tra tất cả các trang hoạt động đúng
  - Kiểm tra responsive và UX
  - Hỏi người dùng nếu có thắc mắc.

## Ghi chú

- Sử dụng React + TypeScript + Vite
- UI library: Ant Design hoặc Material UI
- Kết nối backend qua REST API (axios)
- Tham chiếu requirements và design từ spec chính
