# ConnectSign AI Model Artifacts

## Provenance and Specifications

- **Model Type**: Calibrated Linear Support Vector Machine (`LinearSVC`, $C=0.1$, $L_2$ penalty, `dual=False`) with `StandardScaler`.
- **Target Domain**: Algerian Sign Language (LSA / لغة الإشارة الجزائرية) — Medical & Pharmacy Communication.
- **Dataset Source**: VDzSL Benchmark (Zenodo DOI: `10.5281/zenodo.18209839`, PMC12925472).
- **Training Population**: 4 Avatars (`signer0`..`signer3`) across 5 viewpoints (`cam0`..`cam4`), 20 verified samples per class.
- **Feature Representation**: Spatio-Temporal 21-hand keypoint + upper body pose normalized coordinate trajectories ($D = 3{,}453$ features per 16-frame window).
- **Active Vocabulary Classes**: 32 verified healthcare signs (including the 10 MVP target signs).

## Artifact Files

| File | Size | Role |
|------|------|------|
| `best_model.joblib` | ~833 KB | Serialized scikit-learn classifier pipeline |
| `config.json` | ~1 KB | Feature dimension, hyperparameter metadata, and target class names |
| `mvp_classes.json` | ~7.8 KB | Numerical ID $\leftrightarrow$ Arabic label mapping and metadata |
| `hand_landmarker.task` | ~7.8 MB | MediaPipe Hand Landmarker model (21 keypoints per hand) |
| `pose_landmarker_lite.task` | ~5.8 MB | MediaPipe Pose Landmarker model (upper body skeleton) |

## Loading Protocol

Models are loaded once at application startup into memory by `app.services.inference.InferenceService`. Inference runs entirely on CPU ($< 1$ ms latency per prediction).
