#!/usr/bin/env python3
"""Rebuild the approved DLD photo gallery and partner-logo collection."""

import json
import re
import shutil
from pathlib import Path

from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True
ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
STAGING = ROOT.parent / "staging"
PHOTO_ROOT = STAGING / "photos"
LOGO_ROOT = STAGING / "logos" / "ParaSite"


def natural_key(path: Path):
    return [int(piece) if piece.isdigit() else piece.casefold()
            for piece in re.split(r"(\d+)", path.name)]


def image_files(directory: Path):
    return sorted(
        (path for path in directory.rglob("*")
         if path.is_file() and path.suffix.casefold() in {".jpg", ".jpeg", ".png", ".webp"}),
        key=natural_key,
    )


def numbered(path: Path):
    values = re.findall(r"\d+", path.stem)
    return int(values[-1]) if values else 0


def vertical_index(path: Path):
    match = re.search(r"Verticais_(\d+)", path.name, re.IGNORECASE)
    return int(match.group(1)) if match else numbered(path)


def build_gallery():
    part1 = image_files(PHOTO_ROOT / "part1a") + image_files(PHOTO_ROOT / "part1b")
    part2 = image_files(PHOTO_ROOT / "part2-recover")
    part3 = image_files(PHOTO_ROOT / "part3")

    part2 = [path for path in part2 if numbered(path) != 3]
    recovered = PHOTO_ROOT / "part2-recover" / "bad-photo-3.jpg"
    part2.append(recovered)
    part2.sort(key=natural_key)

    expected = (98, 39, 69)
    actual = (len(part1), len(part2), len(part3))
    if actual != expected:
        raise RuntimeError(f"Unexpected photo counts: {actual}; expected {expected}")

    # Keep the three latest folders separated exactly as they were delivered.
    eras = {
        "early": part1,
        "expansion": part2,
        "current": part3,
    }

    out = DIST / "assets" / "gallery"
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    gallery = {}
    index = 1
    for era, files in eras.items():
        gallery[era] = []
        for source in files:
            with Image.open(source) as image:
                image.load()
                image = image.convert("RGB")
                image.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
                # A versioned filename prevents browsers from reusing yesterday's
                # cached gallery images after the complete replacement.
                name = f"dld-ultimas-pastas-20260921-{index:03d}.webp"
                target = out / name
                temporary = out / f".{name}.tmp"
                image.save(temporary, "WEBP", quality=82, method=4)
                with Image.open(temporary) as check:
                    check.verify()
                temporary.replace(target)
            gallery[era].append(name)
            index += 1
    if index - 1 != 206:
        raise RuntimeError(f"Gallery contains {index - 1} photos instead of 206")
    return gallery


def build_partners():
    sources = image_files(LOGO_ROOT)
    if len(sources) != 96:
        raise RuntimeError(f"Logo folder contains {len(sources)} files instead of 96")
    names = [path.name for path in sources]
    if len(set(names)) != 96:
        raise RuntimeError("Duplicate logo filenames found")
    legacy = DIST / "assets" / "partners"
    if legacy.exists():
        shutil.rmtree(legacy)
    out = DIST / "assets" / "partners-display"
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    for source in sources:
        shutil.copy2(source, out / source.name)
    return names


def main():
    content_path = DIST / "assets" / "content.json"
    content = json.loads(content_path.read_text(encoding="utf-8"))
    content["partners"] = build_partners()
    content["gallery"] = build_gallery()
    content_path.write_text(json.dumps(content, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print({"partners": len(content["partners"]),
           "gallery": {name: len(files) for name, files in content["gallery"].items()}})


if __name__ == "__main__":
    main()
