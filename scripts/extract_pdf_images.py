#!/usr/bin/env python3
"""
Procesa todas las imágenes extraídas de LIBRO-DEL-NUEVO-CONDUCTOR-AUTOMOVILISTAS_2026.pdf:
1. Combina cada imagen RGB/Indexada con su máscara de transparencia (smask) sobre fondo blanco limpio.
2. Elimina los archivos temporales de máscara en escala de grises (smask).
3. Asocia cada ilustración con su página, capítulo oficial CONASET (1 a 9) y contexto textual.
4. Genera assets/pdf-images/manifest.json con el catálogo completo.
"""
import json
import os
import re
import subprocess
from pathlib import Path

BASE_DIR = Path("/home/jota/Escritorio/licencia")
PDF_PATH = BASE_DIR / "LIBRO-DEL-NUEVO-CONDUCTOR-AUTOMOVILISTAS_2026.pdf"
IMG_DIR = BASE_DIR / "assets" / "pdf-images"
MANIFEST_PATH = IMG_DIR / "manifest.json"


def page_to_chapter(page: int) -> int:
    if page <= 10:
        return 1
    if page <= 32:
        return 2
    if page <= 36:
        return 3
    if page <= 67:
        return 4
    if page <= 76:
        return 5
    if page <= 108:
        return 6
    if page <= 126:
        return 7
    if page <= 135:
        return 8
    return 9


def get_pdf_page_texts() -> dict[int, str]:
    res = subprocess.run(
        ["pdftotext", str(PDF_PATH), "-"],
        capture_output=True,
        text=True,
        check=True,
    )
    pages_raw = res.stdout.split("\x0c")
    page_texts = {}
    for idx, text in enumerate(pages_raw, start=1):
        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
            and not line.strip().isdigit()
            and "LIBRO DEL NUEVO CONDUCTOR" not in line.upper()
        ]
        snippet = " · ".join(lines[:4])[:220]
        page_texts[idx] = snippet
    return page_texts


def parse_pdfimages_list() -> list[dict]:
    res = subprocess.run(
        ["pdfimages", "-list", str(PDF_PATH)],
        capture_output=True,
        text=True,
        check=True,
    )
    entries = []
    for line in res.stdout.splitlines()[2:]:
        parts = line.split()
        if len(parts) < 12:
            continue
        page = int(parts[0])
        num = int(parts[1])
        img_type = parts[2]
        width = int(parts[3])
        height = int(parts[4])
        obj_id = f"{parts[9]}_{parts[10]}"
        entries.append(
            {
                "page": page,
                "num": num,
                "type": img_type,
                "width": width,
                "height": height,
                "obj_id": obj_id,
                "filename": f"pdf-{page:03d}-{num:03d}.png",
            }
        )
    return entries


def main() -> None:
    entries = parse_pdfimages_list()
    page_texts = get_pdf_page_texts()

    # Map smasks by (page, obj_id) and by num
    smask_by_num = {e["num"]: e for e in entries if e["type"] == "smask"}
    images = [e for e in entries if e["type"] == "image"]

    composited_count = 0
    removed_smasks = 0
    manifest = []

    for img in images:
        img_path = IMG_DIR / img["filename"]
        if not img_path.exists():
            continue

        # Check if next entry is its smask
        next_num = img["num"] + 1
        smask = smask_by_num.get(next_num)
        if smask and smask["obj_id"] == img["obj_id"]:
            smask_path = IMG_DIR / smask["filename"]
            if smask_path.exists():
                w, h = img["width"], img["height"]
                tmp_out = IMG_DIR / f"tmp_{img['filename']}"
                subprocess.run(
                    [
                        "convert",
                        str(img_path),
                        "(",
                        str(smask_path),
                        "-resize",
                        f"{w}x{h}!",
                        ")",
                        "-alpha",
                        "off",
                        "-compose",
                        "CopyOpacity",
                        "-composite",
                        "-background",
                        "#ffffff",
                        "-alpha",
                        "remove",
                        "-alpha",
                        "off",
                        str(tmp_out),
                    ],
                    check=True,
                )
                tmp_out.replace(img_path)
                smask_path.unlink()
                composited_count += 1
                removed_smasks += 1

        chapter = page_to_chapter(img["page"])
        manifest.append(
            {
                "id": f"pdf-{img['page']:03d}-{img['num']:03d}",
                "file": f"assets/pdf-images/{img['filename']}",
                "page": img["page"],
                "chapter": chapter,
                "width": img["width"],
                "height": img["height"],
                "context": page_texts.get(img["page"], ""),
            }
        )

    # Remove any leftover standalone smask files
    for smask in smask_by_num.values():
        smask_path = IMG_DIR / smask["filename"]
        if smask_path.exists():
            smask_path.unlink()
            removed_smasks += 1

    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(
        f"Processed {len(manifest)} clean images ({composited_count} composited with smask, {removed_smasks} smasks deleted)."
    )
    print(f"Manifest written to {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
