#!/usr/bin/env bash
# process-photos.sh — compress and watermark all JPEGs in assets/photos/
#
# Usage:
#   ./process-photos.sh              # process all photos
#   ./process-photos.sh assets/photos/zwolle   # process one folder
#
# Requires ImageMagick: brew install imagemagick

set -euo pipefail

WATERMARK_TEXT="mikeveltman.nl"
MAX_PX=2000          # longest edge
QUALITY=78           # JPEG quality (78 is a good balance for web)
TARGET_DIR="${1:-assets/photos}"

if ! command -v magick &>/dev/null && ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

# Use 'magick' (IM7) or fall back to 'convert' (IM6)
IM=$(command -v magick &>/dev/null && echo "magick" || echo "convert")

count=0
while IFS= read -r -d '' file; do
  echo "Processing: $file"
  "$IM" "$file" \
    -auto-orient \
    -resize "${MAX_PX}x${MAX_PX}>" \
    -quality "$QUALITY" \
    -gravity SouthEast \
    -fill "rgba(255,255,255,0.40)" \
    -font Helvetica \
    -pointsize 20 \
    -annotate +16+14 "$WATERMARK_TEXT" \
    "$file"
  count=$((count + 1))
done < <(find "$TARGET_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo "Done — processed $count photo(s)."
