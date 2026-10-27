#!/usr/bin/env bash
# Make a private, per-prospect copy of the homepage at /r/<slug>/ so analytics can show which prospect visited.
# Usage: scripts/new-prospect-page.sh ardlaw-plumbing
# The copy is noindex, not in the sitemap and disallowed in robots.txt. Put https://longshorestudio.co.uk/r/<slug>/ in that prospect's email.
set -euo pipefail
slug="${1:?usage: new-prospect-page.sh <slug>}"
[[ "$slug" =~ ^[a-z0-9-]+$ ]] || { echo "slug must be lowercase letters, numbers and hyphens" >&2; exit 1; }
cd "$(dirname "$0")/.."
mkdir -p "r/$slug"
perl -pe '
  s{(src|href)="(?!https?:|//|/|#|mailto:|tel:|data:)([^"]+)"}{$1="/$2"}g;
  s{</head>}{<meta name="robots" content="noindex,nofollow">\n</head>};
' index.html > "r/$slug/index.html"
echo "Created r/$slug/index.html -> https://longshorestudio.co.uk/r/$slug/"
