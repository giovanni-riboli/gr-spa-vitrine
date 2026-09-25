#!/bin/bash
# push-prod.sh — Merge preview → main et déploie en prod (après GO explicite de JC)
# Usage : bash scripts/push-prod.sh
set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

BRANCH=$(git symbolic-ref --short HEAD)
if [ "$BRANCH" != "preview" ]; then
  echo "❌ Lance ce script depuis la branche preview (branche actuelle : $BRANCH)"
  exit 1
fi

echo "🔀 Merge preview → main..."
git checkout main
git merge preview --no-edit
git push origin main
git checkout preview

echo ""
echo "✅ Prod en cours de deploy : https://gr-spa-vitrine.netlify.app"
echo "   (Netlify auto-deploy sur push main, ~30s)"
echo "   Branche actuelle : preview — tu peux continuer à travailler"
