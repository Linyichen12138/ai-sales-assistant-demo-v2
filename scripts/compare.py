# 生成定稿 vs 实现对比图：python3 scripts/compare.py [UI-01 ...] → screenshots/compare/UI-xx.png
import glob, os, sys
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UI = os.path.join(ROOT, '..', 'UI', '出图')
font = None
for f in ['/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', '/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc'] + glob.glob('/usr/share/fonts/**/*CJK*.tt*', recursive=True):
    if os.path.exists(f): font = ImageFont.truetype(f, 34); break
ids = sys.argv[1:] or [os.path.basename(p)[:5] for p in sorted(glob.glob(os.path.join(ROOT, 'screenshots/impl/UI-*.png')))]
for i in ids:
    d = glob.glob(os.path.join(UI, i + '_*.png'))[0]
    a = Image.open(d).convert('RGB'); b = Image.open(os.path.join(ROOT, 'screenshots/impl', i + '.png')).convert('RGB')
    b = b.resize(a.size)
    pc = a.width > a.height
    H = 60
    if pc:  # 上下排列
        out = Image.new('RGB', (a.width, a.height * 2 + H * 2), 'white')
        out.paste(a, (0, H)); out.paste(b, (0, a.height + H * 2))
        pos = [(16, 10), (16, a.height + H + 10)]
    else:  # 左右排列
        out = Image.new('RGB', (a.width * 2 + 20, a.height + H), 'white')
        out.paste(a, (0, H)); out.paste(b, (a.width + 20, H))
        pos = [(16, 10), (a.width + 36, 10)]
    dr = ImageDraw.Draw(out)
    dr.text(pos[0], f'{os.path.basename(d)[:-4]} · 定稿', fill='#E5484D', font=font)
    dr.text(pos[1], f'{i} · 实现', fill='#3B6BFF', font=font)
    out.save(os.path.join(ROOT, 'screenshots/compare', i + '.png'), optimize=True)
    # 预览用缩略图
    os.makedirs('/tmp/cmp', exist_ok=True)
    out.resize((out.width // 2, out.height // 2)).save(f'/tmp/cmp/{i}.png')
    print('compare', i)
