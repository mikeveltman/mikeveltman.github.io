#!/usr/bin/env bash
# process-photos.sh — compress, watermark and strip private EXIF from all JPEGs
# in assets/photos/
#
# Usage:
#   ./process-photos.sh              # process all photos
#   ./process-photos.sh assets/photos/zwolle   # process one folder
#
# Requires ImageMagick + exiftool: brew install imagemagick exiftool

set -euo pipefail

WATERMARK_TEXT="mikeveltman.nl"
MAX_PX=3000          # longest edge
QUALITY=78          # JPEG quality (78 is a good balance for web)
TARGET_DIR="${1:-assets/photos}"
# EXIF marker written after processing; files that carry it are skipped,
# so running the script twice never re-compresses or double-watermarks
PROCESSED_MARKER="processed-for-mikeveltman.nl"

if ! command -v magick &>/dev/null && ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

if ! command -v exiftool &>/dev/null; then
  echo "Error: exiftool not found. Install with: brew install exiftool"
  exit 1
fi

# Use 'magick' (IM7) or fall back to 'convert' (IM6)
IM=$(command -v magick &>/dev/null && echo "magick" || echo "convert")

# Find a usable font file
FONT=""
for candidate in \
  "/System/Library/Fonts/Supplemental/Arial.ttf" \
  "/Library/Fonts/Arial.ttf" \
  "/System/Library/Fonts/Helvetica.ttc" \
  "/System/Library/Fonts/Geneva.ttf" \
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; do
  if [ -f "$candidate" ]; then
    FONT="$candidate"
    break
  fi
done

if [ -z "$FONT" ]; then
  echo "Error: no usable font found. Install Arial or run: brew install --cask font-dejavu"
  exit 1
fi
echo "Using font: $FONT"

count=0
skipped=0
while IFS= read -r -d '' file; do
  if [ "$(exiftool -s3 -UserComment "$file" 2>/dev/null)" = "$PROCESSED_MARKER" ]; then
    skipped=$((skipped + 1))
    continue
  fi
  echo "Processing: $file"
  "$IM" "$file" \
    -auto-orient \
    -resize "${MAX_PX}x${MAX_PX}>" \
    -quality "$QUALITY" \
    -gravity SouthEast \
    -fill "rgba(255,255,255,0.40)" \
    -font "$FONT" \
    -pointsize 20 \
    -annotate +16+14 "$WATERMARK_TEXT" \
    "$file"
  # Strip private metadata (serials, artist, GPS) — lossless, keeps
  # FNumber/ExposureTime/ISO/FocalLength for the EXIF tooltip on the site.
  # Also writes the processed marker so a second run skips this file.
  exiftool -quiet -overwrite_original \
    -SerialNumber= -BodySerialNumber= -LensSerialNumber= \
    -InternalSerialNumber= -Artist= -IFD1:Artist= -gps:all= \
    -UserComment="$PROCESSED_MARKER" \
    "$file"
  count=$((count + 1))
done < <(find "$TARGET_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo "Done — processed $count photo(s), skipped $skipped already-processed."
