#!/usr/bin/env python3
"""
Generate a multi-resolution icon.ico from logo.png.
Run this before building the installer.
"""
from PIL import Image
from pathlib import Path
import sys

src = Path(__file__).parent / 'logo.png'
dst = Path(__file__).parent / 'icon.ico'

if not src.exists():
    print(f"[ERROR] logo.png not found at {src}")
    sys.exit(1)

print("Generating icon.ico ...")

img = Image.open(str(src)).convert('RGBA')

# Remove white background
pix = img.load()
for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pix[x, y]
        if r > 230 and g > 230 and b > 230:
            pix[x, y] = (r, g, b, 0)

# Generate all standard Windows icon sizes
sizes = [256, 128, 64, 48, 32, 16]
frames = [img.resize((s, s), Image.LANCZOS) for s in sizes]

frames[0].save(
    str(dst),
    format='ICO',
    sizes=[(s, s) for s in sizes],
    append_images=frames[1:]
)

print(f"icon.ico created — {len(sizes)} sizes: {', '.join(str(s) for s in sizes)}px")
