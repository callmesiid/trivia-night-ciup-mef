#!/usr/bin/env python3
"""
migrate.py — One-time migration: existing JS data files -> JSON in data/
Run once from the repo root: python migrate.py
"""
import os, json, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT, "data")

THEME_META = {
    "animaux":      {"label": "Animaux",      "icon": "icons/animaux.png"},
    "histoire":     {"label": "Histoire",     "icon": "icons/histoire.png"},
    "geographie":   {"label": "Géographie",   "icon": "icons/geographie.png"},
    "disney":       {"label": "Disney",       "icon": "icons/disney.png"},
    "harry_potter": {"label": "Harry Potter", "icon": "icons/harry_potter.png"},
    "annees_2000":  {"label": "Années 2000",  "icon": "icons/annee_2000.png"},
    "cinema":       {"label": "Cinéma",       "icon": "icons/cinema.png"},
    "sport":        {"label": "Sport",        "icon": "icons/sport.png"},
    "musique":      {"label": "Musique",      "icon": "icons/musique.png"},
    "cuisine":      {"label": "Cuisine",      "icon": "icons/cuisine.png"},
    "art":          {"label": "Art",          "icon": "icons/art.png"},
    "celebrites":   {"label": "Célébrités",   "icon": "icons/celebrites.png"},
    "sciences":     {"label": "Sciences",     "icon": "icons/sciences.png"},
    "litterature":  {"label": "Littérature",  "icon": "icons/litterature.png"},
    "jeux_video":   {"label": "Jeux Vidéo",   "icon": "icons/jeux_video.png"},
    "mystere":      {"label": "Mystère",      "icon": "icons/mystere.png"},
}


def makedirs(path):
    os.makedirs(path, exist_ok=True)


def strip_js_var(content, var_name):
    """Extract the raw value (array or object) from `const VAR_NAME = VALUE;`."""
    match = re.search(rf'const\s+{var_name}\s*=\s*', content)
    if not match:
        return None
    start = match.end()
    opener = content[start]
    closer = ']' if opener == '[' else '}'
    depth = 0
    for i, ch in enumerate(content[start:]):
        if ch == opener:
            depth += 1
        elif ch == closer:
            depth -= 1
            if depth == 0:
                return content[start: start + i + 1]
    return None


def js_to_json(text):
    """Convert a JS object/array literal to valid JSON.

    Uses a character-by-character parser to correctly handle:
    - Single-quoted strings ('value') -> converted to double-quoted
    - Double-quoted strings with apostrophes ("l'amour") -> copied verbatim
    - Unquoted object keys (id:) -> quoted ("id":)
    - Trailing commas
    """
    # Strip comments
    text = re.sub(r'//[^\n]*', '', text)
    text = re.sub(r'/\*[\s\S]*?\*/', '', text)

    # Phase 1: convert single-quoted strings to double-quoted, leave double-quoted intact
    result = []
    i, n = 0, len(text)
    while i < n:
        c = text[i]
        if c == '"':
            # Double-quoted string: copy verbatim (including apostrophes inside)
            result.append(c)
            i += 1
            while i < n:
                c = text[i]
                if c == '\\':
                    result.append(c)
                    i += 1
                    if i < n:
                        result.append(text[i])
                elif c == '"':
                    result.append(c)
                    break
                else:
                    result.append(c)
                i += 1
        elif c == "'":
            # Single-quoted string: convert to double-quoted
            result.append('"')
            i += 1
            while i < n:
                c = text[i]
                if c == '\\':
                    i += 1
                    if i < n:
                        nc = text[i]
                        if nc == "'":
                            result.append("'")       # \' -> '
                        elif nc == '"':
                            result.append('\\"')     # \" -> \"
                        else:
                            result.append('\\')
                            result.append(nc)
                elif c == "'":
                    result.append('"')
                    break
                else:
                    if c == '"':
                        result.append('\\"')         # escape bare " inside single-quoted string
                    else:
                        result.append(c)
                i += 1
        else:
            result.append(c)
        i += 1

    text = ''.join(result)

    # Phase 2: quote unquoted object keys  (word chars followed by colon, after { , \n \r)
    text = re.sub(
        r'(?<=[{,\n\r])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:',
        lambda m: m.group(0).replace(m.group(1), f'"{m.group(1)}"', 1),
        text
    )

    # Phase 3: remove trailing commas before } or ]
    text = re.sub(r',(\s*[\]}])', r'\1', text)

    return text


# ── 1. Le Risque Tout ─────────────────────────────────────────────────────────

