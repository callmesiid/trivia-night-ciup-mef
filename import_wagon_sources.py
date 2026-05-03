#!/usr/bin/env python3
"""
import_wagon_sources.py — Import unique des questions Risque Tout → Wagon.

Lance UNE SEULE FOIS. Ensuite les deux jeux sont indépendants.
Ce script :
  1. Lit themes_sources.json pour savoir quels thèmes RT importer
  2. Fusionne dans themes.json (wagon) les questions RT + questions wagon existantes
  3. Supprime themes_sources.json (plus besoin après l'import)
  4. Lance automatiquement build.py pour regénérer data.js

Usage :
  python import_wagon_sources.py
"""
import os, json, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, 'data')
WAGON_DIR = os.path.join(DATA, 'wagon')


def read_json(path):
    with open(path, encoding='utf-8-sig') as f:
        return json.load(f)


def write_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def rt_to_wagon(q):
    """Convertit une question format Risque Tout → format wagon (q/a)."""
    qobj = {
        'q': q.get('question', q.get('q', '')),
        'a': q.get('answer',   q.get('a', ''))
    }
    for field in ('type', 'file', 'difficulty', 'validated'):
        if field in q:
            qobj[field] = q[field]
    return qobj


sources_file = os.path.join(WAGON_DIR, 'themes_sources.json')
if not os.path.exists(sources_file):
    print("Aucun fichier themes_sources.json — import déjà effectué ou non configuré.")
    sys.exit(0)

theme_sources = read_json(sources_file)
themes = read_json(os.path.join(WAGON_DIR, 'themes.json'))
total_imported = 0

for theme in themes:
    tid = theme.get('id', '')
    if tid not in theme_sources:
        continue

    src_path = os.path.join(DATA, theme_sources[tid] + '.json')
    if not os.path.exists(src_path):
        print(f"  /!\\ Source introuvable : {src_path}")
        continue

    rt_data = read_json(src_path)
    rt_qs = [rt_to_wagon(q) for q in rt_data.get('questions', [])
             if q.get('validated', True)]

    # Conserver les questions wagon-natives non présentes dans la source RT
    wagon_qs = theme.get('questions', [])
    seen = {(q.get('q', '').lower().strip(), q.get('a', '').lower().strip()) for q in rt_qs}
    wagon_only = 0
    for wq in wagon_qs:
        fp = (wq.get('q', '').lower().strip(), wq.get('a', '').lower().strip())
        if fp not in seen:
            rt_qs.append(wq)
            seen.add(fp)
            wagon_only += 1

    # Trier par difficulté croissante
    rt_qs.sort(key=lambda q: q.get('difficulty', 1))
    theme['questions'] = rt_qs
    total_imported += len(rt_qs)
    print(f"  {tid:15s} ← {len(rt_qs)} questions ({len(rt_qs)-wagon_only} RT + {wagon_only} wagon exclusives)")

# Sauvegarder themes.json avec toutes les questions
write_json(os.path.join(WAGON_DIR, 'themes.json'), themes)
print(f"\n✓ themes.json mis à jour ({total_imported} questions importées)")

# Supprimer themes_sources.json : import terminé, plus besoin
os.remove(sources_file)
print("✓ themes_sources.json supprimé — les deux jeux sont maintenant indépendants")

# Lancer build.py pour regénérer data.js
print("\n→ Lancement de build.py...")
subprocess.run([sys.executable, os.path.join(ROOT, 'build.py')], check=True)
