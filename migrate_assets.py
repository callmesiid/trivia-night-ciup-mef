#!/usr/bin/env python3
"""
migrate_assets.py — Flatten media files into data/assets/images/ and data/assets/sons/

- Quizz/questions/**/*.{jpg,png,webp,gif} → data/assets/images/  (difficulty stays in JSON)
- Quizz/questions/**/*.{mp3,wav,ogg}      → data/assets/sons/
- Mix & Twist/*.{png,jpg,webp}             → data/assets/images/
- Updates all file paths in data/risque_tout/*.json and data/snapshot/photos.json
- Paths stored as repo-root-relative: "data/assets/images/xxx.jpg"
  (build.py adds "../" prefix when generating game JS files)

Run once from repo root. Verify, then delete Quizz/ and Mix & Twist/.
"""
import os, json, glob, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
IMG_OUT = os.path.join(ROOT, "data", "assets", "images")
SND_OUT = os.path.join(ROOT, "data", "assets", "sons")
os.makedirs(IMG_OUT, exist_ok=True)
os.makedirs(SND_OUT, exist_ok=True)

IMG_EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
SND_EXTS = {'.mp3', '.wav', '.ogg'}

# ── Collision-safe copy ────────────────────────────────────────────────────────

def safe_copy(src, dest_dir):
    """Copy src to dest_dir. If filename exists, append _2, _3, etc. Returns dest filename."""
    name = os.path.basename(src)
    stem, ext = os.path.splitext(name)
    dest = os.path.join(dest_dir, name)
    counter = 2
    while os.path.exists(dest):
        # Check if it's the exact same file (by size+content start)
        if os.path.getsize(src) == os.path.getsize(dest):
            with open(src, 'rb') as f1, open(dest, 'rb') as f2:
                if f1.read(256) == f2.read(256):
                    return name  # Already there, same file
        dest = os.path.join(dest_dir, f"{stem}_{counter}{ext}")
        counter += 1
    shutil.copy2(src, dest)
    return os.path.basename(dest)

# ── 1. Quizz/questions/ → data/assets/ ───────────────────────────────────────

quizz_root = os.path.join(ROOT, "Trivia Night MEF - Le Risque Tout", "Quizz", "questions")
# old_path → new repo-root-relative path
path_map = {}

rt_game_dir = os.path.join(ROOT, "Trivia Night MEF - Le Risque Tout")
if os.path.exists(quizz_root):
    print(f"Scan {quizz_root}...")
    for dirpath, _, filenames in os.walk(quizz_root):
        for fname in filenames:
            src = os.path.join(dirpath, fname)
            ext = os.path.splitext(fname)[1].lower()
            if ext in IMG_EXTS:
                new_name = safe_copy(src, IMG_OUT)
                new_val = f"data/assets/images/{new_name}"
                # Store both repo-relative and game-relative keys for JSON lookup
                path_map[os.path.relpath(src, ROOT).replace("\\", "/")] = new_val
                path_map[os.path.relpath(src, rt_game_dir).replace("\\", "/")] = new_val
            elif ext in SND_EXTS:
                new_name = safe_copy(src, SND_OUT)
                new_val = f"data/assets/sons/{new_name}"
                path_map[os.path.relpath(src, ROOT).replace("\\", "/")] = new_val
                path_map[os.path.relpath(src, rt_game_dir).replace("\\", "/")] = new_val
    print(f"  {len(path_map) // 2} fichiers médias (chemins indexés)")
else:
    print("  /!\\ Quizz/questions/ introuvable — skipped")

# ── 2. Mix & Twist/ → data/assets/images/ ────────────────────────────────────

mix_root = os.path.join(ROOT, "Trivia Night MEF - Snapshot", "Mix & Twist")
photo_map = {}

if os.path.exists(mix_root):
    print(f"Scan {mix_root}...")
    for fname in os.listdir(mix_root):
        src = os.path.join(mix_root, fname)
        if not os.path.isfile(src): continue
        ext = os.path.splitext(fname)[1].lower()
        if ext in IMG_EXTS:
            new_name = safe_copy(src, IMG_OUT)
            old_rel = f"Mix & Twist/{fname}"
            photo_map[old_rel] = f"data/assets/images/{new_name}"
    print(f"  {len(photo_map)} photos migrées depuis Mix & Twist/")
else:
    print("  /!\\ Mix & Twist/ introuvable — skipped")

# ── 3. Update data/risque_tout/*.json ─────────────────────────────────────────

rt_dir = os.path.join(ROOT, "data", "risque_tout")
updated_rt = 0
for json_file in glob.glob(os.path.join(rt_dir, "*.json")):
    with open(json_file, encoding='utf-8') as f:
        data = json.load(f)
    changed = False
    for q in data.get("questions", []):
        old = q.get("file", "")
        if not old: continue
        # Normalize separators for lookup
        old_norm = old.replace("\\", "/")
        if old_norm in path_map:
            q["file"] = path_map[old_norm]
            changed = True
        elif old_norm not in path_map and old_norm.startswith("data/assets/"):
            pass  # Already migrated in a previous run
    if changed:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        updated_rt += 1

print(f"  {updated_rt} fichiers data/risque_tout/*.json mis à jour")

# ── 4. Update data/snapshot/photos.json ───────────────────────────────────────

snap_json = os.path.join(ROOT, "data", "snapshot", "photos.json")
if os.path.exists(snap_json):
    with open(snap_json, encoding='utf-8') as f:
        snap_data = json.load(f)
    changed = False
    for p in snap_data.get("photos", []):
        old = p.get("file", "")
        if old in photo_map:
            p["file"] = photo_map[old]
            changed = True
    if changed:
        with open(snap_json, 'w', encoding='utf-8') as f:
            json.dump(snap_data, f, ensure_ascii=False, indent=2)
        print(f"  data/snapshot/photos.json mis à jour ({len(photo_map)} entrées)")
    else:
        print("  data/snapshot/photos.json — rien à changer")
else:
    print("  /!\\ photos.json introuvable")

# ── SUMMARY ───────────────────────────────────────────────────────────────────

img_count = len(os.listdir(IMG_OUT))
snd_count = len(os.listdir(SND_OUT))
print(f"\nRésultat :")
print(f"  data/assets/images/ : {img_count} fichiers")
print(f"  data/assets/sons/   : {snd_count} fichiers")
print(f"\nÉtapes suivantes :")
print(f"  1. Vérifiez que les compteurs sont corrects")
print(f"  2. python build.py")
print(f"  3. Testez les jeux")
print(f"  4. Si OK, supprimez manuellement :")
print(f"     - Trivia Night MEF - Le Risque Tout/Quizz/")
print(f"     - Trivia Night MEF - Snapshot/Mix & Twist/")
