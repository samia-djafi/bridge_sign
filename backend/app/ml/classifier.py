"""
Classifier models and wrappers for Algerian Sign Language isolated sign recognition.
ConnectSign self-contained ML module.
"""

from typing import Any, Dict, List, Optional, Tuple, Union
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.svm import LinearSVC


class SignClassifier:
    """
    Wrapper for sign language classifiers with preprocessing and probability estimation.
    """

    def __init__(
        self,
        model_type: str = "linear_svm",
        random_state: int = 42,
        **kwargs
    ):
        self.model_type = model_type
        self.random_state = random_state
        self.kwargs = kwargs
        self.scaler = StandardScaler()
        self.model = self._create_model(model_type, random_state, **kwargs)
        self.classes_ = None

    def _create_model(self, model_type: str, random_state: int, **kwargs):
        if model_type == "logistic_regression":
            return LogisticRegression(
                max_iter=kwargs.get("max_iter", 1000),
                C=kwargs.get("C", 1.0),
                solver="lbfgs",
                random_state=random_state,
            )
        elif model_type == "linear_svm":
            return LinearSVC(
                C=kwargs.get("C", 0.5),
                dual=False,
                max_iter=kwargs.get("max_iter", 2000),
                random_state=random_state,
            )
        elif model_type == "random_forest":
            return RandomForestClassifier(
                n_estimators=kwargs.get("n_estimators", 150),
                max_depth=kwargs.get("max_depth", 16),
                min_samples_split=kwargs.get("min_samples_split", 2),
                n_jobs=-1,
                random_state=random_state,
            )
        elif model_type == "mlp":
            return MLPClassifier(
                hidden_layer_sizes=kwargs.get("hidden_layer_sizes", (256, 128)),
                activation="relu",
                alpha=kwargs.get("alpha", 0.001),
                max_iter=kwargs.get("max_iter", 300),
                early_stopping=True,
                n_iter_no_change=15,
                random_state=random_state,
            )
        else:
            raise ValueError(f"Unknown model_type: {model_type}")

    def fit(self, X_train: np.ndarray, y_train: np.ndarray) -> "SignClassifier":
        """Scale features and fit model."""
        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)
        self.classes_ = self.model.classes_
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict class labels."""
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Estimate class probabilities or softmax decision scores."""
        X_scaled = self.scaler.transform(X)
        if hasattr(self.model, "predict_proba"):
            return self.model.predict_proba(X_scaled)
        elif hasattr(self.model, "decision_function"):
            df = self.model.decision_function(X_scaled)
            # Apply numerically stable softmax
            exp_df = np.exp(df - np.max(df, axis=1, keepdims=True))
            return exp_df / np.sum(exp_df, axis=1, keepdims=True)
        else:
            raise NotImplementedError("Model does not support probability estimation.")

    @classmethod
    def load(cls, filepath: str) -> "SignClassifier":
        """Load model from disk."""
        data = joblib.load(filepath)
        if isinstance(data, dict):
            instance = cls(
                model_type=data.get("model_type", "linear_svm"),
                random_state=data.get("random_state", 42),
                **data.get("kwargs", {})
            )
            instance.model = data["model"]
            instance.scaler = data["scaler"]
            instance.classes_ = data.get("classes_")
            return instance
        elif isinstance(data, SignClassifier):
            return data
        else:
            raise ValueError(f"Unsupported model artifact format: {type(data)}")
