"""
Feature extraction module for Algerian Sign Language recognition.
ConnectSign self-contained ML module.
"""

import logging
import os
from typing import Any, Dict, List, Optional, Tuple, Union
import cv2
import numpy as np

from app.ml.frame_sampler import FrameSampler

logger = logging.getLogger("ConnectSignFeatureExtractor")


class LandmarkFeatureExtractor:
    """
    Extracts hand and pose landmark sequences using MediaPipe Tasks or pre-extracted landmark dicts.
    Normalizes coordinates relative to torso/wrist for translation and scale invariance.
    Includes temporal dynamics, finger articulation geometry, and hand orientation.
    Output feature dimension: 3,453.
    """

    def __init__(
        self,
        num_frames: int = 16,
        hand_model_path: str = "hand_landmarker.task",
        pose_model_path: str = "pose_landmarker_lite.task",
        include_temporal_summary: bool = True,
    ):
        self.num_frames = num_frames
        self.include_temporal_summary = include_temporal_summary
        self.hand_model_path = self._resolve_model_path(hand_model_path)
        self.pose_model_path = self._resolve_model_path(pose_model_path)
        self.has_vision_detectors: bool = False
        self.hand_detector = None
        self.pose_detector = None
        self.mp = None

        self._try_init_detectors()

    @staticmethod
    def _resolve_model_path(path: str) -> str:
        """Resolve model asset path across standard locations."""
        if os.path.isabs(path) and os.path.exists(path):
            return path

        candidates = [
            path,
            os.path.join("models", path),
            os.path.join(os.path.dirname(__file__), "..", "..", "models", path),
            os.path.join(os.path.dirname(__file__), "..", "..", "models", os.path.basename(path)),
            os.path.join(os.getcwd(), "models", os.path.basename(path)),
        ]
        for c in candidates:
            if os.path.exists(c):
                return os.path.abspath(c)
        return path

    def _try_init_detectors(self):
        """Safely initialize MediaPipe vision detectors if task files exist."""
        if not os.path.exists(self.hand_model_path) or not os.path.exists(self.pose_model_path):
            logger.warning(
                "MediaPipe task assets not found (%s, %s). Vision frame decoding disabled; landmark dict inference remains available.",
                self.hand_model_path,
                self.pose_model_path,
            )
            self.has_vision_detectors = False
            return

        try:
            import mediapipe as mp
            from mediapipe.tasks import python as mp_tasks
            from mediapipe.tasks.python import vision

            self.mp = mp
            hand_options = vision.HandLandmarkerOptions(
                base_options=mp_tasks.BaseOptions(model_asset_path=self.hand_model_path),
                num_hands=2,
                min_hand_detection_confidence=0.3,
                min_hand_presence_confidence=0.3,
                min_tracking_confidence=0.3,
            )
            pose_options = vision.PoseLandmarkerOptions(
                base_options=mp_tasks.BaseOptions(model_asset_path=self.pose_model_path),
                min_pose_detection_confidence=0.3,
                min_pose_presence_confidence=0.3,
                min_tracking_confidence=0.3,
            )
            self.hand_detector = vision.HandLandmarker.create_from_options(hand_options)
            self.pose_detector = vision.PoseLandmarker.create_from_options(pose_options)
            self.has_vision_detectors = True
            logger.info("MediaPipe vision detectors initialized successfully.")
        except Exception as e:
            logger.warning("Failed to initialize MediaPipe vision detectors: %s", e)
            self.has_vision_detectors = False

    def extract_from_frames(self, frames: List[np.ndarray]) -> np.ndarray:
        """
        Sample frames and extract scale-invariant landmarks and temporal dynamics (3,453 dims).
        Requires MediaPipe vision detectors.
        """
        if len(frames) == 0:
            raise ValueError("Empty frames list provided to extract_from_frames")

        if not self.has_vision_detectors or self.hand_detector is None or self.pose_detector is None:
            raise RuntimeError(
                "MediaPipe vision task models are not available. Cannot process raw image frames."
            )

        sampler = FrameSampler(num_frames=self.num_frames, target_size=None, normalize=False)
        indices = sampler.compute_frame_indices(len(frames))
        sampled = [frames[i] for i in indices]

        POSE_KEY_INDICES = [0, 11, 12, 13, 14, 15, 16]
        FINGERTIP_INDICES = [4, 8, 12, 16, 20]

        frame_vectors = []
        wrist_trajectories = {"left": [], "right": []}

        for frame in sampled:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_img = self.mp.Image(image_format=self.mp.ImageFormat.SRGB, data=rgb)

            # 1. Pose landmarks
            pose_res = self.pose_detector.detect(mp_img)
            torso_cx, torso_cy, torso_cz = 0.5, 0.5, 0.0
            shoulder_scale = 1.0

            if pose_res.pose_landmarks and len(pose_res.pose_landmarks) > 0:
                p_lms = pose_res.pose_landmarks[0]
                if len(p_lms) > 12:
                    p11, p12 = p_lms[11], p_lms[12]
                    torso_cx = (p11.x + p12.x) / 2.0
                    torso_cy = (p11.y + p12.y) / 2.0
                    torso_cz = (p11.z + p12.z) / 2.0
                    s_dist = np.sqrt((p11.x - p12.x) ** 2 + (p11.y - p12.y) ** 2 + (p11.z - p12.z) ** 2)
                    if s_dist > 0.05:
                        shoulder_scale = float(s_dist)

                p_vals = []
                for idx in POSE_KEY_INDICES:
                    if idx < len(p_lms):
                        p_vals.extend([
                            (p_lms[idx].x - torso_cx) / shoulder_scale,
                            (p_lms[idx].y - torso_cy) / shoulder_scale,
                            (p_lms[idx].z - torso_cz) / shoulder_scale,
                        ])
                    else:
                        p_vals.extend([0.0, 0.0, 0.0])
                pose_vec = np.array(p_vals, dtype=np.float32)
            else:
                pose_vec = np.zeros(len(POSE_KEY_INDICES) * 3, dtype=np.float32)

            # 2. Hand landmarks
            left_dict = {
                "present": 0.0,
                "wrist_rel": [0.0, 0.0, 0.0],
                "scale": 0.0,
                "norm_lms": np.zeros(63, dtype=np.float32),
                "palm_normal": [0.0, 0.0, 0.0],
                "palm_dir": [0.0, 0.0, 0.0],
                "ftips": [0.0] * 5,
                "pinch": 0.0,
            }
            right_dict = {
                "present": 0.0,
                "wrist_rel": [0.0, 0.0, 0.0],
                "scale": 0.0,
                "norm_lms": np.zeros(63, dtype=np.float32),
                "palm_normal": [0.0, 0.0, 0.0],
                "palm_dir": [0.0, 0.0, 0.0],
                "ftips": [0.0] * 5,
                "pinch": 0.0,
            }

            hand_res = self.hand_detector.detect(mp_img)
            if hand_res.hand_landmarks:
                for h_idx, lms in enumerate(hand_res.hand_landmarks):
                    if len(lms) < 21:
                        continue

                    raw_pts = np.array([[lm.x, lm.y, lm.z] for lm in lms], dtype=np.float32)
                    w_pt = raw_pts[0]
                    mcp9_pt = raw_pts[9]

                    h_scale = float(np.linalg.norm(mcp9_pt - w_pt))
                    if h_scale < 1e-4:
                        h_scale = 0.1

                    wrist_rel = [
                        float((w_pt[0] - torso_cx) / shoulder_scale),
                        float((w_pt[1] - torso_cy) / shoulder_scale),
                        float((w_pt[2] - torso_cz) / shoulder_scale),
                    ]

                    norm_pts = (raw_pts - w_pt) / h_scale
                    palm_dir = (mcp9_pt - w_pt) / h_scale
                    v1 = raw_pts[5] - w_pt
                    v2 = raw_pts[17] - w_pt
                    normal = np.cross(v1, v2)
                    norm_mag = np.linalg.norm(normal)
                    palm_normal = (normal / norm_mag).tolist() if norm_mag > 1e-5 else [0.0, 0.0, 1.0]

                    ftips = [float(np.linalg.norm(raw_pts[f_idx] - w_pt) / h_scale) for f_idx in FINGERTIP_INDICES]
                    pinch = float(np.linalg.norm(raw_pts[4] - raw_pts[8]) / h_scale)

                    h_data = {
                        "present": 1.0,
                        "wrist_rel": wrist_rel,
                        "scale": h_scale,
                        "norm_lms": norm_pts.flatten(),
                        "palm_normal": palm_normal,
                        "palm_dir": palm_dir.tolist(),
                        "ftips": ftips,
                        "pinch": pinch,
                    }

                    side = "Unknown"
                    if hand_res.handedness and h_idx < len(hand_res.handedness):
                        if len(hand_res.handedness[h_idx]) > 0:
                            side = hand_res.handedness[h_idx][0].category_name

                    if side == "Left":
                        left_dict = h_data
                    elif side == "Right":
                        right_dict = h_data
                    else:
                        if h_idx == 0:
                            left_dict = h_data
                        elif h_idx == 1:
                            right_dict = h_data

            wrist_trajectories["left"].append(left_dict["wrist_rel"])
            wrist_trajectories["right"].append(right_dict["wrist_rel"])

            def pack_hand(hd):
                return np.concatenate([
                    [hd["present"]],
                    hd["wrist_rel"],
                    [hd["scale"]],
                    hd["norm_lms"],
                    hd["palm_normal"],
                    hd["palm_dir"],
                    hd["ftips"],
                    [hd["pinch"]],
                ]).astype(np.float32)

            left_vec = pack_hand(left_dict)
            right_vec = pack_hand(right_dict)

            frame_features = np.concatenate([pose_vec, left_vec, right_vec]).astype(np.float32)
            frame_vectors.append(frame_features)

        seq_mat = np.stack(frame_vectors, axis=0)
        raw_feat = seq_mat.flatten()

        if not self.include_temporal_summary:
            return raw_feat

        mean_seq = np.mean(seq_mat, axis=0)
        std_seq = np.std(seq_mat, axis=0)
        diff_seq = np.diff(seq_mat, axis=0)
        mean_diff = np.mean(np.abs(diff_seq), axis=0)

        lw = np.array(wrist_trajectories["left"], dtype=np.float32)
        rw = np.array(wrist_trajectories["right"], dtype=np.float32)
        l_net = lw[-1] - lw[0]
        r_net = rw[-1] - rw[0]
        l_path = np.sum(np.linalg.norm(np.diff(lw, axis=0), axis=1))
        r_path = np.sum(np.linalg.norm(np.diff(rw, axis=0), axis=1))
        l_range = np.max(lw, axis=0) - np.min(lw, axis=0)
        r_range = np.max(rw, axis=0) - np.min(rw, axis=0)

        traj_stats = np.concatenate([l_net, r_net, [l_path, r_path], l_range, r_range]).astype(np.float32)

        final_features = np.concatenate([
            raw_feat,
            mean_seq,
            std_seq,
            mean_diff,
            traj_stats,
        ]).astype(np.float32)

        return final_features

    def extract_from_landmark_dicts(self, frames_data: List[Dict[str, Any]]) -> np.ndarray:
        """
        Extract 3,453-dim feature vector directly from pre-extracted landmark dictionaries
        (such as frontend LandmarkFrame[]).
        Runs 100% locally with zero dependency on MediaPipe .task model files.
        """
        if not frames_data:
            raise ValueError("Empty frames_data list provided")

        num_in = len(frames_data)
        sampler = FrameSampler(num_frames=self.num_frames, target_size=None, normalize=False)
        indices = sampler.compute_frame_indices(num_in)
        sampled = [frames_data[i] for i in indices]

        POSE_KEY_INDICES = [0, 11, 12, 13, 14, 15, 16]
        FINGERTIP_INDICES = [4, 8, 12, 16, 20]

        frame_vectors = []
        wrist_trajectories = {"left": [], "right": []}

        for fd in sampled:
            # 1. Pose landmarks
            pose_lms = fd.get("pose", [])
            torso_cx, torso_cy, torso_cz = 0.5, 0.5, 0.0
            shoulder_scale = 1.0

            if pose_lms and len(pose_lms) > 12:
                p11 = pose_lms[11]
                p12 = pose_lms[12]
                x11, y11, z11 = (p11["x"], p11["y"], p11.get("z", 0.0)) if isinstance(p11, dict) else (p11.x, p11.y, getattr(p11, "z", 0.0))
                x12, y12, z12 = (p12["x"], p12["y"], p12.get("z", 0.0)) if isinstance(p12, dict) else (p12.x, p12.y, getattr(p12, "z", 0.0))
                torso_cx = (x11 + x12) / 2.0
                torso_cy = (y11 + y12) / 2.0
                torso_cz = (z11 + z12) / 2.0
                s_dist = np.sqrt((x11 - x12) ** 2 + (y11 - y12) ** 2 + (z11 - z12) ** 2)
                if s_dist > 0.05:
                    shoulder_scale = float(s_dist)

                p_vals = []
                for idx in POSE_KEY_INDICES:
                    if idx < len(pose_lms):
                        lm = pose_lms[idx]
                        lx, ly, lz = (lm["x"], lm["y"], lm.get("z", 0.0)) if isinstance(lm, dict) else (lm.x, lm.y, getattr(lm, "z", 0.0))
                        p_vals.extend([
                            (lx - torso_cx) / shoulder_scale,
                            (ly - torso_cy) / shoulder_scale,
                            (lz - torso_cz) / shoulder_scale,
                        ])
                    else:
                        p_vals.extend([0.0, 0.0, 0.0])
                pose_vec = np.array(p_vals, dtype=np.float32)
            else:
                pose_vec = np.zeros(len(POSE_KEY_INDICES) * 3, dtype=np.float32)

            # 2. Hand landmarks
            left_dict = {
                "present": 0.0,
                "wrist_rel": [0.0, 0.0, 0.0],
                "scale": 0.0,
                "norm_lms": np.zeros(63, dtype=np.float32),
                "palm_normal": [0.0, 0.0, 0.0],
                "palm_dir": [0.0, 0.0, 0.0],
                "ftips": [0.0] * 5,
                "pinch": 0.0,
            }
            right_dict = {
                "present": 0.0,
                "wrist_rel": [0.0, 0.0, 0.0],
                "scale": 0.0,
                "norm_lms": np.zeros(63, dtype=np.float32),
                "palm_normal": [0.0, 0.0, 0.0],
                "palm_dir": [0.0, 0.0, 0.0],
                "ftips": [0.0] * 5,
                "pinch": 0.0,
            }

            hands = fd.get("hands", [])
            for h_idx, lms in enumerate(hands):
                if len(lms) < 21:
                    continue

                raw_pts = []
                for pt in lms:
                    if isinstance(pt, dict):
                        raw_pts.append([pt["x"], pt["y"], pt.get("z", 0.0)])
                    else:
                        raw_pts.append([pt.x, pt.y, getattr(pt, "z", 0.0)])
                raw_pts = np.array(raw_pts, dtype=np.float32)

                w_pt = raw_pts[0]
                mcp9_pt = raw_pts[9]
                h_scale = float(np.linalg.norm(mcp9_pt - w_pt))
                if h_scale < 1e-4:
                    h_scale = 0.1

                wrist_rel = [
                    float((w_pt[0] - torso_cx) / shoulder_scale),
                    float((w_pt[1] - torso_cy) / shoulder_scale),
                    float((w_pt[2] - torso_cz) / shoulder_scale),
                ]

                norm_pts = (raw_pts - w_pt) / h_scale
                palm_dir = (mcp9_pt - w_pt) / h_scale
                v1 = raw_pts[5] - w_pt
                v2 = raw_pts[17] - w_pt
                normal = np.cross(v1, v2)
                norm_mag = np.linalg.norm(normal)
                palm_normal = (normal / norm_mag).tolist() if norm_mag > 1e-5 else [0.0, 0.0, 1.0]

                ftips = [float(np.linalg.norm(raw_pts[f_idx] - w_pt) / h_scale) for f_idx in FINGERTIP_INDICES]
                pinch = float(np.linalg.norm(raw_pts[4] - raw_pts[8]) / h_scale)

                h_data = {
                    "present": 1.0,
                    "wrist_rel": wrist_rel,
                    "scale": h_scale,
                    "norm_lms": norm_pts.flatten(),
                    "palm_normal": palm_normal,
                    "palm_dir": palm_dir.tolist(),
                    "ftips": ftips,
                    "pinch": pinch,
                }

                if h_idx == 0 and w_pt[0] < torso_cx:
                    left_dict = h_data
                elif h_idx == 1 or w_pt[0] >= torso_cx:
                    right_dict = h_data
                else:
                    left_dict = h_data

            wrist_trajectories["left"].append(left_dict["wrist_rel"])
            wrist_trajectories["right"].append(right_dict["wrist_rel"])

            def pack_hand(hd):
                return np.concatenate([
                    [hd["present"]],
                    hd["wrist_rel"],
                    [hd["scale"]],
                    hd["norm_lms"],
                    hd["palm_normal"],
                    hd["palm_dir"],
                    hd["ftips"],
                    [hd["pinch"]],
                ]).astype(np.float32)

            left_vec = pack_hand(left_dict)
            right_vec = pack_hand(right_dict)
            frame_features = np.concatenate([pose_vec, left_vec, right_vec]).astype(np.float32)
            frame_vectors.append(frame_features)

        seq_mat = np.stack(frame_vectors, axis=0)
        raw_feat = seq_mat.flatten()

        if not self.include_temporal_summary:
            return raw_feat

        mean_seq = np.mean(seq_mat, axis=0)
        std_seq = np.std(seq_mat, axis=0)
        diff_seq = np.diff(seq_mat, axis=0)
        mean_diff = np.mean(np.abs(diff_seq), axis=0)

        lw = np.array(wrist_trajectories["left"], dtype=np.float32)
        rw = np.array(wrist_trajectories["right"], dtype=np.float32)
        l_net = lw[-1] - lw[0]
        r_net = rw[-1] - rw[0]
        l_path = np.sum(np.linalg.norm(np.diff(lw, axis=0), axis=1))
        r_path = np.sum(np.linalg.norm(np.diff(rw, axis=0), axis=1))
        l_range = np.max(lw, axis=0) - np.min(lw, axis=0)
        r_range = np.max(rw, axis=0) - np.min(rw, axis=0)

        traj_stats = np.concatenate([l_net, r_net, [l_path, r_path], l_range, r_range]).astype(np.float32)

        final_features = np.concatenate([
            raw_feat,
            mean_seq,
            std_seq,
            mean_diff,
            traj_stats,
        ]).astype(np.float32)

        return final_features

    def close(self):
        if self.hand_detector is not None and hasattr(self.hand_detector, "close"):
            self.hand_detector.close()
        if self.pose_detector is not None and hasattr(self.pose_detector, "close"):
            self.pose_detector.close()
