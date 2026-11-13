/* Nút "Thêm ảnh" cho trang Hình ảnh thực tế.
   Mật khẩu = mã truy cập GitHub (token) chỉ có quyền ghi vào kho này. Mã được gõ khi dùng, KHÔNG nằm trong code,
   chỉ giữ trong bộ nhớ trang (tải lại trang là mất). Ảnh được thu nhỏ rồi đưa thẳng vào thư mục images/ của kho. */
(function () {
    "use strict";
    var CFG = {
        owner: "phuongthao2139-ux",
        repo: "Coanhcoemstudio.github.io",
        branch: "main",
        extraPath: "gallery-extra.js",   // danh sách ảnh thêm từ web
        imgDir: "images",
        maxSide: 1600,                   // cạnh dài tối đa (px)
        quality: 0.8,
        apiBase: "https://api.github.com"
    };
    var CATS = ["Tiệc cưới", "Doanh nghiệp", "Sinh nhật", "Sự kiện"];
    var token = "";

    // ---------- giao diện ----------
    var st = document.createElement("style");
    st.textContent =
        ".upload-bar{display:flex;justify-content:center;margin:-8px 0 18px}" +
        ".upm{position:fixed;inset:0;z-index:120;background:rgba(18,48,31,.8);display:grid;place-items:center;padding:16px}" +
        ".upm-card{position:relative;width:min(460px,100%);max-height:92vh;overflow:auto;background:var(--cream,#faf7ea);border-radius:20px;padding:22px 20px 18px;box-shadow:0 20px 50px rgba(0,0,0,.35);text-align:left}" +
        ".upm-card h3{margin:0 36px 12px 0;color:var(--forest-600,#24563b)}" +
        ".upm-x{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;border:0;background:var(--forest-500,#2f6b4b);color:#fff;font-size:1.1rem;cursor:pointer}" +
        ".upm-card label{display:block;font-weight:700;font-size:.85rem;margin:10px 0 4px;color:var(--muted,#3d4a38)}" +
        ".upm-card input,.upm-card select{width:100%;padding:11px 12px;border:1.5px solid var(--olive-200,#cbcfae);border-radius:12px;font:500 1rem inherit;background:#fff}" +
        ".upm-msg{margin:12px 0 0;font-size:.9rem;min-height:1.2em}.upm-msg.err{color:#c62353}.upm-msg.ok{color:var(--forest-600,#24563b);font-weight:700}" +
        ".upm-row{display:flex;gap:10px;margin-top:14px}.upm-row .btn{flex:1}";
    document.head.appendChild(st);

    function inject() {
        var g = document.getElementById("gallery");
        if (!g || document.getElementById("addPhotoBtn")) return;
        var bar = document.createElement("div");
        bar.className = "upload-bar";
        bar.innerHTML = '<button type="button" class="btn btn-soft btn-sm" id="addPhotoBtn">＋ Thêm ảnh</button>';
        g.parentNode.insertBefore(bar, g);
    }
    new MutationObserver(inject).observe(document.documentElement, { childList: true, subtree: true });
    inject();

    document.addEventListener("click", function (e) {
        if (e.target.closest("#addPhotoBtn")) openModal();
    });

    function openModal() {
        var box = document.createElement("div");
        box.className = "upm";
        box.innerHTML =
            '<form class="upm-card" role="dialog" aria-modal="true" aria-label="Thêm ảnh">' +
            '<button type="button" class="upm-x" aria-label="Đóng">✕</button><h3>Thêm ảnh mới</h3>' +
            '<label for="upPass">Mật khẩu</label><input id="upPass" type="password" autocomplete="new-password" placeholder="Nhập mật khẩu quản lý" />' +
            '<label for="upCat">Danh mục</label><select id="upCat">' + CATS.map(function (c) { return "<option>" + c + "</option>"; }).join("") + "</select>" +
            '<label for="upFiles">Chọn ảnh (được chọn nhiều ảnh)</label><input id="upFiles" type="file" accept="image/*" multiple />' +
            '<p class="upm-msg" id="upMsg" aria-live="polite"></p>' +
            '<div class="upm-row"><button type="button" class="btn btn-ghost" data-cancel>Hủy</button><button type="submit" class="btn btn-primary" id="upGo">Tải lên</button></div></form>';
        document.body.appendChild(box);
        var passEl = box.querySelector("#upPass"), msg = box.querySelector("#upMsg"), go = box.querySelector("#upGo"), busy = false;
        if (token) passEl.value = token;
        passEl.focus();
        function say(t, cls) { msg.textContent = t; msg.className = "upm-msg " + (cls || ""); }
        function close() { if (busy) return; document.removeEventListener("keydown", onKey); box.remove(); }
        function onKey(ev) { if (ev.key === "Escape") close(); }
        document.addEventListener("keydown", onKey);
        box.addEventListener("click", function (ev) { if (ev.target === box || ev.target.closest(".upm-x") || ev.target.closest("[data-cancel]")) close(); });
        box.querySelector("form").addEventListener("submit", function (ev) {
            ev.preventDefault();
            if (busy) return;
            var files = Array.prototype.slice.call(box.querySelector("#upFiles").files || []);
            var pw = passEl.value.trim();
            if (!pw) return say("Vui lòng nhập mật khẩu", "err");
            if (!files.length) return say("Vui lòng chọn ít nhất 1 ảnh", "err");
            busy = true; go.disabled = true; token = pw;
            run(files, box.querySelector("#upCat").value, function (t) { say(t); })
                .then(function (n) { say("Đã thêm " + n + " ảnh. Trang sẽ hiện ảnh mới sau khoảng 1–2 phút (khi GitHub cập nhật xong).", "ok"); box.querySelector("#upFiles").value = ""; })
                .catch(function (err) { if (err && err.bad) token = ""; say(err && err.message ? err.message : "Có lỗi, vui lòng thử lại", "err"); })
                .then(function () { busy = false; go.disabled = false; });
        });
    }

    // ---------- GitHub ----------
    function api(method, path, body) {
        return fetch(CFG.apiBase + "/repos/" + CFG.owner + "/" + CFG.repo + path, {
            method: method,
            headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined
        }).then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, json: j }; });
        }, function () { throw new Error("Không kết nối được mạng. Vui lòng kiểm tra Internet."); });
    }
    function fail(r) {
        var e;
        if (r.status === 401) { e = new Error("Sai mật khẩu."); e.bad = true; }
        else if (r.status === 403 || r.status === 404) { e = new Error("Mật khẩu không có quyền thêm ảnh vào trang này."); e.bad = true; }
        else e = new Error((r.json && r.json.message) || "Lỗi " + r.status);
        return e;
    }
    function b64text(t) { return btoa(unescape(encodeURIComponent(t))); }

    function readImage(file) {
        return new Promise(function (res, rej) {
            var url = URL.createObjectURL(file), img = new Image();
            img.onload = function () { URL.revokeObjectURL(url); res(img); };
            img.onerror = function () { URL.revokeObjectURL(url); rej(new Error("Không đọc được ảnh: " + file.name)); };
            img.src = url;
        });
    }
    function toJpegBase64(img) {
        var w = img.naturalWidth, h = img.naturalHeight, s = Math.min(1, CFG.maxSide / Math.max(w, h));
        var c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w * s)); c.height = Math.max(1, Math.round(h * s));
        var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        return c.toDataURL("image/jpeg", CFG.quality).split(",")[1];
    }

    function readExtra() {
        return api("GET", "/contents/" + CFG.extraPath + "?ref=" + CFG.branch).then(function (r) {
            if (r.status === 404) return { list: [], sha: null };
            if (!r.ok) throw fail(r);
            var text = decodeURIComponent(escape(atob(String(r.json.content).replace(/\s/g, ""))));
            var m = /=\s*(\[[\s\S]*\])\s*;?\s*$/.exec(text.trim()), list = [];
            try { list = m ? JSON.parse(m[1]) : []; } catch (e) { throw new Error("File gallery-extra.js bị sai định dạng."); }
            return { list: list, sha: r.json.sha };
        });
    }
    function saveExtra(entries, tries) {
        return readExtra().then(function (cur) {
            var list = cur.list.concat(entries);
            var body = { message: "Thêm ảnh từ web (" + entries.length + ")", branch: CFG.branch,
                content: b64text("window.GALLERY_EXTRA = " + JSON.stringify(list, null, 2) + ";\n") };
            if (cur.sha) body.sha = cur.sha;
            return api("PUT", "/contents/" + CFG.extraPath, body);
        }).then(function (r) {
            if (r.ok) return;
            if (r.status === 409 && tries > 0) return saveExtra(entries, tries - 1);
            throw fail(r);
        });
    }

    function run(files, cat, say) {
        say("Đang kiểm tra mật khẩu...");
        return api("GET", "").then(function (r) {
            if (!r.ok) throw fail(r);
            if (r.json && r.json.permissions && r.json.permissions.push === false) { var e = new Error("Mật khẩu không có quyền thêm ảnh vào trang này."); e.bad = true; throw e; }
            var stamp = Date.now().toString(36), entries = [], chain = Promise.resolve();
            files.forEach(function (f, i) {
                chain = chain.then(function () {
                    say("Đang tải ảnh " + (i + 1) + "/" + files.length + "...");
                    return readImage(f).then(function (img) {
                        var name = "up" + stamp + (i + 1) + ".jpg";
                        return api("PUT", "/contents/" + CFG.imgDir + "/" + name, { message: "Thêm ảnh " + name, branch: CFG.branch, content: toJpegBase64(img) })
                            .then(function (rr) { if (!rr.ok) throw fail(rr); entries.push({ file: name, cat: cat, title: cat + " " + (i + 1) }); });
                    });
                });
            });
            return chain.then(function () { say("Đang cập nhật thư viện..."); return saveExtra(entries, 3); }).then(function () { return entries.length; });
        });
    }
})();
