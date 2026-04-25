#!/usr/bin/env python3
"""
build.py — Generates JS data files for all games from JSON sources in data/

Usage:
  python build.py           -> builds normal mode JS files
  python build.py --custom  -> builds custom mode JS files (*_custom.js)

Run from the repo root after editing JSON files in data/ or after migrate.py.
"""
import os, json, re, sys, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT, "data")
CUSTOM = '--custom' in sys.argv


def read_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def write_js(path, var_name, data, indent=2):
    content = f"const {var_name} = {json.dumps(data, ensure_ascii=False, indent=indent)};\n"
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    rel = os.path.relpath(path, ROOT)
    print(f"  ✓ {rel}")


def list_theme_files(game, custom=False):
    """Returns sorted list of JSON files for a game, normal or custom."""
    src_dir = os.path.join(DATA_DIR, game)
    if not os.path.exists(src_dir):
        return []
    all_files = glob.glob(os.path.join(src_dir, '*.json'))
    if custom:
        return sorted(f for f in all_files if os.path.basename(f).startswith('custom_'))
    else:
        return sorted(f for f in all_files if not os.path.basename(f).startswith('custom_'))


# ── 1. Le Risque Tout ─────────────────────────────────────────────────────────

def build_risque_tout():
    suffix = '_custom' if CUSTOM else ''
    var_name = 'QUESTION_DATABASE_CUSTOM' if CUSTOM else 'QUESTION_DATABASE'
    out_path = os.path.join(ROOT, "Trivia Night MEF - Le Risque Tout", f"database{suffix}.js")

    files = list_theme_files('risque_tout', CUSTOM)
    if not files:
        print(f"  /!\\ Aucun fichier JSON dans data/risque_tout/ ({'custom' if CUSTOM else 'normal'})")
        return

    database = {}
    total = 0

    for json_file in files:
        theme_data = read_json(json_file)
        theme_id = theme_data['id']

        levels = {str(i): {"images": [], "sounds": [], "text": []} for i in range(1, 6)}

        for q in theme_data.get('questions', []):
            if not q.get('validated', True):
                continue
            diff = str(max(1, min(5, q.get('difficulty', 1))))
            qtype = q.get('type', 'text')
            if qtype == 'image':
                levels[diff]['images'].append({"file": q['file'], "question": q['question'], "answer": q['answer']})
            elif qtype == 'sound':
                levels[diff]['sounds'].append({"file": q['file'], "question": q['question'], "answer": q['answer']})
            else:
                levels[diff]['text'].append({"question": q['question'], "answer": q['answer']})
            total += 1

        database[theme_id] = levels

    write_js(out_path, var_name, database)
    print(f"     {total} questions validées, {len(database)} thèmes")


# ── 2. La Surenchère ──────────────────────────────────────────────────────────

def build_surenchere():
    suffix = '_custom' if CUSTOM else ''
    var_name = 'THEMES_DATA_CUSTOM' if CUSTOM else 'THEMES_DATA'
    out_path = os.path.join(ROOT, "Trivia Night MEF - La Surenchère", f"surenchere_data{suffix}.js")

    files = list_theme_files('surenchere', CUSTOM)
    if not files:
        print(f"  /!\\ Aucun fichier JSON dans data/surenchere/ ({'custom' if CUSTOM else 'normal'})")
        return

    themes = []
    for json_file in files:
        theme_data = read_json(json_file)
        validated = [a['value'] for a in theme_data.get('answers', []) if a.get('validated', True)]
        if not validated:
            continue
        themes.append({
            "id": theme_data['id'],
            "title": theme_data['label'],
            "icon": theme_data['icon'],
            "question": theme_data.get('prompt', f"Citez des {theme_data['label']}"),
            "answers": validated
        })

    write_js(out_path, var_name, themes)
    print(f"     {len(themes)} thèmes")


# ── 3. Le Wagon ───────────────────────────────────────────────────────────────

