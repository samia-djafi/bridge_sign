"""
Inspect and verify ConnectSign AI model artifacts.

Usage:
    python scripts/inspect_model.py [--model-dir models]
"""

import argparse
import json
import os
import sys
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import joblib
import numpy as np


def inspect(model_dir: str = "models"):
    print("=" * 65)
    print("      CONNECTSIGN AI — MODEL ARTIFACT INSPECTION       ")
    print("=" * 65)
    print(f"Artifacts Directory : {os.path.abspath(model_dir)}")

    config_path = os.path.join(model_dir, "config.json")
    model_path = os.path.join(model_dir, "best_model.joblib")
    classes_path = os.path.join(model_dir, "mvp_classes.json")

    for name, p in [("Config", config_path), ("Weights", model_path), ("Class Mapping", classes_path)]:
        exists = os.path.exists(p)
        size_kb = os.path.getsize(p) / 1024 if exists else 0
        status = f"EXISTS ({size_kb:.1f} KB)" if exists else "MISSING"
        print(f"  {name:<15}: {status:<20} -> {p}")

    if not os.path.exists(config_path) or not os.path.exists(model_path):
        print("\n[ERROR] Missing required model files.")
        return False

    with open(config_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    target_names = cfg.get("target_names", [])
    print("\n--- Model Metadata ---")
    print(f"Model Architecture  : {cfg.get('model_name', 'Linear SVM')}")
    print(f"Feature Dimension   : {cfg.get('feature_dim', 'N/A')}")
    print(f"Total Classes       : {len(target_names)}")
    print(f"Test Accuracy       : {cfg.get('test_accuracy', 0)*100:.1f}%")
    print(f"Macro F1 Score      : {cfg.get('test_macro_f1', 0)*100:.1f}%")
    print(f"Benchmark Latency   : {cfg.get('mean_latency_ms', 0):.2f} ms")

    # Load model
    print("\n--- Model Loading & Inference Test ---")
    t0 = time.time()
    try:
        from src.models.classifier import SignClassifier
        clf = SignClassifier.load(model_path)
    except Exception:
        clf = joblib.load(model_path)
    load_time_ms = (time.time() - t0) * 1000
    print(f"Model loaded successfully in {load_time_ms:.1f} ms.")

    # Test dummy prediction
    feat_dim = int(cfg.get("feature_dim", 3453))
    dummy_x = np.random.randn(1, feat_dim).astype(np.float32)
    t_inf0 = time.time()
    probs = clf.predict_proba(dummy_x)[0]
    inf_time_ms = (time.time() - t_inf0) * 1000

    top_idx = int(np.argmax(probs))
    top_label = target_names[top_idx] if top_idx < len(target_names) else f"Class_{top_idx}"
    top_prob = float(probs[top_idx])

    print(f"Dummy Feature Vector: shape={dummy_x.shape}, dtype={dummy_x.dtype}")
    print(f"Inference Latency   : {inf_time_ms:.2f} ms (CPU)")
    print(f"Sample Prediction   : '{top_label}' (Score: {top_prob:.1%})")
    print("\n[SUCCESS] Model artifact is valid and ready for inference.")
    print("=" * 65)
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Inspect ConnectSign model artifact.")
    parser.add_argument("--model-dir", default="models", help="Path to models directory")
    args = parser.parse_args()
    inspect(args.model_dir)
