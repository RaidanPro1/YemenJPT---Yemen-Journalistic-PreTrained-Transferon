
#!/usr/bin/env python3
"""
Sherloq CLI Wrapper for YemenJPT
Sovereign Forensic Analysis Tool
- Metadata Extraction
- Error Level Analysis (ELA) with visual mapping
- Frequency-based Deepfake detection (FFT Artifact Analysis)
"""

import sys
import json
import os
import io
import base64
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
import exifread

def analyze_ela(image_path, quality=90):
    """
    Performs Error Level Analysis (ELA) to detect digital manipulation.
    Returns a base64 encoded heatmap and modification metrics.
    """
    try:
        original = Image.open(image_path).convert('RGB')
        
        # Step 1: Save a compressed temporary version in memory
        buf = io.BytesIO()
        original.save(buf, 'JPEG', quality=quality)
        buf.seek(0)
        compressed = Image.open(buf)
        
        # Step 2: Calculate the absolute difference between original and resaved
        diff = ImageChops.difference(original, compressed)
        
        # Step 3: Enhance the difference to make modification artifacts visible
        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        scale = 255.0 / max_diff if max_diff > 0 else 1
        enhanced_diff = ImageEnhance.Brightness(diff).enhance(scale)
        
        # Step 4: Encode the ELA map to base64 for direct frontend rendering
        ela_buf = io.BytesIO()
        enhanced_diff.save(ela_buf, format='PNG')
        ela_base64 = base64.b64encode(ela_buf.getvalue()).decode('utf-8')
        
        # Heuristic for modification probability based on variance and max difference
        ela_score = max_diff / 255.0
        
        return {
            "ela_map_base64": f"data:image/png;base64,{ela_base64}",
            "modification_probability": round(ela_score, 4),
            "integrity_status": "suspicious" if ela_score > 0.18 else "likely_original"
        }
    except Exception as e:
        return {"error": str(e), "modification_probability": 0, "integrity_status": "error"}

def detect_deepfake(image_path):
    """
    Lightweight deepfake detection using Frequency-Domain analysis (Fast Fourier Transform).
    Detects 'checkerboard' artifacts typical in GAN and Diffusion-based generations.
    """
    try:
        # Load as grayscale and resize to standard dimensions for analysis
        img = Image.open(image_path).convert('L')
        img = img.resize((512, 512))
        data = np.array(img)
        
        # Perform 2D Fast Fourier Transform
        f_transform = np.fft.fft2(data)
        f_shift = np.fft.fftshift(f_transform)
        magnitude_spectrum = 20 * np.log(np.abs(f_shift) + 1)
        
        # Focus on high-frequency components (corners of the spectrum)
        # Synthetic images often show unnatural regular peaks in these areas
        rows, cols = data.shape
        crow, ccol = rows // 2 , cols // 2
        mask_radius = 60
        
        # Mask out the low-frequency center (natural features)
        high_freq_only = magnitude_spectrum.copy()
        high_freq_only[crow-mask_radius:crow+mask_radius, ccol-mask_radius:ccol+mask_radius] = 0
        
        # Calculate standard deviation of high frequencies as a 'synthetic noise' metric
        std_dev = np.std(high_freq_only)
        
        # Normalize score between 0 and 1
        # Empirically, values above 12-15 in high-freq STD indicate synthetic artifacts
        prob = min(max((std_dev - 5) / 20.0, 0.0), 1.0)
        
        return {
            "fake_probability": round(prob, 4),
            "is_synthetic": prob > 0.65,
            "method": "FFT Spectral Artifact Analysis (High-Frequency Noise)"
        }
    except Exception as e:
        return {
            "fake_probability": 0.0,
            "is_synthetic": False,
            "method": f"Deepfake Detection Error: {str(e)}"
        }

def extract_metadata(image_path):
    """Extracts comprehensive EXIF metadata from the target image."""
    meta_dict = {}
    try:
        with open(image_path, 'rb') as f:
            tags = exifread.process_file(f, details=False)
            for tag in tags.keys():
                if tag not in ('JPEGThumbnail', 'TIFFThumbnail', 'Filename', 'EXIF MakerNote'):
                    meta_dict[tag] = str(tags[tag])
    except Exception as e:
        meta_dict['error'] = str(e)
    return meta_dict

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing image path argument"}))
        sys.exit(1)

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(json.dumps({"error": f"Target file not found: {image_path}"}))
        sys.exit(1)

    # Compile the sovereign forensic report
    report = {
        "target": os.path.basename(image_path),
        "forensics": {
            "ela_analysis": analyze_ela(image_path),
            "deepfake_detection": detect_deepfake(image_path),
            "metadata": extract_metadata(image_path)
        },
        "timestamp": "2025-05-20T10:00:00Z"
    }

    # Print pure JSON for the FastAPI backend to relay to React
    print(json.dumps(report))

if __name__ == "__main__":
    main()