def build_wagon():
    wagon_dir = os.path.join(DATA_DIR, "wagon")
    game_dir = os.path.join(ROOT, "Trivia Night MEF - Le Wagon")

    themes_file = os.path.join(wagon_dir, 'custom_themes.json' if CUSTOM else 'themes.json')
    bonuses_file = os.path.join(wagon_dir, 'bonuses.json')
    malus_file = os.path.join(wagon_dir, 'malus.json')

    if not os.path.exists(themes_file):
        print(f"  /!\\ Fichier introuvable : {themes_file}")
        return

    themes_raw = read_json(themes_file)
    themes = []
    for theme in themes_raw:
        validated_questions = [
            {"q": q['q'], "a": q['a']}
            for q in theme.get('questions', [])
            if q.get('validated', True)
        ]
        t = {k: v for k, v in theme.items() if k != 'questions'}
        t['questions'] = validated_questions
        themes.append(t)

    if CUSTOM:
        out_path = os.path.join(game_dir, "data_custom.js")
        write_js(out_path, 'AVAILABLE_THEMES_CUSTOM', themes)
        print(f"     {len(themes)} thèmes (mode custom)")
        return

    # Normal mode: patch the existing data.js (replace only the AVAILABLE_THEMES block)
    data_js_path = os.path.join(game_dir, "data.js")
    if not os.path.exists(data_js_path):
        print(f"  /!\\ data.js introuvable : {data_js_path}")
        return

    with open(data_js_path, encoding='utf-8') as f:
        existing = f.read()

    # Replace AVAILABLE_THEMES
    new_themes_str = json.dumps(themes, ensure_ascii=False, indent=4)
    existing = re.sub(
        r'(const AVAILABLE_THEMES\s*=\s*)\[[\s\S]*?\];',
        lambda m: f"{m.group(1)}{new_themes_str};",
        existing
    )

    # Replace BONUSES if file exists
    if os.path.exists(bonuses_file):
        bonuses = read_json(bonuses_file)
        new_bonuses_str = json.dumps(bonuses, ensure_ascii=False, indent=4)
        existing = re.sub(
            r'(const BONUSES\s*=\s*)\[[\s\S]*?\];',
            lambda m: f"{m.group(1)}{new_bonuses_str};",
            existing
        )

    # Replace MALUS if file exists
    if os.path.exists(malus_file):
        malus = read_json(malus_file)
        new_malus_str = json.dumps(malus, ensure_ascii=False, indent=4)
        existing = re.sub(
            r'(const MALUS\s*=\s*)\[[\s\S]*?\];',
            lambda m: f"{m.group(1)}{new_malus_str};",
            existing
        )

    with open(data_js_path, 'w', encoding='utf-8') as f:
        f.write(existing)

    rel = os.path.relpath(data_js_path, ROOT)
    print(f"  ✓ {rel}")
    print(f"     {len(themes)} thèmes")


# ── 4. Snapshot ───────────────────────────────────────────────────────────────

def build_snapshot():
    suffix = '_custom' if CUSTOM else ''
    var_name = 'MIX_PHOTOS_CUSTOM' if CUSTOM else 'MIX_PHOTOS'
    src_name = 'custom_photos.json' if CUSTOM else 'photos.json'
    src_path = os.path.join(DATA_DIR, "snapshot", src_name)
    out_path = os.path.join(ROOT, "Trivia Night MEF - Snapshot", f"mix_data{suffix}.js")

    if not os.path.exists(src_path):
        print(f"  /!\\ Fichier introuvable : {src_path}")
        return

    data = read_json(src_path)
    photos = [
        {"file": p['file'], "name": p['name']}
        for p in data.get('photos', [])
        if p.get('validated', True)
    ]

    write_js(out_path, var_name, photos)
    print(f"     {len(photos)} photos validées")


# ── MAIN ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    mode_label = "PERSONNALISÉ" if CUSTOM else "NORMAL"
    print("=" * 60)
    print(f"  MEF Trivia Night — Build ({mode_label})")
    print("=" * 60)

    print("\n[1/4] Le Risque Tout...")
    build_risque_tout()

    print("\n[2/4] La Surenchère...")
    build_surenchere()

    print("\n[3/4] Le Wagon...")
    build_wagon()

    print("\n[4/4] Snapshot...")
    build_snapshot()

    print("\n" + "=" * 60)
    if CUSTOM:
        print("  Build PERSONNALISÉ terminé — fichiers *_custom.js générés.")
    else:
        print("  Build NORMAL terminé — fichiers JS mis à jour.")
    print("=" * 60)
