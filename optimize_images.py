# Thu nhỏ + nén ảnh trong thư mục images/ (giữ nguyên tên file, không cần sửa code web).
# Cách chạy (trong thư mục MiuMiuBooth):   pip install pillow    rồi    python optimize_images.py
# Ảnh gốc được sao lưu sang thư mục ../images_goc (nằm NGOÀI project nên không bị đẩy lên GitHub).
import shutil
from pathlib import Path
from PIL import Image, ImageOps

MAX_SIZE = 1600      # cạnh dài tối đa (px). Ảnh nền/ảnh lớn có thể để 1920
JPEG_QUALITY = 80    # 75-85 là hợp lý

src = Path("images")
bak = Path("..") / "images_goc"
bak.mkdir(exist_ok=True)

total_before = total_after = 0
for f in sorted(src.iterdir()):
    ext = f.suffix.lower()
    if ext not in (".jpg", ".jpeg", ".png"):
        continue
    before = f.stat().st_size
    if not (bak / f.name).exists():
        shutil.copy2(f, bak / f.name)
    im = Image.open(f)
    im = ImageOps.exif_transpose(im)
    im.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
    tmp = f.with_name(f.stem + ".tmp" + ext)
    if ext == ".png":
        im.save(tmp, "PNG", optimize=True)          # giữ nền trong suốt (logo)
    else:
        im.convert("RGB").save(tmp, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    after = tmp.stat().st_size
    if after < before:
        tmp.replace(f)
    else:
        tmp.unlink()
        after = before
    total_before += before
    total_after += after
    print(f"{f.name:35s} {before//1024:6d} KB -> {after//1024:6d} KB")

print(f"\nTỔNG: {total_before//1024} KB -> {total_after//1024} KB")
