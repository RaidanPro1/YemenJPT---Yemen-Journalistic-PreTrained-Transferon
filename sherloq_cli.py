
#!/usr/bin/env python3
"""
Sherloq CLI Wrapper for YemenJPT
Performs metadata extraction and simulated ELA (Error Level Analysis) 
for sovereign forensic validation.
Usage: ./sherloq_cli.py <image_path>
"""

import sys
import json
import os
from PIL import Image, ImageChops, ImageEnhance
import exifread

def analyze_ela(image_path, quality=90):
    """
    Simulates Error Level Analysis by resaving the image and diffing it.
    Real ELA highlights areas with different compression levels.
    """
    try:
        original = Image.open(image_path).convert('RGB')
        
        # Save compressed temporary version
        temp_path = f"{image_path}.ela.tmp.jpg"
        original.save(temp_path, 'JPEG', quality=quality)
        
        compressed = Image.open(temp_path).convert('RGB')
        
        # Calculate difference
        diff = ImageChops.difference(original, compressed)
        
        # Enhance brightness of difference to make it visible
        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        scale = 255.0 / max_diff if max_diff > 0 else 1
        diff = ImageEnhance.Brightness(diff).enhance(scale)
        
        # In a real tool, we would save this ELA map. 
        # Here we return a metric of modification probability.
        ela_score = max_diff / 255.0
        
        # Cleanup
        os.remove(temp_path)
        
        return {
            "ela_generated": True,
            "modification_probability": round(ela_score, 4),
            "integrity_status": "suspicious" if ela_score > 0.15 else "likely_original"
        }
    except Exception as e:
        return {"error": str(e)}

def extract_metadata(image_path):
    """Extracts EXIF data using exifread."""
    meta_dict = {}
    try:
        with open(image_path, 'rb') as f:
            tags = exifread.process_file(f)
            for tag in tags.keys():
                if tag not in ('JPEGThumbnail', 'TIFFThumbnail', 'Filename', 'EXIF MakerNote'):
                    meta_dict[tag] = str(tags[tag])
    except Exception as e:
        meta_dict['error'] = str(e)
    return meta_dict

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({"error": "File not found"}))
        sys.exit(1)

    # 1. Metadata Analysis
    metadata = extract_metadata(image_path)
    
    # 2. ELA Analysis
    ela_result = analyze_ela(image_path)

    # 3. Construct Final JSON Report
    report = {
        "tool": "Sherloq CLI Wrapper v1.0",
        "target": image_path,
        "forensics": {
            "metadata": metadata,
            "ela_analysis": ela_result
        },
        "timestamp": "2025-05-20T10:00:00Z" # Mock timestamp, would use time.now()
    }

    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