def migrate_risque_tout():
    src = os.path.join(ROOT, "Trivia Night MEF - Le Risque Tout", "database.js")
    dst_dir = os.path.join(DATA_DIR, "risque_tout")
    makedirs(dst_dir)

    if not os.path.exists(src):
        print(f"  /!\\ database.js introuvable : {src}")
        return

    with open(src, encoding='utf-8') as f:
        content = f.read()

    raw = strip_js_var(content, 'QUESTION_DATABASE')
    if not raw:
        print("  /!\\ QUESTION_DATABASE introuvable dans database.js")
        return

    db = json.loads(raw)
    total = 0

    for theme_id, levels in db.items():
        questions = []
        for level_str, types in levels.items():
            diff = int(level_str)
            for item in types.get('images', []):
                questions.append({
                    "type": "image",
                    "file": item.get('file', ''),
                    "question": item.get('question', 'Identifiez cet élément'),
                    "answer": item.get('answer', ''),
                    "difficulty": diff,
                    "validated": True
                })
            for item in types.get('sounds', []):
                questions.append({
                    "type": "sound",
                    "file": item.get('file', ''),
                    "question": item.get('question', "De quoi s'agit-il ?"),
                    "answer": item.get('answer', ''),
                    "difficulty": diff,
                    "validated": True
                })
            for item in types.get('text', []):
                questions.append({
                    "type": "text",
                    "question": item.get('question', ''),
                    "answer": item.get('answer', ''),
                    "difficulty": diff,
                    "validated": True
                })

        meta = THEME_META.get(theme_id, {
            "label": theme_id.replace('_', ' ').title(),
            "icon": f"icons/{theme_id}.png"
        })
        theme_data = {
            "id": theme_id,
            "label": meta["label"],
            "icon": meta["icon"],
            "questions": questions
        }
        out_path = os.path.join(dst_dir, f"{theme_id}.json")
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(theme_data, f, ensure_ascii=False, indent=2)
        total += len(questions)
        print(f"  → risque_tout/{theme_id}.json  ({len(questions)} questions)")

    print(f"  Total : {total} questions")


# ── 2. La Surenchère ──────────────────────────────────────────────────────────

def migrate_surenchere():
    src = os.path.join(ROOT, "Trivia Night MEF - La Surenchère", "surenchere_data.js")
    dst_dir = os.path.join(DATA_DIR, "surenchere")
    makedirs(dst_dir)

    if not os.path.exists(src):
        print(f"  /!\\ surenchere_data.js introuvable : {src}")
        return

    with open(src, encoding='utf-8') as f:
        content = f.read()

    raw = strip_js_var(content, 'THEMES_DATA')
    if not raw:
        print("  /!\\ THEMES_DATA introuvable dans surenchere_data.js")
        return

    json_str = js_to_json(raw)
    try:
        themes = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"  /!\\ Erreur parsing surenchere_data.js : {e}")
        return

    for theme in themes:
        theme_data = {
            "id": theme.get('id', ''),
            "label": theme.get('title', ''),
            "icon": theme.get('icon', ''),
            "prompt": theme.get('question', ''),
            "answers": [{"value": a, "validated": True} for a in theme.get('answers', [])]
        }
        out_path = os.path.join(dst_dir, f"{theme['id']}.json")
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(theme_data, f, ensure_ascii=False, indent=2)
        print(f"  → surenchere/{theme['id']}.json  ({len(theme_data['answers'])} réponses)")


# ── 3. Le Wagon ───────────────────────────────────────────────────────────────

def migrate_wagon():
    src = os.path.join(ROOT, "Trivia Night MEF - Le Wagon", "data.js")
    dst_dir = os.path.join(DATA_DIR, "wagon")
    makedirs(dst_dir)

    if not os.path.exists(src):
        print(f"  /!\\ data.js introuvable : {src}")
        return

    with open(src, encoding='utf-8') as f:
        content = f.read()

    for var_name, out_name in [('AVAILABLE_THEMES', 'themes'), ('BONUSES', 'bonuses'), ('MALUS', 'malus')]:
        raw = strip_js_var(content, var_name)
        if not raw:
            print(f"  /!\\ {var_name} introuvable dans data.js")
            continue
        json_str = js_to_json(raw)
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"  /!\\ Erreur parsing {var_name} : {e}")
            continue

        if var_name == 'AVAILABLE_THEMES':
            for theme in data:
                for q in theme.get('questions', []):
                    q.setdefault('validated', True)

        out_path = os.path.join(dst_dir, f"{out_name}.json")
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  → wagon/{out_name}.json  ({len(data)} entrées)")


# ── 4. Snapshot ───────────────────────────────────────────────────────────────

def migrate_snapshot():
    src = os.path.join(ROOT, "Trivia Night MEF - Snapshot", "mix_data.js")
    dst_dir = os.path.join(DATA_DIR, "snapshot")
    makedirs(dst_dir)

    if not os.path.exists(src):
        print(f"  /!\\ mix_data.js introuvable : {src}")
        return

    with open(src, encoding='utf-8') as f:
        content = f.read()

    raw = strip_js_var(content, 'MIX_PHOTOS')
    if not raw:
        print("  /!\\ MIX_PHOTOS introuvable dans mix_data.js")
        return

    photos = json.loads(raw)
    for p in photos:
        p.setdefault('validated', True)

    out_path = os.path.join(dst_dir, "photos.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump({"photos": photos}, f, ensure_ascii=False, indent=2)
    print(f"  → snapshot/photos.json  ({len(photos)} photos)")


# ── MAIN ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print("=" * 60)
    print("  MEF Trivia Night — Migration des données vers data/")
    print("=" * 60)

    print("\n[1/4] Le Risque Tout...")
    migrate_risque_tout()

    print("\n[2/4] La Surenchère...")
    migrate_surenchere()

    print("\n[3/4] Le Wagon...")
    migrate_wagon()

    print("\n[4/4] Snapshot...")
    migrate_snapshot()

    print("\n" + "=" * 60)
    print("  Migration terminée ! Vérifiez le dossier data/")
    print("  Lancez ensuite : python build.py")
    print("=" * 60)
