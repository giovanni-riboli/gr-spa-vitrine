#!/usr/bin/env python3
"""
Harmonisation <head> sur toutes les pages :
- Favicon (svg, png 32, png 16, apple-touch-icon, ico)
- Canonical URL
"""

import os, re, glob

BASE_URL = "https://gr-spa.com"

FAVICON_BLOCK = """  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="shortcut icon" href="/assets/favicon.ico">"""

def already_has_favicon(html):
    return 'favicon' in html

def already_has_canonical(html):
    return 'rel="canonical"' in html

def get_canonical(rel_path):
    # Nettoie le chemin → URL propre
    path = rel_path.lstrip('./')
    # index.html → /
    if path == 'index.html':
        return f"{BASE_URL}/"
    # Enlève .html pour URL propre
    url_path = '/' + path
    return BASE_URL + url_path

def process_file(filepath, rel_path):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    changed = False
    canonical_url = get_canonical(rel_path)

    # 1. Favicon — insérer avant </head>
    if not already_has_favicon(html):
        html = re.sub(
            r'(</head>)',
            FAVICON_BLOCK + '\n\\1',
            html, count=1, flags=re.IGNORECASE
        )
        changed = True

    # 2. Canonical — insérer avant </head>
    if not already_has_canonical(html):
        canonical_tag = f'  <link rel="canonical" href="{canonical_url}">'
        html = re.sub(
            r'(</head>)',
            canonical_tag + '\n\\1',
            html, count=1, flags=re.IGNORECASE
        )
        changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        return True
    return False

def main():
    patterns = [
        '*.html',
        'gammes/*.html',
        'blog/*.html',
        'produits/*.html',
        'magasins/*.html',
    ]
    # Exclure les pages sans head standard
    exclude = {'espace-pro.html', 'feedback.html'}

    count = 0
    for pattern in patterns:
        for filepath in sorted(glob.glob(pattern)):
            if os.path.basename(filepath) in exclude:
                print(f"  ⏭️  {filepath} (exclu)")
                continue
            rel_path = filepath
            if process_file(filepath, rel_path):
                print(f"  ✅ {filepath}")
                count += 1
            else:
                print(f"  ⏭️  {filepath} (déjà ok)")

    print(f"\nTotal modifié : {count} fichiers")

if __name__ == '__main__':
    main()
