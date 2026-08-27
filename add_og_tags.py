#!/usr/bin/env python3
"""
Ajoute og:title, og:description, og:image, og:type, og:url
sur toutes les pages HTML du site GR Spa.
"""

import os
import re
import glob

BASE_URL = "https://gr-spa.com"
DEFAULT_OG_IMAGE = f"{BASE_URL}/assets/hero-ambiance.webp"

# Map page → image OG spécifique
OG_IMAGES = {
    "index.html": f"{BASE_URL}/assets/hero-ambiance.webp",
    "a-propos.html": f"{BASE_URL}/assets/brand-intro-ambiance.webp",
    "blog.html": f"{BASE_URL}/assets/hero-ambiance.webp",
    "quiz.html": f"{BASE_URL}/assets/quiz-spa-installe.webp",
    "comparateur.html": f"{BASE_URL}/assets/gamme-luxury.webp",
    "financement.html": f"{BASE_URL}/assets/gamme-energy.webp",
    "ma-selection.html": f"{BASE_URL}/assets/gamme-relax.webp",
    "revendeurs.html": f"{BASE_URL}/assets/hero-ambiance.webp",
    "magasin.html": f"{BASE_URL}/assets/hero-ambiance.webp",
    "cgv.html": f"{BASE_URL}/assets/hero-ambiance.webp",
    "gammes/relax.html": f"{BASE_URL}/assets/gamme-relax-hero.webp",
    "gammes/energy.html": f"{BASE_URL}/assets/gamme-energy-hero.webp",
    "gammes/luxury.html": f"{BASE_URL}/assets/gamme-luxury-hero.webp",
    "gammes/spa-de-nage.html": f"{BASE_URL}/assets/gamme-nage-hero.webp",
}

# Images OG pour les articles blog
BLOG_OG_IMAGES = {
    "bienfaits-hydrotherapie": f"{BASE_URL}/assets/pourquoi-ambiance.webp",
    "chromoterapie-couleurs-bien-etre": f"{BASE_URL}/assets/gamme-luxury.webp",
    "comment-choisir-son-spa": f"{BASE_URL}/assets/gamme-energy.webp",
    "entretien-de-votre-spa": f"{BASE_URL}/assets/gamme-relax.webp",
    "giovanni-riboli-nouveaux-showrooms-2026": f"{BASE_URL}/assets/hero-ambiance.webp",
    "offre-electrisante-panneau-solaire": f"{BASE_URL}/assets/gamme-luxury-hero.webp",
}

def get_tag_content(html, pattern):
    m = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
    return m.group(1).strip() if m else None

def get_meta_content(html, name):
    m = re.search(rf'<meta[^>]+name=["\']?{name}["\']?[^>]+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
    if not m:
        m = re.search(rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']?{name}["\']?', html, re.IGNORECASE)
    return m.group(1).strip() if m else None

def has_og_tag(html, prop):
    return bool(re.search(rf'property=["\']og:{prop}["\']', html, re.IGNORECASE))

def process_file(filepath, rel_path):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Skip si OG déjà complet
    if has_og_tag(html, 'title') and has_og_tag(html, 'image'):
        return False

    # Récupérer title
    title = get_tag_content(html, r'<title>(.*?)</title>')
    # Récupérer description
    description = get_meta_content(html, 'description')

    # Déterminer l'URL de page
    page_url = f"{BASE_URL}/{rel_path.replace('index.html', '').rstrip('/')}"
    if not page_url.endswith('.html') and not page_url.endswith('/'):
        page_url = page_url + '/'

    # Déterminer og:image
    og_image = DEFAULT_OG_IMAGE
    if rel_path in OG_IMAGES:
        og_image = OG_IMAGES[rel_path]
    elif rel_path.startswith('blog/'):
        slug = rel_path.replace('blog/', '').replace('.html', '')
        og_image = BLOG_OG_IMAGES.get(slug, DEFAULT_OG_IMAGE)
    elif rel_path.startswith('produits/'):
        slug = rel_path.replace('produits/', '').replace('.html', '')
        og_image = f"{BASE_URL}/assets/produits/{slug}.webp"
    elif rel_path.startswith('magasins/'):
        og_image = f"{BASE_URL}/assets/hero-ambiance.webp"

    # Construire les balises OG
    og_tags = []
    if not has_og_tag(html, 'type'):
        og_tags.append('  <meta property="og:type" content="website">')
    if not has_og_tag(html, 'title') and title:
        og_tags.append(f'  <meta property="og:title" content="{title}">')
    if not has_og_tag(html, 'description') and description:
        og_tags.append(f'  <meta property="og:description" content="{description}">')
    if not has_og_tag(html, 'url'):
        og_tags.append(f'  <meta property="og:url" content="{page_url}">')
    if not has_og_tag(html, 'image'):
        og_tags.append(f'  <meta property="og:image" content="{og_image}">')

    if not og_tags:
        return False

    og_block = '\n'.join(og_tags)

    # Insérer avant </head>
    new_html = re.sub(
        r'(</head>)',
        og_block + '\n\\1',
        html,
        count=1,
        flags=re.IGNORECASE
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)

    return True

def main():
    count = 0
    patterns = [
        '*.html',
        'gammes/*.html',
        'blog/*.html',
        'produits/*.html',
        'magasins/*.html',
    ]

    for pattern in patterns:
        for filepath in sorted(glob.glob(pattern)):
            rel_path = filepath
            if process_file(filepath, rel_path):
                print(f"  ✅ {filepath}")
                count += 1
            else:
                print(f"  ⏭️  {filepath} (déjà ok ou skippé)")

    print(f"\nTotal modifié : {count} fichiers")

if __name__ == '__main__':
    main()
