/* MiuMiu Booth – web tĩnh (HTML/CSS/JS), không cần server hay SQL.
   Dữ liệu lưu trong localStorage của trình duyệt. */
(function () {
    "use strict";

    // =====================================================================
    // CẤU HÌNH – sửa tại đây
    // =====================================================================
    var SITE = {
        BookingEndpoint:"https://formspree.io/f/xljjdqry",
        Hotline: "0889 281 187",
        ZaloUrl: "https://zalo.me/0384230341",
        FacebookUrl: "https://www.facebook.com/share/1EeQNeP9jQ/",
        InstagramHandle: "miumiu.booth",
        Address: " Tân Lập, Lâm Đồng, Việt Nam",
        MapQuery: "Tân Lập, Lâm Đồng, Việt Nam",
        HoursWeekday: "8:00 - 20:00",
        HoursWeekend: "8:00 - 22:00"
    };
    // Đăng nhập quản trị (#/admin). Lưu ý: web tĩnh nên mật khẩu nằm trong code – chỉ để quản lý cá nhân/demo.
    var ADMIN = { username: "admin", password: "MiuMiu@2026-doi-ngay" };

    // Bảng giá trang Dịch vụ – sửa nội dung/giá tại đây
    var PRICING = {
        photobooth: {
            title: "PHOTOBOOTH",
            tiers: [
                { name: "GÓI 1H", price: "2.500.000" },
                { name: "GÓI 2H", price: "4.000.000" },
                { name: "GÓI 3H", price: "5.000.000" },
                { name: "GÓI FULL TIỆC", price: "6.500.000" }
            ],
            includes: [
                "1 box máy chụp ( gồm máy ảnh canon siêu nét, màn hình cảm ứng , máy in dnp rx1 hs )",
                "3 đèn chiếu sáng stdio",
                "Set up miễn phí phông nền chụp ảnh đa dạng màu theo yêu cầu",
                "Thư viện trực tuyến tải về bằng QR code , gửi toàn bộ file gốc sau tiệc",
                "1 bộ phụ kiện chụp ảnh đi kèm ( gồm hastag, bờm cải tóc, mắt kính,...)",
                "Tặng 1 số scrapbook dán ảnh + bút màu ghi lời chúc",
                "2 nhân viên hỗ trợ chụp và điều phối khách",
                "In và chụp không giới hạn trong thời gian quy định"
            ],
            note: [
                "Giờ phát sinh 1.500.000vnđ/1h .",
                "Miễn phí di chuyển trong bán kính 40km .",
                "Giá chưa bao gồm thuế phí xuất hóa đơn VAT nếu khách hàng có nhu cầu"
            ]
        },
        shoot: {
            title: "CHỤP ẢNH VÀ QUAY PHIM",
            items: [
                { name: "CHỤP ẢNH TRUYỀN THỐNG", price: "2.500.000",
                  features: ["1 máy chụp giao toàn bộ file", "Nâng tone làm mịn da", "In 100 tấm làm album"] },
                { name: "CHỤP ẢNH PHÓNG SỰ", price: "3.500.000",
                  features: ["1 máy chụp giao toàn bộ file", "Chụp từ khúc trang điểm, chân dung, gia đình chuẩn bị,....", "Nâng tone làm mịn da, chỉnh sửa dáng 200 tấm"] },
                { name: "QUAY PHÓNG SỰ", price: "5.500.000",
                  features: ["1 máy quay phim phóng sự", "Tặng Fly cam tà cảnh", "Giao clip thành phẩm 5-10 phút"] }
            ]
        }
    };

    var EVENT_TYPES = ["Tiệc cưới", "Sinh nhật", "Doanh nghiệp", "Sự kiện", "Khác"];
    var STATUSES = ["Mới", "Đang tư vấn", "Đã xác nhận", "Đã hủy"];
    var STORE_KEY = "miumiu.booth.data.v1";
    var AUTH_KEY = "miumiu.booth.admin";
    // Ảnh thực tế (file nằm trong thư mục images/). cat = Tiệc cưới | Sinh nhật | Doanh nghiệp | Sự kiện. Bỏ cat thì mặc định là Doanh nghiệp.
    var GALLERY_PHOTOS = [
        { file: "c1.jpg",    cat: "Tiệc cưới",  title: "Đám cưới Minh & Lan" },
        { file: "c2.jpg",    cat: "Tiệc cưới",  title: "Đám cưới Hương & Tuấn" },
        { file: "c3.jpg",    cat: "Tiệc cưới",  title: "Đám cưới Hoa & Hải" },
        { file: "c4.jpg",    cat: "Tiệc cưới",  title: "Đám cưới Mai & Hưng" },
        { file: "c5.jpg",    cat: "Tiệc cưới",  title: "Đám cưới Lan & Minh" },
        { file: "c6.jpg",    cat: "Tiệc cưới",  title: "Đám cưới Hạnh & Sơn" },
        { file: "c7.jpg",    cat: "Tiệc cưới",  title: "Đám cưới Thảo & Duy" },
        { file: "c8.jpg",    cat: "Tiệc cưới",  title: "Đám cưới Phương & Quang" },
        { file: "c9.jpg",    cat: "Tiệc cưới",  title: "Đám cưới Trang & Huy" },
        { file: "c10.jpg",   cat: "Tiệc cưới",  title: "Đám cưới Linh & Khoa" },
        { file: "c11.jpg",   cat: "Tiệc cưới",  title: "Đám cưới Vy & Nam" },
        { file: "c12.jpg",   cat: "Tiệc cưới",  title: "Đám cưới Hương & Phúc" },
        { file: "c13.jpg",   cat: "Tiệc cưới",  title: "Đám cưới Thủy & Hoàng" },
        { file: "c14.jpg",   cat: "Tiệc cưới",  title: "Đám cưới Mai & Long" },
        { file: "c15.jpg",   cat: "Tiệc cưới",  title: "Đám cưới Hạnh & Tuấn" },
        { file: "sk1.jpg", title: "Eurostone – You & Me (nhóm)" },
        { file: "sk2.jpg",    title: "HDBank – Team building Đồng Nai (nhóm)" },
        { file: "sk3.jpg", title: "Eurostone – You & Me (photostrip đôi)" },
        { file: "sk4.jpg",    title: "HDBank – Team building (chị em)" },
        { file: "sk5.jpg", title: "Eurostone – Trọn vẹn Eurostone" },
        { file: "sk6.jpg",    title: "HDBank – Team building (cầm bảng)" },
        { file: "sk7.jpg",    title: "HDBank – Tôi yêu HDBank" },
        { file: "sk8.jpg", title: "Eurostone – You & Me (nhóm)" },
        { file: "sk9.jpg",    title: "HDBank – Team building Đồng Nai (nhóm)" },
        { file: "sk10.jpg", title: "Eurostone – You & Me (photostrip đôi)" },
        { file: "le1.jpg", cat: "Sự kiện", title: "Sự kiện ngày lễ 1" },
        { file: "le2.jpg", cat: "Sự kiện", title: "Sự kiện ngày lễ 2" },
        { file: "le3.jpg", cat: "Sự kiện", title: "Sự kiện ngày lễ 3" },
        { file: "le4.jpg", cat: "Sự kiện", title: "Sự kiện ngày lễ 4" },
        { file: "le5.jpg", cat: "Sự kiện", title: "Sự kiện ngày lễ 5" }
    ];

    // =====================================================================
    // TIỆN ÍCH
    // =====================================================================
    function esc(v) {
        return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }
    function vnd(n) { return Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
    function lines(t) { return String(t || "").split("\n").map(function (x) { return x.trim(); }).filter(Boolean); }
    function catIcon(c) {
        return { "Tiệc cưới": "💍", "Sinh nhật": "🎂", "Doanh nghiệp": "🏢", "Sự kiện": "🌿" }[c] || "📸";
    }
    function safeUrl(u) {
        if (!u) return "";
        if (/^\/(?!\/)/.test(u) || /^https:\/\//i.test(u) || /^data:image\/(jpeg|png|webp|gif);base64,/i.test(u) || /^images\//.test(u)) return u;
        return "";
    }
    function todayStr() {
        var d = new Date();
        return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    }
    function fmtDate(iso) {
        var d = new Date(iso);
        if (isNaN(d)) return "";
        return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    }
    function fmtDateTime(iso) {
        var d = new Date(iso);
        return fmtDate(iso) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    }
    function nextId(list) { return list.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1; }

    // =====================================================================
    // DỮ LIỆU (localStorage)
    // =====================================================================
    function seed() {
        var cats = ["Tiệc cưới", "Sinh nhật", "Doanh nghiệp", "Sự kiện"];
        var photos = [];
        for (var i = 0; i < 12; i++) {
            photos.push({
                id: i + 1,
                title: cats[i % 4] + " #" + (Math.floor(i / 4) + 1),
                category: cats[i % 4],
                imageUrl: "",
                sortOrder: i + 1,
                isVisible: true
            });
        }
        return {
            packages: [
                { id: 1, name: "Gói cơ bản", description: "", price: 2000000, isCustomPrice: false, badge: "", durationHours: 2, sortOrder: 1, featured: false, isActive: true,
                  features: "Thuê máy 2 giờ\nKhung ảnh tiêu chuẩn\nIn ảnh không giới hạn\nPhụ kiện cơ bản\nNhân viên hỗ trợ" },
                { id: 2, name: "Gói phổ biến", description: "", price: 3500000, isCustomPrice: false, badge: "HOT", durationHours: 4, sortOrder: 2, featured: true, isActive: true,
                  features: "Thuê máy 4 giờ\nNhiều khung ảnh tùy chọn\nIn ảnh không giới hạn\nPhụ kiện đa dạng\nNhân viên hỗ trợ\nThiết kế khung theo yêu cầu" },
                { id: 3, name: "Gói cao cấp", description: "", price: 5000000, isCustomPrice: false, badge: "", durationHours: 6, sortOrder: 3, featured: false, isActive: true,
                  features: "Thuê máy 6 giờ\nThiết kế khung riêng\nIn ảnh không giới hạn\nNhiều phụ kiện cao cấp\nNhân viên hỗ trợ\nBackdrop theo chủ đề" },
                { id: 4, name: "Gói theo yêu cầu", description: "", price: 0, isCustomPrice: true, badge: "", durationHours: 0, sortOrder: 4, featured: false, isActive: true,
                  features: "Thời gian linh hoạt\nThiết kế theo yêu cầu\nPhụ kiện theo chủ đề\nHỗ trợ set up theo địa điểm\nTư vấn chi tiết\nƯu đãi cho doanh nghiệp" }
            ],
            services: [
                { id: 1, title: "Tiệc cưới", icon: "💍", description: "Lưu giữ khoảnh khắc hạnh phúc", imageUrl: "", sortOrder: 1, isActive: true,
                  features: "Khung ảnh thiết kế riêng\nPhụ kiện theo chủ đề\nNhân viên hỗ trợ tận nơi" },
                { id: 2, title: "Sinh nhật", icon: "🎂", description: "Không gian vui nhộn, khung ảnh theo chủ đề", imageUrl: "", sortOrder: 2, isActive: true,
                  features: "Nhiều mẫu khung đáng yêu\nPhụ kiện dễ thương\nPhù hợp mọi lứa tuổi" },
                { id: 3, title: "Sự kiện doanh nghiệp", icon: "🏢", description: "Tăng gắn kết, lan tỏa thương hiệu", imageUrl: "", sortOrder: 3, isActive: true,
                  features: "Thiết kế khung theo logo\nIn ảnh nhanh chóng\nHỗ trợ set up chuyên nghiệp" },
                { id: 4, title: "Khai trương - Khác", icon: "🌿", description: "Phù hợp nhiều loại hình sự kiện", imageUrl: "", sortOrder: 4, isActive: true,
                  features: "Thiết kế linh hoạt\nNhiều phụ kiện sáng tạo\nPhù hợp mọi loại hình" }
            ],
            photos: photos,
            bookings: []
        };
    }

    var db;
    function load() {
        try {
            var raw = localStorage.getItem(STORE_KEY);
            if (raw) {
                var d = JSON.parse(raw);
                if (d && d.packages && d.services && d.photos && d.bookings) return d;
            }
        } catch (e) { /* bỏ qua, dùng dữ liệu mẫu */ }
        return seed();
    }
    var storageOk = true;
    function save() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); storageOk = true; return true; }
        catch (e) { storageOk = false; return false; }
    }
    db = load();
    
    // Thêm các ảnh mới trong GALLERY_PHOTOS (mỗi file chỉ thêm 1 lần; xóa trong admin sẽ không bị thêm lại).
    function ensureGalleryPhotos() {
                // Xóa ô minh hoạ trống của danh mục đã có ảnh thật
        var realCats = {};
        db.photos.forEach(function (p) { if (p.imageUrl) realCats[p.category] = true; });
        var before = db.photos.length;
        db.photos = db.photos.filter(function (p) { return p.imageUrl || !realCats[p.category]; });
        if (db.photos.length !== before) save();
        // Đổi tên danh mục cũ "Khai trương" / "Sự Kiện" thành "Sự kiện" (ảnh + yêu cầu đặt lịch đã lưu)
        var renamed = false;
        db.photos.forEach(function (p) { if (p.category === "Khai trương" || p.category === "Sự Kiện") { p.category = "Sự kiện"; renamed = true; } });
        db.bookings.forEach(function (b) { if (b.eventType === "Khai trương") { b.eventType = "Sự kiện"; renamed = true; } });
        if (renamed) save();
        // Đồng bộ danh mục theo khai báo trong GALLERY_PHOTOS (sửa cat trong code là đổi theo)
        var changed = false;
        GALLERY_PHOTOS.forEach(function (c) {
            var url = "images/" + c.file, cat = c.cat || "Doanh nghiệp";
            db.photos.forEach(function (p) {
                if (p.imageUrl === url && p.category !== cat) { p.category = cat; changed = true; }
            });
        });
        var done = db.corpSeeded || [];
        var fresh = GALLERY_PHOTOS.filter(function (c) { return done.indexOf(c.file) < 0; });
        if (fresh.length) {
            // Danh mục nào có ảnh thật mới thì bỏ các ô minh hoạ trống của danh mục đó
            var cats = fresh.map(function (c) { return c.cat || "Doanh nghiệp"; });
            db.photos = db.photos.filter(function (p) { return !(cats.indexOf(p.category) >= 0 && !p.imageUrl); });
            db.photos.forEach(function (p) { p.sortOrder = (p.sortOrder || 0) + fresh.length; });
            fresh.forEach(function (c, i) {
                var url = "images/" + c.file;
                if (!db.photos.some(function (p) { return p.imageUrl === url; })) {
                    db.photos.push({ id: nextId(db.photos), title: c.title, category: c.cat || "Doanh nghiệp", imageUrl: url, sortOrder: i + 1, isVisible: true });
                }
                done.push(c.file);
            });
            db.corpSeeded = done;
            changed = true;
        }
        if (changed) save();
    }
    ensureGalleryPhotos();

    // Đồng bộ các "Gói dịch vụ" trong form đặt lịch với bảng giá PRICING.photobooth (chạy 1 lần; sau đó sửa được trong #/admin/packages).
    // Muốn đồng bộ lại sau khi đổi giá trong PRICING: đổi số 1 thành 2 ở 2 chỗ "pkgSyncV".
    function syncPackages() {
        if (db.pkgSyncV === 2) return;
        var names = ["Gói 1H", "Gói 2H", "Gói 3H", "Gói full tiệc"];
        var hours = [1, 2, 3, 0];
        var feats = PRICING.photobooth.includes.join("\n");
        var list = PRICING.photobooth.tiers.map(function (t, i) {
            return { name: names[i] || t.name, price: Number(String(t.price).replace(/\D/g, "")) || 0,
                badge: i === 1 ? "HOT" : "", durationHours: hours[i] || 0, featured: i === 1, features: feats };
        });
        // Chụp ảnh & quay phim: lấy tên + giá + nội dung từ PRICING.shoot.items, viết hoa chữ đầu
        var shootNames = ["Chụp ảnh truyền thống", "Chụp ảnh phóng sự", "Quay phóng sự"];
        PRICING.shoot.items.forEach(function (it, i) {
            list.push({ name: shootNames[i] || it.name, price: Number(String(it.price).replace(/\D/g, "")) || 0,
                badge: "", durationHours: 0, featured: false, features: it.features.join("\n") });
        });
        list.push({ name: "Gói theo yêu cầu", price: 0, isCustomPrice: true, badge: "", durationHours: 0, featured: false,
            features: "Thời gian linh hoạt\nThiết kế theo yêu cầu\nTư vấn chi tiết" });
        db.packages = list.map(function (p, i) {
            return { id: i + 1, name: p.name, description: "", price: p.price, isCustomPrice: !!p.isCustomPrice, badge: p.badge,
                durationHours: p.durationHours, sortOrder: i + 1, featured: p.featured, isActive: true, features: p.features };
        });
        db.pkgSyncV = 2;
        save();
    }
    syncPackages();

    function bySort(a, b) { return (a.sortOrder - b.sortOrder) || (a.price - b.price) || 0; }
    function activePackages() { return db.packages.filter(function (p) { return p.isActive; }).sort(bySort); }
    // Tạm ẩn dịch vụ: ghi đúng tên dịch vụ vào đây; muốn hiện lại thì xóa khỏi danh sách.
    var HIDDEN_SERVICES = ["Sinh nhật"];
    // Tạm ẩn danh mục ảnh trong trang Hình ảnh (cả tab lẫn ảnh trong "Tất cả"). Muốn hiện lại thì để [].
    var HIDDEN_CATEGORIES = ["Sinh nhật"];
    // Đổi tên hiển thị của dịch vụ: "tên cũ": "tên mới"
    var SERVICE_TITLES = { "Khai trương - Khác": "Sự kiện, Ngày Lễ","Sự kiện doanh nghiệp": "Tiệc công ty" };
    function activeServices() {
        return db.services
            .filter(function (s) { return s.isActive && HIDDEN_SERVICES.indexOf(s.title) < 0; })
            .map(function (s) { return Object.assign({}, s, { title: SERVICE_TITLES[s.title] || s.title }); })
            .sort(bySort);
    }

    // =====================================================================
    // THÀNH PHẦN GIAO DIỆN CHUNG
    // =====================================================================
    function visual(file, alt, cls) {
        return '<div class="visual ' + esc(cls || "") + '" data-img="' + esc(file) + '" data-alt="' + esc(alt) + '">' +
            '<svg class="booth-svg" viewBox="0 0 300 360" role="img" aria-label="' + esc(alt) + '" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="48" y="52" width="204" height="290" rx="16" fill="#a3aa7a" />' +
            '<rect x="34" y="22" width="232" height="50" rx="14" fill="#2f6b4b" />' +
            '<text x="150" y="54" text-anchor="middle" font-family="Pacifico, cursive" font-size="22" fill="#fff">Coanhcoem Studio</text>' +
            '<rect x="68" y="88" width="164" height="240" rx="10" fill="#f3f3e8" />' +
            '<path d="M68 88 H128 Q112 200 120 328 H68 Z" fill="#7a8450" />' +
            '<path d="M232 88 H172 Q188 200 180 328 H232 Z" fill="#7a8450" />' +
            '<rect x="128" y="118" width="44" height="34" rx="6" fill="#fff" stroke="#2f6b4b" stroke-width="3" />' +
            '<circle cx="150" cy="135" r="9" fill="#2f6b4b" /><circle cx="150" cy="135" r="4" fill="#fff" />' +
            '<g fill="#f1e3a8"><circle cx="52" cy="70" r="14" /><circle cx="270" cy="84" r="16" /><circle cx="44" cy="150" r="12" />' +
            '<circle cx="262" cy="190" r="13" /><circle cx="54" cy="250" r="15" /><circle cx="258" cy="290" r="14" /></g>' +
            '<g fill="#fff"><circle cx="52" cy="70" r="5" /><circle cx="270" cy="84" r="6" /><circle cx="262" cy="190" r="5" />' +
            '<circle cx="54" cy="250" r="6" /><circle cx="258" cy="290" r="5" /></g>' +
            '<text x="150" y="190" text-anchor="middle" font-size="40">📸</text>' +
            '<rect x="84" y="208" width="132" height="29" rx="14.5" fill="#faf7ea" />' +
            '<text x="150" y="228" text-anchor="middle" font-family="Pacifico, cursive" font-size="14" fill="#b5603c">Good memories ♡</text>' +
            '</svg></div>';
    }
    // Có ảnh thật trong thư mục images/ thì thay hình minh hoạ bằng ảnh đó.
    function hydrateVisuals(root) {
        Array.prototype.forEach.call(root.querySelectorAll(".visual[data-img]"), function (box) {
            var img = new Image();
            img.onload = function () {
                img.alt = box.getAttribute("data-alt") || "";
                img.loading = "lazy";
                box.innerHTML = "";
                box.appendChild(img);
            };
                                   img.src = "images/" + box.getAttribute("data-img");
        });
    }

        // Ảnh cho thẻ Dịch vụ: ưu tiên SERVICE_IMAGES, nếu không có thì lấy ảnh đầu tiên của danh mục đó trong thư viện ảnh.
    var SERVICE_IMAGES = {
        "Tiệc cưới": "images/cuoibia.jpg",
        "Sinh nhật": "images/sn1.jpg",
        "Doanh nghiệp": "images/biadn.jpg",
        "Sự kiện": "images/sukien.jpg"
    };
    // Vị trí cắt ảnh trong khung: "ngang dọc". Dọc 0% = lấy phần trên ảnh, 100% = lấy phần dưới ảnh.
    var SERVICE_POSITIONS = {
        "Doanh nghiệp": "center 100%"
    };
    function serviceImage(type) {
        if (SERVICE_IMAGES[type]) return safeUrl(SERVICE_IMAGES[type]);
        var list = db.photos.filter(function (p) { return p.isVisible && p.category === type && safeUrl(p.imageUrl); })
            .sort(function (a, b) { return (a.sortOrder - b.sortOrder) || (b.id - a.id); });
        return list.length ? safeUrl(list[0].imageUrl) : "";
    }

    function serviceCard(s, showFeatures) {
        var type = s.title.indexOf("Tiệc cưới") >= 0 ? "Tiệc cưới" :
            s.title.indexOf("Sinh nhật") >= 0 ? "Sinh nhật" :
                        /doanh nghiệp|công ty/i.test(s.title) ? "Doanh nghiệp" : "Sự kiện";
                var img = safeUrl(s.imageUrl) || serviceImage(type);
        var media = img
            ? '<img src="' + esc(img) + '" alt="' + esc(s.title) + '" loading="lazy"' +
                (SERVICE_POSITIONS[type] ? ' style="object-position:' + SERVICE_POSITIONS[type] + '"' : '') + ' />'
            : '<span class="card-emoji" aria-hidden="true">' + esc(s.icon) + '</span>';
        return '<article class="card service-card"><div class="card-media">' + media + '</div>' +
            '<h3 class="card-title">' + esc(s.title) + '</h3><p class="card-desc">' + esc(s.description) + '</p>' +
            (showFeatures ? '<ul class="checks">' + lines(s.features).map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" : "") +
            '<a class="card-link" href="#/dat-lich?eventType=' + encodeURIComponent(type) + '">Xem chi tiết →</a></article>';
    }

    function packageCard(p) {
        return '<article class="price-card ' + (p.featured ? "is-featured" : "") + '">' +
            (p.badge ? '<span class="badge">' + esc(p.badge) + "</span>" : "") +
            '<h3 class="price-name">' + esc(p.name) + "</h3>" +
            '<p class="price">' + (p.isCustomPrice ? '<span class="price-num">Liên hệ</span>' :
                '<span class="price-num">' + vnd(p.price) + "<small>đ</small></span>") + "</p>" +
            '<ul class="checks">' + lines(p.features).map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
            '<a class="btn ' + (p.featured ? "btn-primary" : "btn-soft") + ' btn-block" href="#/dat-lich?packageId=' + p.id + '">' +
            (p.isCustomPrice ? "Nhận báo giá" : "Chọn gói này") + "</a></article>";
    }

    function siteLayout(nav, body) {
        function act(k) { return nav === k ? "active" : ""; }
        var digits = SITE.Hotline.replace(/\D/g, "");
        return '<header class="site-header"><nav class="container nav" aria-label="Menu chính">' +
            '<a class="logo" href="#/"><img src="images/coanhcoem.png" alt="Coanhcoem Studio" /></a>' +
            '<div class="nav-links" id="navLinks">' +
            '<a class="' + act("home") + '" href="#/">Trang chủ</a>' +
            '<a class="' + act("about") + '" href="#/gioi-thieu">Giới thiệu</a>' +
            '<a class="' + act("services") + '" href="#/dich-vu">Dịch vụ</a>' +
            '<a class="' + act("gallery") + '" href="#/hinh-anh">Hình ảnh</a>' +
            '<a class="' + act("book") + '" href="#/dat-lich">Đặt lịch</a>' +
            '<a class="' + act("contact") + '" href="#/lien-he">Liên hệ</a></div>' +
            '<a class="btn btn-primary btn-sm nav-cta" href="#/dat-lich">Đặt lịch ngay</a>' +
            '<button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="navLinks">☰</button>' +
            '</nav></header>' +
            "<main>" + body + "</main>" +
            '<footer class="site-footer"><div class="container footer-grid">' +
            '<div><p class="footer-brand">Coanhcoem Studio ♡</p><p>Lưu giữ những khoảnh khắc đáng yêu cùng bạn.</p></div>' +
            '<div><strong>Khám phá</strong><a href="#/bang-gia">Dịch vụ &amp; bảng giá</a><a href="#/hinh-anh">Hình ảnh thực tế</a><a href="#/dat-lich">Đặt lịch</a></div>' +
            '<div><strong>Liên hệ</strong><a href="tel:' + esc(digits) + '">Hotline: ' + esc(SITE.Hotline) + "</a>" +
            '<a href="' + esc(SITE.ZaloUrl) + '" target="_blank" rel="noopener">Zalo</a>' +
            '<a href="' + esc(SITE.FacebookUrl) + '" target="_blank" rel="noopener">Facebook</a></div></div>' +
            '<p class="copyright">© ' + new Date().getFullYear() + " Coanhcoem Studio. All rights reserved.</p></footer>" +
            '<nav class="tabbar" aria-label="Điều hướng nhanh">' +
            '<a class="' + act("home") + '" href="#/"><span>🏠</span>Trang chủ</a>' +
            '<a class="' + act("services") + '" href="#/dich-vu"><span>🌿</span>Dịch vụ</a>' +
            '<a class="' + act("gallery") + '" href="#/hinh-anh"><span>🖼️</span>Hình ảnh</a>' +
            '<a class="' + act("book") + '" href="#/dat-lich"><span>📅</span>Đặt lịch</a>' +
            '<a class="' + act("contact") + '" href="#/lien-he"><span>📞</span>Liên hệ</a></nav>';
    }

    function adminLayout(section, body) {
        function act(k) { return section === k ? "active" : ""; }
        return '<header class="admin-bar"><div class="container admin-bar-in"><strong class="admin-brand">Coanhcoem Studio · Quản trị</strong>' +
            '<nav class="admin-nav"><a class="' + act("bookings") + '" href="#/admin">Đặt lịch</a>' +
            '<a class="' + act("packages") + '" href="#/admin/packages">Gói giá</a>' +
            '<a class="' + act("photos") + '" href="#/admin/photos">Thư viện ảnh</a>' +
            '<a href="#/" target="_blank">Xem website ↗</a></nav>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="logout">Đăng xuất</button></div></header>' +
            '<main class="container admin-main">' +
            (storageOk ? "" : '<div class="validation">Không lưu được dữ liệu (bộ nhớ trình duyệt đầy hoặc bị chặn). Hãy dùng ảnh nhỏ hơn hoặc xóa bớt.</div>') +
            body + "</main>";
    }

    // =====================================================================
    // TRANG KHÁCH
    // =====================================================================
    var pages = {};

    pages.home = function () {
        return siteLayout("home",
            '<section class="hero"><div class="hero-banner"><div class="container hero-grid"><div class="hero-text">' +
            '<p class="hero-lead">Lưu giữ những khoảnh khắc<br />đáng yêu cùng</p>' +
            '<h1 class="brand-script">Coanhcoem<br/>Studio</h1>' +
            '<p class="hero-sub">Photobooth xinh xắn dành cho mọi sự kiện<br />Đám cưới, sinh nhật, khai trương, sự kiện doanh nghiệp...</p>' +
            '<div class="btn-row"><a class="btn btn-primary" href="#/dat-lich">Đặt lịch ngay →</a><a class="btn btn-ghost" href="#/dich-vu">Xem dịch vụ</a></div></div>' +
           '</div></div>' +
            '<ul class="container perks"><li><span>📽️</span>Ảnh chất lượng cao</li><li><span>🌿</span>Nhiều khung ảnh xinh</li>' +
            '<li><span>🥰</span>Phù hợp mọi sự kiện</li><li><span>💚</span>Hỗ trợ tận tâm</li></ul></section>' +
            '<section class="section"><div class="container"><h2 class="section-title"><span class="ico">DỊCH VỤ CỦA CHÚNG MÌNH</h2>' +
            '<p class="section-sub">Phù hợp với mọi khoảnh khắc quan trọng trong cuộc sống</p><div class="grid grid-4 grid-center">' +
            activeServices().map(function (s) { return serviceCard(s, false); }).join("") + "</div></div></section>" +
            '<section class="section cta-band"><div class="container center"><h2 class="section-title">Sẵn sàng lưu giữ kỷ niệm? ♡</h2>' +
            '<p class="section-sub">Gửi yêu cầu để được tư vấn gói photobooth phù hợp với sự kiện của bạn.</p>' +
            '<a class="btn btn-primary" href="#/dat-lich">Đặt lịch ngay →</a></div></section>');
    };
        // 4 khung "Điểm đặc biệt" (trang Giới thiệu). img = ảnh nền (đặt trong images/), để "" nếu không muốn dùng ảnh.
    var FEATURES = [
        { ico: "",  title: "Thiết kế xinh xắn",         desc: "Phù hợp mọi không gian",       img: "images/anh1.jpg" },
        { ico: "",  title: "Hình ảnh chất lượng cao",   desc: "Máy ảnh chuyên nghiệp",        img: "images/may1.jpg" },
        { ico: "", title: "Nhiều khung ảnh sáng tạo",  desc: "Liên tục cập nhật mẫu mới",    img: "images/anh3.jpg" },
        { ico: "", title: "Dịch vụ tận tâm",           desc: "Hỗ trợ từ A - Z cho bạn",      img: "images/anh4.jpg" }
    ];
    function featureCards() {
        return FEATURES.map(function (f) {
            var u = safeUrl(f.img);
            return '<article class="card feature' + (u ? " has-bg" : "") + '"' + (u ? ' style="background-image:url(\'' + esc(u) + '\')"' : "") + '>' +
                '<span class="feature-ico">' + f.ico + "</span><h3>" + esc(f.title) + "</h3><p>" + esc(f.desc) + "</p></article>";
        }).join("");
    }

    pages.about = function () {
        return siteLayout("about",
            '<section class="hero"><div class="hero-banner"><div class="container hero-grid"><div class="hero-text">' +
            '<h1 class="page-title">Giới thiệu về<br /><span class="brand-script sm">Coanhcoem Studio</span></h1>' +
            '<p class="lead">Không chỉ là chụp ảnh, mà còn là lưu giữ cảm xúc ♡</p>' +
            "<p>Coanhcoem Studio ra đời với mong muốn mang đến trải nghiệm chụp ảnh photobooth hiện đại, xinh xắn và đầy cảm xúc cho mọi người. " +
            "Chúng mình tin rằng mỗi bức ảnh không chỉ là hình ảnh, mà còn là một câu chuyện, một kỷ niệm đáng nhớ cùng những người bạn yêu thương.</p>" +
            '<a class="btn btn-primary" href="#/dat-lich">Đặt lịch ngay</a></div>' +
            '<div class="hero-visual">' + visual("may1.jpg", "Quầy photobooth Coanhcoem Studio trang trí hoa", "frame") + "</div></div></div></section>" +
            '<section class="section"><div class="container"><h2 class="section-title"><span class="ico"></span> ĐIỂM ĐẶC BIỆT CỦA COANHCOEM STUDIO</h2><div class="grid grid-4">' +
                      featureCards() + '</div></div></section>' +
            '<section class="section"><div class="container hero-grid reverse"><div class="hero-visual">' +
            visual("may2.jpg", "Những khoảnh khắc đáng yêu cùng Coanhcoem Studio", "frame wide") + '</div><div class="hero-text">' +
            '<h2 class="section-title left"><span class="ico">🌿</span> Câu chuyện của chúng mình</h2>' +
            "<p>Coanhcoem Studio được thành lập bởi những người trẻ yêu thích nhiếp ảnh và mong muốn mang đến những khoảnh khắc đáng yêu cho mọi khách hàng. " +
            "Từ những tiệm nhỏ, chúng mình đã đồng hành cùng hàng trăm sự kiện, gửi gắm niềm vui, sự thân thương và tạo nên những kỷ niệm khó quên.</p>" +
            '<a class="btn btn-ghost" href="#/hinh-anh">Xem thêm hình ảnh</a></div></div></section>');
    };

    pages.services = function () {
        var pb = PRICING.photobooth, sh = PRICING.shoot;
        function li(t) { return "<li>" + esc(t) + "</li>"; }    
        return siteLayout("services",
            '<div class="container sv-page"><header class="center sv-head">' +
            '<h1 class="page-title"><span class="ico">BẢNG GIÁ & DỊCH VỤ PHOTOBOOTH</h1>' +
            '<p class="section-sub">Đa dạng dịch vụ, phù hợp mọi nhu cầu của bạn</p></header>' +

            // ---- PHOTOBOOTH ----
            '<section class="sv-block" id="bang-gia" aria-labelledby="sv-pb"><h2 class="sv-tab" id="sv-pb">' + esc(pb.title) + "</h2>" +
            '<div class="sv-panel"><div class="sv-tiers">' +
            pb.tiers.map(function (t) {
                return '<a class="sv-tier" href="#/dat-lich"><span class="sv-tier-name">' + esc(t.name) + "</span>" +
                    '<span class="sv-price">' + esc(t.price) + " VNĐ</span></a>";
            }).join("") + "</div>" +
            '<ul class="sv-list">' + pb.includes.map(li).join("") + "</ul>" +
            '<div class="sv-note"><span class="sv-pin" aria-hidden="true">📌</span><p><strong>LƯU Ý :</strong> ' +
            pb.note.map(esc).join("<br />") + "</p></div></div></section>" +

            // ---- CHỤP ẢNH & QUAY PHIM ----
            '<section class="sv-block" aria-labelledby="sv-shoot"><h2 class="sv-tab" id="sv-shoot">' + esc(sh.title) + "</h2>" +
            '<div class="sv-panel"><div class="sv-cols">' +
            sh.items.map(function (it) {
                return '<article class="sv-item"><header><h3>' + esc(it.name) + "</h3><p>" + esc(it.price) + " vnđ</p></header>" +
                    '<ul class="sv-list sv-list-sm">' + it.features.map(li).join("") + "</ul></article>";
            }).join("") + "</div></div></section>" +

            '<p class="center sv-cta"><a class="btn btn-primary" href="#/dat-lich">Đặt lịch ngay →</a></p></div>');
    };

    pages.gallery = function () {
        var photos = db.photos.filter(function (p) { return p.isVisible && safeUrl(p.imageUrl) && HIDDEN_CATEGORIES.indexOf(p.category) < 0; })
            .sort(function (a, b) { return (a.sortOrder - b.sortOrder) || (b.id - a.id); });
        var cats = photos.map(function (p) { return p.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; });
        return siteLayout("gallery",
            '<section class="section page-head"><div class="container center"><h1 class="page-title"><span class="ico"></span> Hình ảnh thực tế</h1>' +
            '<p class="section-sub">Những khoảnh khắc đáng nhớ từ các sự kiện đã đồng hành cùng khách hàng</p>' +
            '<div class="tabs" role="tablist"><button type="button" class="tab active" data-filter="all">Tất cả</button>' +
            cats.map(function (c) { return '<button type="button" class="tab" data-filter="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + "</div>" +
            '<div class="masonry" id="gallery">' +
            photos.map(function (p) {
                var u = safeUrl(p.imageUrl);
                return '<figure class="shot" data-cat="' + esc(p.category) + '" data-full="' + esc(u) + '">' +
                    (u ? '<img src="' + esc(u) + '" alt="' + esc(p.title) + '" loading="lazy" />' :
                        '<div class="shot-ph"><span>' + catIcon(p.category) + "</span><small>" + esc(p.title) + "</small></div>") + "</figure>";
            }).join("") + "</div>" +
            (photos.length ? "" : '<p class="muted">Chưa có hình ảnh nào. Quản trị viên có thể thêm ảnh trong trang quản trị.</p>') +
            '<button type="button" class="btn btn-ghost" id="loadMore" hidden>Xem thêm ảnh →</button></div></section>');
    };

    pages.book = function (q, state) {
        state = state || {};
        var v = state.values || {};
        var err = state.errors || {};
        var eventType = v.eventType != null ? v.eventType : (EVENT_TYPES.indexOf(q.eventType) >= 0 ? q.eventType : "");
        var pkgId = v.packageId != null ? String(v.packageId) : (q.packageId || "");
        function fe(k) { return err[k] ? '<span class="field-error">' + esc(err[k]) + "</span>" : ""; }
        return siteLayout("book",
            '<section class="section page-head"><div class="container center"><h1 class="page-title"><span class="ico"></span> ĐẶT LỊCH NGAY</h1>' +
            '<p class="section-sub">Để không bỏ lỡ những khoảnh khắc đáng yêu nhé!</p></div>' +
            '<div class="container book-grid"><div class="book-visual">' + visual("may1.jpg", "Nhóm bạn chụp ảnh cùng Coanhcoem Studio", "frame") +
            '<p class="script-note">Good Friends<br />Good Memories ♡</p></div>' +
            '<form id="bookForm" class="form-card" novalidate><h2 class="form-title"><span class="ico"></span> Thông tin đặt lịch</h2>' +
            (state.general ? '<div class="validation">' + esc(state.general) + "</div>" : "") +
            '<div class="field"><input name="fullName" placeholder="Họ và tên *" autocomplete="name" maxlength="100" value="' + esc(v.fullName) + '" />' + fe("fullName") + "</div>" +
            '<div class="field"><input name="phone" type="tel" inputmode="tel" placeholder="Số điện thoại *" autocomplete="tel" value="' + esc(v.phone) + '" />' + fe("phone") + "</div>" +
            '<div class="field"><input name="email" type="email" placeholder="Email (nếu có)" autocomplete="email" maxlength="150" value="' + esc(v.email) + '" />' + fe("email") + "</div>" +
            '<div class="field"><label class="field-label">Ngày tổ chức *</label><input name="eventDate" type="date" min="' + todayStr() + '" value="' + esc(v.eventDate) + '" />' + fe("eventDate") + "</div>" +
            '<div class="field"><input name="location" placeholder="Địa điểm tổ chức *" maxlength="250" value="' + esc(v.location) + '" />' + fe("location") + "</div>" +
            '<div class="field"><select name="eventType"><option value="">Loại sự kiện *</option>' +
            EVENT_TYPES.map(function (t) { return '<option value="' + esc(t) + '"' + (t === eventType ? " selected" : "") + ">" + esc(t) + "</option>"; }).join("") +
            "</select>" + fe("eventType") + "</div>" +
            '<div class="field"><select name="packageId"><option value="">Gói dịch vụ (cần tư vấn thêm)</option>' +
            activePackages().map(function (p) {
                return '<option value="' + p.id + '"' + (String(p.id) === pkgId ? " selected" : "") + ">" +
                    esc(p.isCustomPrice ? p.name + " - Liên hệ" : p.name + " - " + vnd(p.price) + "đ") + "</option>";
            }).join("") + "</select></div>" +
            '<div class="field"><textarea name="notes" rows="3" maxlength="2000" placeholder="Ghi chú thêm (nếu có)">' + esc(v.notes) + "</textarea></div>" +
            '<div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off" /></label></div>' +
            '<button class="btn btn-primary btn-block" type="submit">Gửi yêu cầu đặt lịch →</button>' +
            '<p class="hint">Gửi biểu mẫu là yêu cầu tư vấn; lịch chỉ được giữ chỗ sau khi MiuMiu Booth xác nhận với bạn.</p></form></div></section>' +
            '<section class="section"><div class="container"><h2 class="section-title"><span class="ico"></span> Quy trình đặt lịch</h2><ol class="steps">' +
            "<li><b>1</b><div><strong>Gửi yêu cầu</strong><span>Điền form đặt lịch</span></div></li>" +
            "<li><b>2</b><div><strong>Tư vấn chi tiết</strong><span>Báo giá &amp; lên ý tưởng</span></div></li>" +
            "<li><b>3</b><div><strong>Xác nhận</strong><span>Chốt lịch và thông tin</span></div></li>" +
            "<li><b>4</b><div><strong>Tiến hành</strong><span>Set up và chụp ảnh</span></div></li></ol></div></section>");
    };

    pages.success = function () {
        return siteLayout("book",
            '<section class="section"><div class="container center narrow"><div class="success-card"><div class="success-ico">💚</div>' +
            '<h1 class="page-title">Cảm ơn bạn!</h1><p>Coanhcoem Studio đã nhận được yêu cầu đặt lịch. Chúng mình sẽ liên hệ tư vấn và xác nhận trong thời gian sớm nhất.</p>' +
            '<div class="btn-row center-row"><a class="btn btn-primary" href="#/">Về trang chủ</a><a class="btn btn-ghost" href="#/hinh-anh">Xem hình ảnh</a></div></div></div></section>');
    };

    pages.contact = function () {
        var digits = SITE.Hotline.replace(/\D/g, "");
        return siteLayout("contact",
            '<section class="section page-head"><div class="container center"><h1 class="page-title"><span class="ico"></span> Liên hệ với Coanhcoem Studio</h1>' +
            '<p class="section-sub">Chúng mình luôn sẵn sàng đồng hành cùng bạn!</p></div><div class="container book-grid"><ul class="contact-list">' +
            '<li><span class="c-ico c-phone">📞</span><div><strong>Hotline</strong><a href="tel:' + esc(digits) + '">' + esc(SITE.Hotline) + "</a><small>Tư vấn nhanh chóng</small></div></li>" +
            '<li><span class="c-ico c-zalo">💬</span><div><strong>Zalo</strong><a href="' + esc(SITE.ZaloUrl) + '" target="_blank" rel="noopener">Chat qua Zalo</a><small>Nhận báo giá ngay</small></div></li>' +
            '<li><span class="c-ico c-fb">f</span><div><strong>Facebook</strong><a href="' + esc(SITE.FacebookUrl) + '" target="_blank" rel="noopener">Coanhcoem Studio</a><small>Cập nhật ưu đãi mới nhất</small></div></li>' +
            '<li><span class="c-ico c-ig">📸</span><div><strong>Instagram</strong><a href="https://instagram.com/' + esc(SITE.InstagramHandle) + '" target="_blank" rel="noopener">@' + esc(SITE.InstagramHandle) + "</a><small>Xem thêm hình ảnh xinh xắn</small></div></li>" +
            '<li><span class="c-ico c-addr">📍</span><div><strong>Địa chỉ</strong><span>' + esc(SITE.Address) + "</span><small>Hỗ trợ set up toàn quốc</small></div></li></ul>" +
            '<div class="book-visual">' + visual("may2.jpg", "Quầy photobooth Coanhcoem Studio", "frame") + "</div></div></section>" +
            '<section class="section"><div class="container contact-bottom"><div><h2 class="section-title left"><span class="ico"></span> Bản đồ chỉ đường</h2>' +
            '<div class="map"><iframe title="Bản đồ Coanhcoem Studio" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' +
            encodeURIComponent(SITE.MapQuery) + '&output=embed"></iframe></div></div>' +
            '<div class="hours-card"><h3>🕒 Thời gian làm việc</h3><p><span>Thứ 2 - Thứ 6:</span><b>' + esc(SITE.HoursWeekday) + "</b></p>" +
            "<p><span>Thứ 7 - Chủ nhật:</span><b>" + esc(SITE.HoursWeekend) + "</b></p><small>♡ Hỗ trợ tư vấn ngoài giờ theo yêu cầu</small></div></div></section>");
    };

    pages.notFound = function () {
        return siteLayout("", '<section class="section"><div class="container center narrow"><h1 class="page-title">Không tìm thấy trang</h1>' +
            '<p>Trang bạn tìm không tồn tại.</p><a class="btn btn-primary" href="#/">Về trang chủ</a></div></section>');
    };

    // =====================================================================
    // TRANG QUẢN TRỊ
    // =====================================================================
    function isAdmin() { try { return sessionStorage.getItem(AUTH_KEY) === "1"; } catch (e) { return false; } }

    pages.login = function (msg) {
        return '<div class="admin login-page"><form id="loginForm" class="form-card login-card">' +
            '<h1 class="brand-script sm">Coanhcoem Studio</h1><p class="section-sub">Đăng nhập quản trị</p>' +
            (msg ? '<div class="validation">' + esc(msg) + "</div>" : "") +
            '<div class="field"><input name="username" placeholder="Tên đăng nhập" autocomplete="username" required /></div>' +
            '<div class="field"><input name="password" type="password" placeholder="Mật khẩu" autocomplete="current-password" required /></div>' +
            '<button class="btn btn-primary btn-block" type="submit">Đăng nhập</button></form></div>';
    };

    pages.adminBookings = function (q) {
        var status = STATUSES.indexOf(q.status) >= 0 ? q.status : null;
        var list = db.bookings.filter(function (b) { return !status || b.status === status; })
            .sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; }).slice(0, 500);
        function pkgName(id) {
            var p = db.packages.filter(function (x) { return x.id === id; })[0];
            return p ? p.name : "Cần tư vấn";
        }
        return adminLayout("bookings",
            '<div class="admin-head"><h1 class="admin-title">Yêu cầu đặt lịch</h1>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="export-csv">⬇ Xuất CSV</button></div>' +
            '<div class="stats"><div class="stat"><b>' + db.bookings.length + "</b><span>Tổng yêu cầu</span></div>" +
            '<div class="stat"><b>' + db.bookings.filter(function (b) { return b.status === "Mới"; }).length + "</b><span>Mới</span></div>" +
            '<div class="stat"><b>' + db.bookings.filter(function (b) { return b.status === "Đã xác nhận"; }).length + "</b><span>Đã xác nhận</span></div></div>" +
            '<div class="tabs left-tabs"><a class="tab ' + (status ? "" : "active") + '" href="#/admin">Tất cả</a>' +
            STATUSES.map(function (s) { return '<a class="tab ' + (status === s ? "active" : "") + '" href="#/admin?status=' + encodeURIComponent(s) + '">' + esc(s) + "</a>"; }).join("") + "</div>" +
            '<div class="table-wrap"><table class="table"><thead><tr><th>Ngày gửi</th><th>Khách hàng</th><th>Sự kiện</th><th>Gói</th><th>Ghi chú</th><th>Trạng thái</th><th></th></tr></thead><tbody>' +
            list.map(function (b) {
                return "<tr>" +
                    '<td data-label="Ngày gửi">' + esc(fmtDateTime(b.createdAt)) + "</td>" +
                    '<td data-label="Khách hàng"><strong>' + esc(b.fullName) + '</strong><br /><a href="tel:' + esc(b.phone) + '">' + esc(b.phone) + "</a>" +
                    (b.email ? '<br /><a href="mailto:' + esc(b.email) + '">' + esc(b.email) + "</a>" : "") + "</td>" +
                    '<td data-label="Sự kiện">' + esc(b.eventType) + "<br /><small>" + esc(fmtDate(b.eventDate)) + " · " + esc(b.location) + "</small></td>" +
                    '<td data-label="Gói">' + esc(pkgName(b.packageId)) + "</td>" +
                    '<td data-label="Ghi chú">' + esc(b.notes) + "</td>" +
                    '<td data-label="Trạng thái"><select data-action="set-status" data-id="' + b.id + '">' +
                    STATUSES.map(function (s) { return '<option value="' + esc(s) + '"' + (b.status === s ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select></td>" +
                    '<td><button class="link-danger" type="button" data-action="del-booking" data-id="' + b.id + '">Xóa</button></td></tr>';
            }).join("") + "</tbody></table>" +
            (list.length ? "" : '<p class="muted pad">Chưa có yêu cầu nào.</p>') + "</div>" +
            '<p class="hint">Dữ liệu được lưu trong trình duyệt này. Hãy bấm "Xuất CSV" để sao lưu định kỳ.</p>');
    };

    pages.adminPackages = function () {
        return adminLayout("packages",
            '<div class="admin-head"><h1 class="admin-title">Gói giá</h1><a class="btn btn-primary btn-sm" href="#/admin/package">+ Thêm gói</a></div>' +
            '<div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Tên gói</th><th>Giá</th><th>Nhãn</th><th>Hiển thị</th><th></th></tr></thead><tbody>' +
            db.packages.slice().sort(bySort).map(function (p) {
                return "<tr><td data-label=\"#\">" + p.sortOrder + '</td><td data-label="Tên gói"><strong>' + esc(p.name) + "</strong></td>" +
                    '<td data-label="Giá">' + (p.isCustomPrice ? "Liên hệ" : vnd(p.price) + "đ") + "</td>" +
                    '<td data-label="Nhãn">' + esc(p.badge) + '</td><td data-label="Hiển thị">' + (p.isActive ? "✔" : "—") + "</td>" +
                    '<td class="row-actions"><a href="#/admin/package?id=' + p.id + '">Sửa</a>' +
                    '<button class="link-danger" type="button" data-action="del-package" data-id="' + p.id + '">Xóa</button></td></tr>';
            }).join("") + "</tbody></table></div>");
    };

    pages.adminEditPackage = function (q, state) {
        state = state || {};
        var p = state.values || db.packages.filter(function (x) { return String(x.id) === q.id; })[0] ||
            { id: 0, name: "", description: "", price: 0, isCustomPrice: false, badge: "", durationHours: 2, features: "", sortOrder: db.packages.length + 1, featured: false, isActive: true };
        function chk(v) { return v ? " checked" : ""; }
        return adminLayout("packages",
            '<h1 class="admin-title">' + (p.id ? "Sửa gói" : "Thêm gói") + "</h1>" +
            '<form id="packageForm" class="form-card admin-form" novalidate><input type="hidden" name="id" value="' + p.id + '" />' +
            (state.errors && state.errors.length ? '<div class="validation"><ul>' + state.errors.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul></div>" : "") +
            '<div class="field"><label>Tên gói</label><input name="name" maxlength="100" value="' + esc(p.name) + '" /></div>' +
            '<div class="field"><label>Mô tả ngắn</label><textarea name="description" rows="2" maxlength="500">' + esc(p.description) + "</textarea></div>" +
            '<div class="field"><label>Giá (VNĐ)</label><input name="price" type="number" min="0" step="1000" value="' + esc(p.price) + '" /></div>' +
            '<div class="field check"><label><input name="isCustomPrice" type="checkbox"' + chk(p.isCustomPrice) + ' /> Giá liên hệ (hiện chữ "Liên hệ")</label></div>' +
            '<div class="field"><label>Nhãn (vd: HOT)</label><input name="badge" maxlength="20" value="' + esc(p.badge) + '" /></div>' +
            '<div class="field"><label>Số giờ thuê</label><input name="durationHours" type="number" min="0" max="24" value="' + esc(p.durationHours) + '" /></div>' +
            '<div class="field"><label>Quyền lợi (mỗi dòng 1 ý)</label><textarea name="features" rows="7" maxlength="1000">' + esc(p.features) + "</textarea></div>" +
            '<div class="field"><label>Thứ tự</label><input name="sortOrder" type="number" value="' + esc(p.sortOrder) + '" /></div>' +
            '<div class="field check"><label><input name="featured" type="checkbox"' + chk(p.featured) + ' /> Gói nổi bật (nút oliu đậm, viền nổi)</label></div>' +
            '<div class="field check"><label><input name="isActive" type="checkbox"' + chk(p.isActive) + ' /> Đang hiển thị trên website</label></div>' +
            '<div class="btn-row"><button class="btn btn-primary" type="submit">Lưu</button><a class="btn btn-ghost" href="#/admin/packages">Hủy</a></div></form>');
    };

    pages.adminPhotos = function () {
        return adminLayout("photos",
            '<div class="admin-head"><h1 class="admin-title">Thư viện ảnh</h1><a class="btn btn-primary btn-sm" href="#/admin/photo">+ Thêm ảnh</a></div>' +
            '<div class="table-wrap"><table class="table"><thead><tr><th>Ảnh</th><th>Tiêu đề</th><th>Danh mục</th><th>Hiển thị</th><th></th></tr></thead><tbody>' +
            db.photos.slice().sort(function (a, b) { return (a.sortOrder - b.sortOrder) || (b.id - a.id); }).map(function (p) {
                var u = safeUrl(p.imageUrl);
                return '<tr><td data-label="Ảnh">' + (u ? '<img class="thumb" src="' + esc(u) + '" alt="" />' : '<span class="thumb thumb-ph">' + catIcon(p.category) + "</span>") + "</td>" +
                    '<td data-label="Tiêu đề">' + esc(p.title) + '</td><td data-label="Danh mục">' + esc(p.category) + '</td><td data-label="Hiển thị">' + (p.isVisible ? "✔" : "—") + "</td>" +
                    '<td class="row-actions"><a href="#/admin/photo?id=' + p.id + '">Sửa</a>' +
                    '<button class="link-danger" type="button" data-action="del-photo" data-id="' + p.id + '">Xóa</button></td></tr>';
            }).join("") + "</tbody></table></div>");
    };

    pages.adminEditPhoto = function (q, state) {
        state = state || {};
        var p = state.values || db.photos.filter(function (x) { return String(x.id) === q.id; })[0] ||
            { id: 0, title: "", category: EVENT_TYPES[0], imageUrl: "", sortOrder: db.photos.length + 1, isVisible: true };
        var u = safeUrl(p.imageUrl);
        return adminLayout("photos",
            '<h1 class="admin-title">' + (p.id ? "Sửa ảnh" : "Thêm ảnh") + "</h1>" +
            '<form id="photoForm" class="form-card admin-form" novalidate><input type="hidden" name="id" value="' + p.id + '" />' +
            (state.errors && state.errors.length ? '<div class="validation"><ul>' + state.errors.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul></div>" : "") +
            '<div class="field"><label>Tiêu đề</label><input name="title" maxlength="200" value="' + esc(p.title) + '" /></div>' +
            '<div class="field"><label>Danh mục</label><select name="category">' +
            EVENT_TYPES.map(function (t) { return '<option value="' + esc(t) + '"' + (t === p.category ? " selected" : "") + ">" + esc(t) + "</option>"; }).join("") + "</select></div>" +
            '<div class="field"><label>Tải ảnh lên (jpg, png, webp, gif – tự thu nhỏ để lưu trong trình duyệt)</label><input type="file" name="file" accept="image/*" /></div>' +
            '<div class="field"><label>Hoặc đường dẫn ảnh</label><input name="imageUrl" placeholder="images/anh.jpg hoặc https://..." value="' + esc(/^data:/.test(p.imageUrl) ? "" : p.imageUrl) + '" />' +
            (u ? '<img class="thumb big" src="' + esc(u) + '" alt="" />' : "") +
            '<input type="hidden" name="keepData" value="' + (/^data:/.test(p.imageUrl) ? esc(p.imageUrl) : "") + '" /></div>' +
            '<div class="field"><label>Thứ tự</label><input name="sortOrder" type="number" value="' + esc(p.sortOrder) + '" /></div>' +
            '<div class="field check"><label><input name="isVisible" type="checkbox"' + (p.isVisible ? " checked" : "") + ' /> Hiển thị trên website</label></div>' +
            '<div class="btn-row"><button class="btn btn-primary" type="submit">Lưu</button><a class="btn btn-ghost" href="#/admin/photos">Hủy</a></div></form>');
    };

    // =====================================================================
    // ROUTER
    // =====================================================================
    var root = document.getElementById("root");

    function parseHash() {
        var h = location.hash.replace(/^#/, "") || "/";
        var parts = h.split("?");
        var q = {};
        (parts[1] || "").split("&").forEach(function (kv) {
            if (!kv) return;
            var i = kv.indexOf("=");
            var k = decodeURIComponent(i < 0 ? kv : kv.slice(0, i));
            q[k] = i < 0 ? "" : decodeURIComponent(kv.slice(i + 1).replace(/\+/g, " "));
        });
        return { path: parts[0].replace(/\/+$/, "") || "/", q: q };
    }

    var DOC_TITLES = {
        "/": "Trang chủ", "/gioi-thieu": "Giới thiệu", "/dich-vu": "Dịch vụ & Bảng giá", "/bang-gia": "Dịch vụ & Bảng giá",
        "/hinh-anh": "Hình ảnh thực tế", "/dat-lich": "Đặt lịch ngay", "/dat-lich-thanh-cong": "Đã gửi yêu cầu", "/lien-he": "Liên hệ"
    };

    var bookState = null;
    function render(extra) {
        var r = parseHash();
        var p = r.path, html, title = DOC_TITLES[p];

        if (p.indexOf("/admin") === 0) {
            title = "Quản trị";
            if (!isAdmin()) html = pages.login(extra && extra.loginError);
            else if (p === "/admin") html = pages.adminBookings(r.q);
            else if (p === "/admin/packages") html = pages.adminPackages();
            else if (p === "/admin/package") html = pages.adminEditPackage(r.q, extra);
            else if (p === "/admin/photos") html = pages.adminPhotos();
            else if (p === "/admin/photo") html = pages.adminEditPhoto(r.q, extra);
            else html = pages.notFound();
        } else if (p === "/") html = pages.home();
        else if (p === "/gioi-thieu") html = pages.about();
        else if (p === "/dich-vu" || p === "/bang-gia") html = pages.services();
        else if (p === "/hinh-anh") html = pages.gallery();
        else if (p === "/dat-lich") html = pages.book(r.q, extra && extra.book ? extra.book : null);
        else if (p === "/dat-lich-thanh-cong") html = pages.success();
        else if (p === "/lien-he") html = pages.contact();
        else { html = pages.notFound(); title = "Không tìm thấy"; }

        root.innerHTML = html;
        document.title = (title ? title + " | " : "") + "Coanhcoem Studio";
        hydrateVisuals(root);
        initGallery();

        if (!extra) {
            if (p === "/bang-gia") {
                var t = document.getElementById("bang-gia");
                if (t) t.scrollIntoView();
            } else window.scrollTo(0, 0);
        }
    }

    // =====================================================================
    // TƯƠNG TÁC
    // =====================================================================
    function initGallery() {
        var gallery = document.getElementById("gallery");
        if (!gallery) return;
        var shots = Array.prototype.slice.call(gallery.querySelectorAll(".shot"));
        var tabs = document.querySelectorAll("[data-filter]");
        var more = document.getElementById("loadMore");
        var PAGE = 12, shown = PAGE, filter = "all";
        var FILTER_KEY = "miumiu.booth.galleryFilter";
        var original = shots.slice();   // thứ tự gốc (dùng cho từng danh mục)
        var order = original;           // thứ tự đang hiển thị

        // Xáo trộn ngẫu nhiên (Fisher–Yates)
        function shuffle(arr) {
            var a = arr.slice();
            for (var i = a.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
            }
            return a;
        }
        // "Tất cả" => xáo ngẫu nhiên mỗi lần; danh mục khác => giữ thứ tự gốc
        function reorder() {
            order = filter === "all" ? shuffle(original) : original;
            order.forEach(function (el) { gallery.appendChild(el); });
        }
        function setActiveTab() {
            Array.prototype.forEach.call(tabs, function (t) {
                t.classList.toggle("active", t.getAttribute("data-filter") === filter);
            });
        }
        // Nhớ danh mục đang xem qua lần tải lại trang
        try {
            var saved = localStorage.getItem(FILTER_KEY);
            if (saved && Array.prototype.some.call(tabs, function (t) { return t.getAttribute("data-filter") === saved; })) filter = saved;
        } catch (e) { /* bỏ qua */ }

        function draw() {
            var visible = 0, total = 0;
            order.forEach(function (el) {
                var match = filter === "all" || el.getAttribute("data-cat") === filter;
                if (!match) { el.hidden = true; return; }
                total++;
                el.hidden = visible >= shown;
                if (!el.hidden) visible++;
            });
            if (more) more.hidden = total <= shown;
        }
        // Ảnh không tải được (file đã xóa / sai tên) thì tự ẩn khỏi thư viện
        function dropBroken(img) {
            var el = img.closest(".shot");
            if (!el) return;
            original = original.filter(function (x) { return x !== el; });
            order = order.filter(function (x) { return x !== el; });
            el.remove();
            draw();
        }
        shots.forEach(function (el) {
            var img = el.querySelector("img");
            if (!img) return;
            if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) dropBroken(img);
            else img.addEventListener("error", function () { dropBroken(img); });
        });
        Array.prototype.forEach.call(tabs, function (tab) {
            tab.addEventListener("click", function () {
                filter = tab.getAttribute("data-filter");
                try { localStorage.setItem(FILTER_KEY, filter); } catch (e) { /* bỏ qua */ }
                shown = PAGE;
                setActiveTab();
                reorder();
                draw();
            });
        });
        if (more) more.addEventListener("click", function () { shown += PAGE; draw(); });
        gallery.addEventListener("click", function (e) {
            var shot = e.target.closest(".shot");
            var src = shot && shot.getAttribute("data-full");
            if (!src) return;
            var box = document.createElement("div");
            box.className = "lightbox";
            var img = document.createElement("img");
            img.src = src; img.alt = "";
            box.appendChild(img);
            function onKey(ev) { if (ev.key === "Escape") close(); }
            function close() { document.removeEventListener("keydown", onKey); box.remove(); }
            box.addEventListener("click", close);
            document.addEventListener("keydown", onKey);
            document.body.appendChild(box);
        });
        setActiveTab();
        reorder();
        draw();
    }

    function validateBooking(f) {
        var e = {};
        if (!f.fullName.trim()) e.fullName = "Vui lòng nhập họ và tên";
        if (!f.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
        else if (!/^(\+84|0)[0-9\s.\-]{8,12}$/.test(f.phone.trim())) e.phone = "Số điện thoại không hợp lệ";
        if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Email không hợp lệ";
        if (!f.eventDate) e.eventDate = "Vui lòng chọn ngày tổ chức";
        else if (f.eventDate < todayStr()) e.eventDate = "Ngày tổ chức không được ở quá khứ";
        if (!f.location.trim()) e.location = "Vui lòng nhập địa điểm";
        if (!f.eventType) e.eventType = "Vui lòng chọn loại sự kiện";
        else if (EVENT_TYPES.indexOf(f.eventType) < 0) e.eventType = "Loại sự kiện không hợp lệ";
        return e;
    }

    function formValues(form) {
        var o = {};
        Array.prototype.forEach.call(form.elements, function (el) {
            if (!el.name) return;
            o[el.name] = el.type === "checkbox" ? el.checked : el.value;
        });
        return o;
    }

    // Thu nhỏ ảnh tải lên để vừa bộ nhớ trình duyệt (tối đa ~1000px, JPEG).
    function shrinkImage(file, cb, fail) {
        var reader = new FileReader();
        reader.onerror = function () { fail("Không đọc được file ảnh"); };
        reader.onload = function () {
            var img = new Image();
            img.onerror = function () { fail("File không phải ảnh hợp lệ"); };
            img.onload = function () {
                var max = 1000, s = Math.min(1, max / Math.max(img.width, img.height));
                var c = document.createElement("canvas");
                c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
                c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
                cb(c.toDataURL("image/jpeg", 0.8));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }

    function downloadCsv() {
        function cell(v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""').replace(/^([=+\-@])/, "'$1") + '"'; }
        var rows = [["Ngày gửi", "Họ tên", "SĐT", "Email", "Ngày tổ chức", "Địa điểm", "Loại sự kiện", "Gói", "Ghi chú", "Trạng thái"]];
        db.bookings.forEach(function (b) {
            var p = db.packages.filter(function (x) { return x.id === b.packageId; })[0];
            rows.push([fmtDateTime(b.createdAt), b.fullName, b.phone, b.email, fmtDate(b.eventDate), b.location, b.eventType, p ? p.name : "Cần tư vấn", b.notes, b.status]);
        });
        var csv = "﻿" + rows.map(function (r) { return r.map(cell).join(","); }).join("\r\n");
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        a.download = "yeu-cau-dat-lich.csv";
        document.body.appendChild(a); a.click(); a.remove();
    }

    // ----- Sự kiện (ủy quyền) -----
    document.addEventListener("click", function (e) {
        var t = e.target;
        // Menu di động
        var tg = t.closest(".menu-toggle");
        if (tg) {
            var links = document.getElementById("navLinks");
            var open = links.classList.toggle("open");
            tg.setAttribute("aria-expanded", open ? "true" : "false");
            return;
        }
        if (t.closest("#navLinks a")) {
            var l = document.getElementById("navLinks");
            if (l) l.classList.remove("open");
        }

        var btn = t.closest("[data-action]");
        if (!btn || btn.tagName === "SELECT") return;
        var act = btn.getAttribute("data-action"), id = Number(btn.getAttribute("data-id"));

        if (act === "logout") { try { sessionStorage.removeItem(AUTH_KEY); } catch (x) {} location.hash = "#/admin"; render(); }
        else if (act === "export-csv") downloadCsv();
        else if (act === "del-booking" && confirm("Xóa yêu cầu này?")) {
            db.bookings = db.bookings.filter(function (b) { return b.id !== id; }); save(); render({});
        } else if (act === "del-package" && confirm("Xóa gói này?")) {
            db.packages = db.packages.filter(function (p) { return p.id !== id; });
            db.bookings.forEach(function (b) { if (b.packageId === id) b.packageId = null; });
            save(); render({});
        } else if (act === "del-photo" && confirm("Xóa ảnh này?")) {
            db.photos = db.photos.filter(function (p) { return p.id !== id; }); save(); render({});
        }
    });

    document.addEventListener("change", function (e) {
        var el = e.target;
        if (el.getAttribute && el.getAttribute("data-action") === "set-status" && isAdmin()) {
            var b = db.bookings.filter(function (x) { return x.id === Number(el.getAttribute("data-id")); })[0];
            if (b && STATUSES.indexOf(el.value) >= 0) { b.status = el.value; save(); render({}); }
        }
    });

    document.addEventListener("submit", function (e) {
        var form = e.target;
        var fid = form.getAttribute && form.getAttribute("id"); // không dùng form.id (bị input name="id" che)
        if (!fid) return;
        e.preventDefault();
        var v = formValues(form);

        if (fid === "loginForm") {
            if (v.username === ADMIN.username && v.password === ADMIN.password) {
                try { sessionStorage.setItem(AUTH_KEY, "1"); } catch (x) {}
                render();
            } else render({ loginError: "Sai tên đăng nhập hoặc mật khẩu." });
        }

        else if (fid === "bookForm") {
            if (v.website) { location.hash = "#/dat-lich-thanh-cong"; return; } // bot
            var errors = validateBooking(v);
            var pid = v.packageId ? Number(v.packageId) : null;
            if (pid && !activePackages().some(function (p) { return p.id === pid; })) errors.packageId = "Gói dịch vụ không hợp lệ";
            if (Object.keys(errors).length) { render({ book: { values: v, errors: errors } }); return; }
            db.bookings.push({
                id: nextId(db.bookings), fullName: v.fullName.trim(), phone: v.phone.trim(), email: v.email.trim(),
                eventDate: v.eventDate, location: v.location.trim(), eventType: v.eventType, packageId: pid,
                notes: v.notes.trim(), status: "Mới", createdAt: new Date().toISOString()
            });
                        if (SITE.BookingEndpoint) {
                var pk = db.packages.filter(function (x) { return x.id === pid; })[0];
                fetch(SITE.BookingEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                        _subject: "Đặt lịch mới: " + v.fullName.trim() + " – " + v.eventType,
                        "Họ tên": v.fullName.trim(),
                        "Điện thoại": v.phone.trim(),
                        "Email": v.email.trim(),
                        "Ngày tổ chức": v.eventDate,
                        "Địa điểm": v.location.trim(),
                        "Loại sự kiện": v.eventType,
                        "Gói": pk ? pk.name : "Chưa chọn (cần tư vấn)",
                        "Ghi chú": v.notes.trim()
                    }),
                    keepalive: true
                }).catch(function () { /* không chặn khách nếu gửi mail lỗi */ });
            }
            if (!save()) { db.bookings.pop(); render({ book: { values: v, errors: {}, general: "Không lưu được yêu cầu (trình duyệt chặn lưu trữ). Vui lòng liên hệ qua hotline/Zalo." } }); return; }
            location.hash = "#/dat-lich-thanh-cong";
        }

        else if (fid === "packageForm" && isAdmin()) {
            var errs = [];
            var pkg = {
                id: Number(v.id) || 0, name: v.name.trim(), description: v.description.trim(), price: Number(v.price) || 0,
                isCustomPrice: !!v.isCustomPrice, badge: v.badge.trim(), durationHours: Number(v.durationHours) || 0,
                features: v.features, sortOrder: Number(v.sortOrder) || 0, featured: !!v.featured, isActive: !!v.isActive
            };
            if (!pkg.name) errs.push("Vui lòng nhập tên gói");
            if (pkg.price < 0 || pkg.price > 1e9) errs.push("Giá không hợp lệ");
            if (pkg.durationHours < 0 || pkg.durationHours > 24) errs.push("Số giờ thuê phải từ 0 đến 24");
            if (errs.length) { render({ values: pkg, errors: errs }); return; }
            if (!pkg.id) { pkg.id = nextId(db.packages); db.packages.push(pkg); }
            else { var i = db.packages.findIndex(function (x) { return x.id === pkg.id; }); if (i >= 0) db.packages[i] = pkg; else db.packages.push(pkg); }
            save(); location.hash = "#/admin/packages";
        }

        else if (fid === "photoForm" && isAdmin()) {
            var file = form.elements.file && form.elements.file.files[0];
            var photo = {
                id: Number(v.id) || 0, title: v.title.trim(), category: v.category, imageUrl: v.imageUrl.trim() || v.keepData || "",
                sortOrder: Number(v.sortOrder) || 0, isVisible: !!v.isVisible
            };
            function finish() {
                var errs = [];
                if (!photo.title) errs.push("Vui lòng nhập tiêu đề");
                if (EVENT_TYPES.indexOf(photo.category) < 0) errs.push("Danh mục không hợp lệ");
                if (photo.imageUrl && !safeUrl(photo.imageUrl)) errs.push("Chỉ chấp nhận đường dẫn images/..., /... hoặc https://");
                if (errs.length) { render({ values: photo, errors: errs }); return; }
                var backup = JSON.stringify(db.photos);
                if (!photo.id) { photo.id = nextId(db.photos); db.photos.push(photo); }
                else { var i = db.photos.findIndex(function (x) { return x.id === photo.id; }); if (i >= 0) db.photos[i] = photo; else db.photos.push(photo); }
                if (!save()) {
                    db.photos = JSON.parse(backup);
                    render({ values: photo, errors: ["Bộ nhớ trình duyệt đã đầy – hãy dùng ảnh nhỏ hơn hoặc xóa bớt ảnh cũ."] });
                    return;
                }
                location.hash = "#/admin/photos";
            }
            if (file) {
                if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) { render({ values: photo, errors: ["Chỉ cho phép ảnh .jpg, .png, .webp, .gif"] }); return; }
                if (file.size > 10 * 1024 * 1024) { render({ values: photo, errors: ["Ảnh tối đa 10MB"] }); return; }
                shrinkImage(file, function (dataUrl) { photo.imageUrl = dataUrl; finish(); },
                    function (msg) { render({ values: photo, errors: [msg] }); });
            } else finish();
        }
    });

    window.addEventListener("hashchange", function () { render(); });
    render();
})();