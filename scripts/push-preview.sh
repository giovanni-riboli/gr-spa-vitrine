#!/bin/bash
# push-preview.sh — Déploie la branche preview sur gr-spa-preview.netlify.app
# Usage : bash scripts/push-preview.sh
set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

BRANCH=$(git symbolic-ref --short HEAD)
if [ "$BRANCH" != "preview" ]; then
  echo "❌ Tu n'es pas sur la branche preview (branche actuelle : $BRANCH)"
  echo "   Fais : git checkout preview"
  exit 1
fi

echo "📤 Push GitHub (preview)..."
git push origin preview

echo "🚀 Deploy → gr-spa-preview.netlify.app..."
NETLIFY_AUTH_TOKEN="nfp_rtx7fjLt9uhY1T2n22Bf5sUiTSJbQPTf9882" \
netlify deploy \
  --dir . \
  --prod \
  --site 1ff6f353-18cd-40be-99b1-bd03cd83af02 \
  --message "$(git log --oneline -1)"

echo ""
echo "✅ Preview déployé : https://gr-spa-preview.netlify.app"
echo "   En attente du GO JC avant merge → main."
