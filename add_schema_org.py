#!/usr/bin/env python3
"""
Injecte Schema.org JSON-LD dans :
- Les 46 pages magasins (LocalBusiness)
- Les 26 fiches produits (Product + ItemPage)
"""

import json
import re
import os
import urllib.request

SUPABASE_URL = 'https://ohjzggceozamhdesecxi.supabase.co'
SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanpnZ2Nlb3phbWhkZXNlY3hpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc2NzkwNiwiZXhwIjoyMDkyMzQzOTA2fQ.89JGBxboodYhj7ZtJPKHdsU_B3nCvyRaxxZsJ5cgpqc'
BASE_URL = 'https://gr-spa.com'

def fetch(path):
    req = urllib.request.Request(
        SUPABASE_URL + path,
        headers={'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY}
    )
    return json.loads(urllib.request.urlopen(req).read())

def already_has_schema(html):
    return 'application/ld+json' in html

def inject_schema(html, schema_dict):
    script = '\n<script type="application/ld+json">\n' + json.dumps(schema_dict, ensure_ascii=False, indent=2) + '\n</script>'
    return re.sub(r'(</head>)', script + '\n\\1', html, count=1, flags=re.IGNORECASE)

def gamme_label(gamme):
    return {'relax': 'Relax', 'energy': 'Energy', 'luxury': 'Luxury', 'nage': 'Spa de Nage'}.get(gamme, gamme.capitalize())

# ─── MAGASINS ─────────────────────────────────────────────────────────────────

def build_local_business(m):
    schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": m['nom'],
        "description": m.get('description') or f"Revendeur agréé Giovanni Riboli — spas et spas de nage haut de gamme à {m['ville']}.",
        "url": f"{BASE_URL}/magasins/{m['slug']}.html",
        "telephone": m.get('telephone') or '',
        "address": {
            "@type": "PostalAddress",
            "streetAddress": m.get('adresse') or '',
            "addressLocality": m.get('ville') or '',
            "postalCode": m.get('cp') or '',
            "addressCountry": "FR"
        },
        "brand": {
            "@type": "Brand",
            "name": "Giovanni Riboli"
        },
        "image": f"{BASE_URL}/assets/hero-ambiance.webp",
        "priceRange": "€€€",
        "sameAs": [BASE_URL]
    }
    # Coordonnées GPS si dispo
    if m.get('lat') and m.get('lng'):
        schema["geo"] = {
            "@type": "GeoCoordinates",
            "latitude": m['lat'],
            "longitude": m['lng']
        }
    # Email si dispo
    if m.get('email'):
        schema["email"] = m['email']
    return schema

def process_magasins(magasins):
    count = 0
    for m in magasins:
        if not m.get('actif'):
            continue
        slug = m['slug']
        filepath = f'magasins/{slug}.html'
        if not os.path.exists(filepath):
            print(f'  ⏭️  {filepath} (fichier absent)')
            continue
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        if already_has_schema(html):
            print(f'  ⏭️  {filepath} (schema déjà présent)')
            continue
        schema = build_local_business(m)
        new_html = inject_schema(html, schema)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f'  ✅ {filepath} — {m["nom"]} ({m["ville"]})')
        count += 1
    return count

# ─── PRODUITS ─────────────────────────────────────────────────────────────────

def build_product_schema(p):
    slug = p['slug']
    nom = p['nom']
    gamme = p.get('gamme', '')
    description = p.get('tagline') or p.get('description_courte', '')[:200]
    image_url = f"{BASE_URL}/assets/produits/{slug}.webp"
    page_url = f"{BASE_URL}/produits/{slug}.html"

    schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": nom,
        "description": description,
        "image": image_url,
        "url": page_url,
        "brand": {
            "@type": "Brand",
            "name": "Giovanni Riboli"
        },
        "manufacturer": {
            "@type": "Organization",
            "name": "Giovanni Riboli",
            "url": BASE_URL
        },
        "category": f"Spa {gamme_label(gamme)}",
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStoreOnly",
            "priceCurrency": "EUR",
            "seller": {
                "@type": "Organization",
                "name": "Giovanni Riboli"
            }
        }
    }

    # Caractéristiques additionnelles
    props = []
    if p.get('nb_places') and p['nb_places'] > 0:
        props.append({"@type": "PropertyValue", "name": "Nombre de places", "value": str(p['nb_places'])})
    if p.get('nb_buses') and p['nb_buses'] > 0:
        props.append({"@type": "PropertyValue", "name": "Nombre de buses", "value": str(p['nb_buses'])})
    if p.get('longueur_cm') and p.get('largeur_cm'):
        props.append({"@type": "PropertyValue", "name": "Dimensions (cm)", "value": f"{p['longueur_cm']} × {p['largeur_cm']}"})
    if props:
        schema["additionalProperty"] = props

    return schema

def process_produits(produits):
    count = 0
    for p in produits:
        if not p.get('actif'):
            continue
        slug = p['slug']
        filepath = f'produits/{slug}.html'
        if not os.path.exists(filepath):
            print(f'  ⏭️  {filepath} (fichier absent)')
            continue
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        if already_has_schema(html):
            print(f'  ⏭️  {filepath} (schema déjà présent)')
            continue
        schema = build_product_schema(p)
        new_html = inject_schema(html, schema)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f'  ✅ {filepath} — {p["nom"]} ({gamme_label(p.get("gamme",""))})')
        count += 1
    return count

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    print("=== Récupération données Supabase ===")
    magasins = fetch('/rest/v1/magasins?select=*&order=ville')
    produits = fetch('/rest/v1/produits?select=slug,nom,gamme,tagline,description_courte,nb_places,nb_buses,longueur_cm,largeur_cm,actif&order=gamme,nom')
    print(f"  {len(magasins)} magasins, {len(produits)} produits récupérés\n")

    print("=== LocalBusiness — Pages magasins ===")
    n1 = process_magasins(magasins)

    print(f"\n=== Product — Fiches produits ===")
    n2 = process_produits(produits)

    print(f"\nTotal : {n1} magasins + {n2} produits traités")

if __name__ == '__main__':
    main()
