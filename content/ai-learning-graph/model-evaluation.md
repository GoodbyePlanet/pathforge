---
assignee: John Doe
---

# Model Evaluation

Model evaluation measures how well a trained model performs and whether it will generalize to new data. Good evaluation is as important as good training.

## Train / Validation / Test Split

- **Train set** — data the model learns from
- **Validation set** — data used to tune hyperparameters and detect overfitting during development
- **Test set** — held-out data used only for final evaluation; never used to make decisions

Cross-contamination between these sets leads to overly optimistic estimates of real-world performance.

## Classification Metrics

- **Accuracy** — fraction of correct predictions (misleading with class imbalance)
- **Precision** — of all positive predictions, how many were correct
- **Recall** — of all actual positives, how many did we catch
- **F1 score** — harmonic mean of precision and recall
- **ROC-AUC** — model's ability to discriminate between classes at all thresholds

## Regression Metrics

- **MAE** (Mean Absolute Error) — average magnitude of errors
- **RMSE** (Root Mean Squared Error) — penalizes large errors more heavily
- **R²** — proportion of variance explained by the model

## Overfitting vs Underfitting

**Overfitting** — low training error, high validation error. The model memorized the training data. Fix: more data, regularization, simpler model.

**Underfitting** — high error on both sets. The model lacks capacity. Fix: more complex model, better features, longer training.