"""从 UI/出图 定稿 PNG 裁切 3D 图标/插画（第 3 轮）。
用法：python3 scripts/crops.py   → 输出 src/assets/crops/*.webp（构建时内联进单文件 dist）
unmatte：已知背景色（取裁切框角点）反推 alpha，去掉卡片底色，便于贴到任意底色上。
注意：只裁图形，不带任何框架文字。"""
from pathlib import Path
from PIL import Image
import numpy as np

SRC = Path(__file__).resolve().parents[2] / 'UI' / '出图'
OUT = Path(__file__).resolve().parents[1] / 'src' / 'assets' / 'crops'
OUT.mkdir(parents=True, exist_ok=True)

# name, 定稿文件前缀, box(x0,y0,x1,y1), 输出边长, unmatte?（False=保留白卡片底，直接贴在白卡片上）
CROPS = [
    ('sparkle-lg', 'UI-23', (70, 1300, 180, 1410), 96, True),
    ('m-logic',    'UI-08', (44, 622, 134, 710), 88, False),
    ('m-layers',   'UI-08', (44, 972, 134, 1062), 88, False),
    ('m-target',   'UI-08', (44, 1276, 134, 1366), 88, False),
    ('star',       'UI-09', (562, 722, 614, 772), 48, True),
    ('sparkle-sm', 'UI-09', (60, 1150, 112, 1202), 48, True),
    ('bell',       'UI-17', (105, 488, 205, 582), 0, 'white'),
    ('doc',        'UI-17', (122, 950, 190, 1030), 64, True),
    ('min-1',      'UI-24', (56, 1140, 142, 1226), 80, False),
    ('min-2',      'UI-24', (56, 1268, 142, 1354), 80, False),
    ('min-3',      'UI-24', (56, 1396, 142, 1482), 80, False),
    ('note',       'UI-24', (84, 896, 126, 950), 40, True),
    # C-01 / C-03 卡片标题 3D 图标（白卡片底，unmatte 去白）
    ('c01-visit',  'UI-01', (53, 375, 100, 422), 64, True),
    ('c01-todo',   'UI-01', (51, 727, 99, 775), 64, True),
    ('c01-risk',   'UI-01', (52, 1040, 99, 1087), 64, True),
    ('c01-recent', 'UI-01', (53, 1248, 100, 1295), 64, True),
    ('c03-known',  'UI-06', (49, 298, 105, 354), 64, True),
    ('c03-ask',    'UI-06', (49, 500, 105, 556), 64, True),
    ('c03-prep',   'UI-06', (49, 840, 105, 896), 64, True),
    ('c03-open',   'UI-06', (49, 1107, 105, 1164), 64, True),
    ('c03-strat',  'UI-06', (49, 1343, 105, 1400), 64, True),
    ('tag-home',   'UI-06', (70, 387, 104, 421), 40, True),
    ('tag-child',  'UI-06', (261, 386, 299, 422), 40, True),
    ('tag-coin',   'UI-06', (474, 386, 506, 422), 40, True),
]

def unmatte(a, bg):
    c = a[..., :3].astype(np.float32); bg = np.array(bg, np.float32)
    # 每个通道所需最小 alpha：c = bg + α(fg-bg)，fg∈[0,255]
    up = np.where(c > bg, (c - bg) / 255.0, 0)  # 比底色更亮的只可能是噪点/高光，弱化
    dn = np.where(c < bg, (bg - c) / np.maximum(bg, 1), 0)
    al = np.clip(np.maximum(up, dn).max(-1), 0, 1)
    al = np.clip((al - 0.22) / 0.78, 0, 1)  # 软阈值，去掉定稿背景的噪点/渐变
    fg = bg + (c - bg) / np.maximum(al[..., None], 1e-3)
    return np.dstack([np.clip(fg, 0, 255), al * 255]).astype(np.uint8)

def white_on(a):
    # 白色图形压在彩色底上：用 R 通道相对底色的提升作为 alpha
    c = a[..., :3].astype(np.float32)
    bgR = np.percentile(c[..., 0], 10)
    al = np.clip((c[..., 0] - bgR) / (255 - bgR), 0, 1)
    al = np.where(al < 0.08, 0, al)
    return np.dstack([np.full(c.shape[:2] + (3,), 255, np.float32), al * 255]).astype(np.uint8)

for name, pre, box, size, mode in CROPS:
    f = next(SRC.glob(pre + '_*.png'))
    im = Image.open(f).convert('RGB').crop(box)
    a = np.array(im)
    if mode == 'white':
        a = white_on(a)
    elif mode:
        corners = np.array([a[1, 1], a[1, -2], a[-2, 1], a[-2, -2]], np.float32)
        a = unmatte(a, np.median(corners, 0))
    out = Image.fromarray(a, 'RGBA' if a.shape[-1] == 4 else 'RGB')
    if size:
        out.thumbnail((size, size), Image.LANCZOS)
    p = OUT / f'{name}.webp'
    out.save(p, 'WEBP', quality=88, method=6)
    print(name, out.size, p.stat().st_size, 'B')
