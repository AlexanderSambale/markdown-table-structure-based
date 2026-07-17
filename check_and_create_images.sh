#!/bin/bash
set -euo pipefail

IMAGES_DIR="./images/webp"
SCREENSHOTS_DIR="/tmp/test-resources/screenshots"

echo "=== Image Reference Check ==="

# Extract image references from README.md
IMAGE_NAMES=(
  "createTableByRows"
  "createTableByColumns"
  "concatTables"
  "concatTablesReverse"
  "transposeTable"
  "toLines"
  "toColumns"
)

# Get latest screenshots directory
get_latest_screenshot_dir() {
  if [ ! -d "$SCREENSHOTS_DIR" ]; then
    echo ""
    return 1
  fi
  
  # Find directories matching date format YYYYMMDDThhmmss
  local latest
  latest=$(ls -t "$SCREENSHOTS_DIR" | grep -E '^[0-9]{8}T[0-9]{6}$' | head -1)
  if [ -z "$latest" ]; then
    echo ""
    return 1
  fi
  echo "$SCREENSHOTS_DIR/$latest"
}

# Check if image exists in images directory
check_image_exists() {
  local name=$1
  local filename="${name}.webp"
  
  if [ -f "$IMAGES_DIR/$filename" ]; then
    return 0
  fi
  return 1
}

# Combine screenshot files into webp
combine_screenshots() {
  local name=$1
  local screenshot_dir=$2
  local output="$IMAGES_DIR/${name}.webp"
  
  echo "  Combining screenshots for: $name"
  
  # Find files starting with the name, sorted alphabetically
  local files
  files=$(find "$screenshot_dir" -maxdepth 1 -name "${name}*" -type f | sort | head -20)
  
  if [ -z "$files" ]; then
    echo "  No files found matching pattern: ${name}*"
    return 1
  fi
  
  # Create temporary directory for cropped screenshots
  local temp_cropped
  temp_cropped=$(mktemp -d)
  trap "rm -rf $temp_cropped" EXIT
  
  local cropped_files=""
  while IFS= read -r file; do
    local basename
    basename=$(basename "$file")
    local cropped="$temp_cropped/${basename}"
    
    # Crop each screenshot using ImageMagick convert
    magick "$file" -crop 1270x690+0+0 "$cropped"
    cropped_files="$cropped_files $cropped"
    echo "    Cropped: $basename"
  done <<< "$files"
  
  # Check if img2webp is available
  if command -v img2webp &>/dev/null; then
    echo "  Using img2webp to create animated webp"
    local file_list=""
    while IFS= read -r file; do
      file_list="$file_list $file"
    done <<< "$cropped_files"
    echo "  File list: $file_list"
    img2webp -d 1000 -lossy $file_list -o "$output"
    echo "  Created: $output"
    return 0
  fi
  
  # Fallback: Use ImageMagick convert
  if command -v magick &>/dev/null; then
    echo "  Using convert to create webp"
    local file_list=""
    while IFS= read -r file; do
      file_list="$file_list $file "
    done <<< "$cropped_files"
    echo "  File list: $file_list"
    magick $file_list -loop 0 "$output"
    echo "  Created: $output"
    return 0
  fi
  
  echo "  Warning: img2webp not available. Cannot combine screenshots."
  echo "  Manual step required: img2webp -d 1000 -lossy <cropped_files> -o $output"
  return 1
}

# Main logic
echo ""
echo "Checking images in: $IMAGES_DIR"
echo ""

missing_count=0

for name in "${IMAGE_NAMES[@]}"; do
  echo "Checking: $name"
  
  if check_image_exists "$name"; then
    echo "  ✓ Found in $IMAGES_DIR"
  else
    echo "  ✗ Missing from $IMAGES_DIR"
    missing_count=$((missing_count + 1))
    
    # Try to find in screenshots directory
    if screenshot_dir=$(get_latest_screenshot_dir); then
      echo "  Checking screenshots: $screenshot_dir"
      
      if find "$screenshot_dir" -maxdepth 1 -name "${name}*" -type f | grep -q .; then
        echo "  Found matching files in screenshots"
        combine_screenshots "$name" "$screenshot_dir"
      else
        echo "  No matching files in screenshots"
      fi
    fi
  fi
done

echo ""
echo "=== Summary ==="
echo "Missing images: $missing_count"
