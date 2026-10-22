"""Pack the four illustrated heroes into isolated ten-pose horizontal sheets."""
from pathlib import Path
from PIL import Image
from collections import deque
import os
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'tools' / 'source-art'
OUT = ROOT / 'dist' / 'assets'
CELL_W, CELL_H = 320, 360
POSES = ['walk', 'eat', 'sleep', 'read', 'attack', 'magic', 'shield', 'sit', 'play', 'win']
CENTERS = {
    'knight': [100, 280, 500, 700, 895, 1130, 1355, 1570, 1770, 2025],
    'mage': [105, 295, 500, 690, 900, 1125, 1355, 1560, 1770, 2010],
    'scholar': [105, 290, 500, 700, 905, 1140, 1360, 1570, 1775, 2025],
    'ranger': [110, 300, 515, 710, 905, 1130, 1350, 1560, 1770, 2025],
}

def keep_main_figure(frame):
    """Discard disconnected pieces of a neighbour from a source strip."""
    alpha = frame.getchannel('A')
    w, h = frame.size
    samples = alpha.load()
    seen = bytearray(w * h)
    biggest = []
    for y in range(h):
        for x in range(w):
            pos = y * w + x
            if seen[pos] or samples[x, y] < 70:
                continue
            q = deque([pos]); seen[pos] = 1; component = []
            while q:
                p = q.popleft(); component.append(p)
                px, py = p % w, p // w
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        np = ny * w + nx
                        if not seen[np] and samples[nx, ny] >= 70:
                            seen[np] = 1; q.append(np)
            if len(component) > len(biggest):
                biggest = component
    # Expand the retained component by a few pixels to retain antialiasing.
    mask = Image.new('L', (w, h)); pixels = mask.load()
    for p in biggest:
        x, y = p % w, p // w
        for dx in (-2, -1, 0, 1, 2):
            for dy in (-2, -1, 0, 1, 2):
                if 0 <= x + dx < w and 0 <= y + dy < h:
                    pixels[x + dx, y + dy] = samples[x + dx, y + dy]
    frame.putalpha(mask)
    return frame

for hero, centers in CENTERS.items():
    art = Image.open(SOURCE / f'hero-{hero}-ten-poses-source.png').convert('RGBA')
    if art.size != (2172, 724):
        raise ValueError(f'{hero}: unexpected source size {art.size}')
    strip = Image.new('RGBA', (CELL_W * 10, CELL_H))
    for i, pose in enumerate(POSES):
        center = centers[i]
        radius = 220 if (hero, pose) in {('knight', 'play'), ('ranger', 'attack')} else 170
        frame = art.crop((max(0, center - radius), 0, min(art.width, center + radius), art.height))
        if hero == 'mage' and pose == 'magic':
            # The source attack cape intrudes into the magic panel's far left.
            frame.paste((0, 0, 0, 0), (0, 0, 100, frame.height))
        frame = keep_main_figure(frame)
        alpha = frame.getchannel('A').point(lambda a: 255 if a >= 25 else 0)
        bounds = alpha.getbbox()
        if bounds is None:
            raise ValueError(f'{hero}: empty {pose} pose')
        frame = frame.crop(bounds)
        frame.thumbnail((CELL_W - 48, CELL_H - 28), Image.Resampling.LANCZOS)
        # Every cell owns its pixels; a 24px transparent gutter remains on both sides.
        left = i * CELL_W + (CELL_W - frame.width) // 2
        top = CELL_H - 15 - frame.height
        strip.alpha_composite(frame, (left, top))
    dest = OUT / f'hero-{hero}-ten-poses.png'
    with tempfile.NamedTemporaryFile(dir=OUT, suffix='.png', delete=False) as temp:
        temporary = Path(temp.name)
        strip.save(temp, format='PNG', optimize=True)
        temp.flush(); os.fsync(temp.fileno())
    temporary.replace(dest)
    print(f'{dest.name}: {strip.width} x {strip.height}')
