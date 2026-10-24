# MiuMiu Booth – Web tĩnh (HTML / CSS / JS)

Không còn .NET, MVC hay SQL. Toàn bộ website là 1 trang `index.html` + `css/site.css` + `js/app.js`.
Dữ liệu (gói giá, ảnh, yêu cầu đặt lịch) lưu trong **localStorage của trình duyệt**.

## Chạy trong Visual Studio Code
1. Mở thư mục `MiuMiuBooth` bằng VS Code (`File → Open Folder`).
2. Cài extension **Live Server** (VS Code sẽ tự gợi ý).
3. Chuột phải `index.html` → **Open with Live Server** (hoặc bấm "Go Live" ở góc phải dưới).

Cách khác: chỉ cần mở trực tiếp file `index.html` bằng trình duyệt cũng chạy được.

## Các trang (địa chỉ dạng `#/...`)
| Địa chỉ | Nội dung |
|---|---|
| `#/` | Trang chủ |
| `#/gioi-thieu` | Giới thiệu |
| `#/dich-vu`, `#/bang-gia` | Dịch vụ + Bảng giá |
| `#/hinh-anh` | Hình ảnh thực tế (lọc, xem thêm, phóng to) |
| `#/dat-lich` | Form đặt lịch |
| `#/lien-he` | Liên hệ, bản đồ, giờ làm việc |
| `#/admin` | Quản trị: đặt lịch, gói giá, thư viện ảnh |

## Quản trị
Vào `#/admin`, tài khoản mặc định `admin` / `MiuMiu@2026-doi-ngay` – **đổi trong `js/app.js` (mục `ADMIN`)**.

## Lưu ý quan trọng
- Web tĩnh không có máy chủ: yêu cầu đặt lịch chỉ lưu **trong trình duyệt đang dùng**. Khách ở máy khác gửi form thì bạn **sẽ không thấy** trong `#/admin` của bạn.
  Nếu cần nhận đặt lịch từ khách thật, hãy dùng dịch vụ form (Formspree, Google Forms, Zalo/Hotline) hoặc quay lại bản có server.
- Mật khẩu admin nằm trong file JS nên ai xem mã nguồn cũng thấy – chỉ phù hợp dùng cá nhân/demo.
- Nút "Xuất CSV" trong admin để sao lưu yêu cầu đặt lịch.
- Xóa dữ liệu mẫu/đặt lại: xóa dữ liệu trang trong trình duyệt (hoặc `localStorage.clear()` ở Console).

## Thay ảnh thật
Đặt file vào `images/` đúng tên: `hero.jpg`, `about.jpg`, `story.jpg`, `booking.jpg`, `contact.jpg` (chưa có thì hiện hình minh hoạ).
Ảnh thư viện: tải lên trong `#/admin/photos` (tự thu nhỏ ~1000px để vừa bộ nhớ trình duyệt).

## Sửa thông tin liên hệ
Đầu file `js/app.js`, mục `SITE` (hotline, Zalo, Facebook, Instagram, địa chỉ, giờ làm việc).

## Cấu trúc
```
index.html
css/site.css
js/app.js        (dữ liệu, router, các trang, admin)
images/          (ảnh thật, tùy chọn)
```
