// Debugging lab — realistic ML bugs the learner must diagnose.
// The code snippets are illustrative (shown, not executed in-browser);
// fixed code stays in the same numpy/pandas-only style as the challenges.
import type { DebuggingCase } from '../types';

export const DEBUGGING_CASES: DebuggingCase[] = [
  {
    id: 'dbg-scaling-before-split',
    title: 'The Model That Only Worked in the Notebook',
    bugType: 'Data Leakage',
    difficulty: 'Medium',
    scenario:
      'Priya builds a customer-churn classifier. In her notebook it scores 94% accuracy on the test set, so the team ships it. In production the same model scores 78%. Her pipeline standardizes the features — and she fit the scaler on the full dataset before splitting it into train and test.',
    brokenCode: `import numpy as np

X = np.load("features.npy")   # all 10,000 customers
y = np.load("churn.npy")

# Standardize FIRST...
mean = X.mean(axis=0)
std = X.std(axis=0)
X_scaled = (X - mean) / std

# ...then split
X_train, X_test = X_scaled[:8000], X_scaled[8000:]
y_train, y_test = y[:8000], y[8000:]

model = fit_classifier(X_train, y_train)
print("test accuracy:", accuracy(model, X_test, y_test))  # 0.94`,
    options: [
      'The test set is too small at 2,000 rows, so the accuracy estimate is noisy.',
      'Fitting the scaler on the full data leaks test-set statistics (mean and std) into the training features, inflating the test score.',
      'StandardScaler-style standardization should never be used with a classifier.',
      'The data was not shuffled before splitting, so the test set is unrepresentative.',
    ],
    correctIndex: 1,
    explanation:
      'The mean and standard deviation were computed from all 10,000 rows, including the 2,000 test rows. Every training feature was therefore scaled using information from the test set — the model effectively peeked at the answers before the exam. Offline accuracy looked great (94%) because the test data had already influenced training; in production, where new customers arrive with no such peek, the real accuracy is 78%. The fix is the golden rule: split first, then fit any preprocessing (scaler, imputer, encoder) on the training split only, and apply the fitted transform to the test split.',
    fixedCode: `import numpy as np

X = np.load("features.npy")
y = np.load("churn.npy")

# Split FIRST...
X_train, X_test = X[:8000], X[8000:]
y_train, y_test = y[:8000], y[8000:]

# ...then fit the scaler on TRAIN only and apply it to both.
mean = X_train.mean(axis=0)
std = X_train.std(axis=0)
X_train_scaled = (X_train - mean) / std
X_test_scaled = (X_test - mean) / std

model = fit_classifier(X_train_scaled, y_train)
print("test accuracy:", accuracy(model, X_test_scaled, y_test))`,
    skills: ['Preprocessing', 'Model Selection', 'Problem Solving'],
  },
  {
    id: 'dbg-train-on-test',
    title: '99% Accuracy — Too Good to Be True',
    bugType: 'Train/Test Contamination',
    difficulty: 'Easy',
    scenario:
      'Arjun is thrilled: his first loan-default model hits 99% accuracy. His manager is suspicious, because the team\'s previous best was 71%. Looking at his notebook, the manager spots the problem in two lines: Arjun fit the model on the test set and then evaluated it on the same test set.',
    brokenCode: `import numpy as np

X_train, X_test, y_train, y_test = make_split(X, y, test_size=0.2)

# BUG: trained on the TEST set...
model = fit_classifier(X_test, y_test)

# ...and evaluated on the same TEST set.
print("test accuracy:", accuracy(model, X_test, y_test))  # 0.99`,
    options: [
      'The model is overfitting because it has too many parameters for this dataset.',
      'The model was trained on the test set, so the 99% measures memorization of answers it already saw — not generalization to new data.',
      'Accuracy is the wrong metric for loan-default prediction.',
      'The train/test split ratio of 80/20 is wrong; it should be 50/50.',
    ],
    correctIndex: 1,
    explanation:
      'Evaluating a model on the exact data it was trained on tells you how well it memorizes, not how well it predicts. A flexible model can drive training accuracy toward 100% by remembering individual rows, which is exactly what happened here: the 99% is a memorization score. The honest number comes from data the model never saw during training. In production this model would perform like any other model — around 71% — and the team would have shipped a "99% accurate" model on a false promise. Always fit on train, evaluate on test, and treat any suspiciously perfect score as a bug until proven otherwise.',
    fixedCode: `import numpy as np

X_train, X_test, y_train, y_test = make_split(X, y, test_size=0.2)

# Fit on TRAIN...
model = fit_classifier(X_train, y_train)

# ...evaluate on TEST (data the model never saw).
print("test accuracy:", accuracy(model, X_test, y_test))`,
    skills: ['Model Selection', 'Evaluation', 'Problem Solving'],
  },
  {
    id: 'dbg-accuracy-imbalanced',
    title: 'The Fraud Detector That Caught Nothing',
    bugType: 'Wrong Metric',
    difficulty: 'Medium',
    scenario:
      'A payments fintech builds a fraud detector. The model reports 99.5% accuracy and the team celebrates — until the fraud team points out that it has not flagged a single fraudulent transaction in a month. Only 0.5% of transactions are fraud, and the model learned the cheapest trick in the book: predict "not fraud" for everything.',
    brokenCode: `import numpy as np

# 10,000 transactions, only 50 are fraud (0.5%)
y_true = np.array([0] * 9950 + [1] * 50)
y_pred = model.predict(X_test)   # the model predicts 0 for every row

accuracy = (y_pred == y_true).mean()
print("accuracy:", accuracy)  # 0.995 — looks amazing, catches 0 fraud`,
    options: [
      'The model needs far more training data before it can learn the fraud pattern.',
      'Accuracy hides the failure: with 99.5% negatives, a model that never flags fraud still scores 99.5%. Precision, recall and the confusion matrix are the honest metrics here.',
      'The features were not standardized, so the model could not learn properly.',
      'The train/test split was not stratified, so the test set has no fraud cases.',
    ],
    correctIndex: 1,
    explanation:
      'On imbalanced data, accuracy is dominated by the majority class. A model that predicts "not fraud" for every transaction is right 99.5% of the time and useless 100% of the time — it catches zero fraud while real losses continue. What matters for fraud is recall on the fraud class (what fraction of real fraud did we catch?) and precision (of the transactions we flagged, how many were really fraud?), plus the business cost of each false positive (a blocked genuine customer) and false negative (a missed fraud). In production, optimizing accuracy alone would keep shipping models that look perfect on a dashboard while fraud losses grow unchecked.',
    fixedCode: `import numpy as np

y_true = np.array([0] * 9950 + [1] * 50)
y_pred = model.predict(X_test)

tp = int(((y_true == 1) & (y_pred == 1)).sum())
fp = int(((y_true == 0) & (y_pred == 1)).sum())
fn = int(((y_true == 1) & (y_pred == 0)).sum())
precision = tp / (tp + fp) if tp + fp else 0.0
recall = tp / (tp + fn) if tp + fn else 0.0
print("TP:", tp, "FP:", fp, "FN:", fn)
print("precision:", precision, "recall:", recall)
# Then: tune the decision threshold or use class weights so the
# model is actually rewarded for catching fraud.`,
    skills: ['Evaluation', 'Problem Solving', 'Interview Readiness'],
  },
  {
    id: 'dbg-scaler-refit',
    title: 'Train and Test on Different Scales',
    bugType: 'Inconsistent Preprocessing',
    difficulty: 'Medium',
    scenario:
      'Meera knows she must not fit her scaler on the full dataset, so she is careful: she standardizes the training set, and standardizes the test set separately. Her model still underperforms in production. The bug is subtler this time — fitting the scaler twice puts train and test on two different scales, so the model sees shifted inputs at test time.',
    brokenCode: `import numpy as np

X_train = np.array([[10.0, 100.0], [20.0, 200.0], [30.0, 300.0]])
X_test = np.array([[25.0, 250.0], [50.0, 500.0]])

# BUG: the scaler is FIT separately on each split, so each split
# gets its own mean and std — the two sets are on different scales.
X_train_scaled = (X_train - X_train.mean(axis=0)) / X_train.std(axis=0)
X_test_scaled = (X_test - X_test.mean(axis=0)) / X_test.std(axis=0)

model = fit_regressor(X_train_scaled, y_train)
print(model.predict(X_test_scaled))  # predictions are off`,
    options: [
      'Standardizing twice doubles the effect of the scaling.',
      'Fitting the scaler separately on the test set puts train and test on different scales, so the model receives inputs shifted relative to what it learned on.',
      'Test data should never be scaled at all — only training data needs scaling.',
      'MinMaxScaler should have been used instead of standardization.',
    ],
    correctIndex: 1,
    explanation:
      'A scaler is part of the model: it is fitted once, on training data, and then the same fitted transform is applied to every future input. Fitting it again on the test set computes a different mean and std, so a test value of 25 becomes 0.0 under the train scaler but -1.0 under the test scaler — the same real-world value maps to different model inputs depending on which batch it arrived in. The model then makes predictions on a coordinate system it never trained on. In production this shows up as mysteriously degraded performance that no amount of model tuning fixes, because the bug is in the data pipeline, not the model. Fit once on train; transform everywhere else.',
    fixedCode: `import numpy as np

X_train = np.array([[10.0, 100.0], [20.0, 200.0], [30.0, 300.0]])
X_test = np.array([[25.0, 250.0], [50.0, 500.0]])

# Fit ONCE on train...
mean = X_train.mean(axis=0)
std = X_train.std(axis=0)

# ...transform both splits with those same values.
X_train_scaled = (X_train - mean) / std
X_test_scaled = (X_test - mean) / std

model = fit_regressor(X_train_scaled, y_train)
print(model.predict(X_test_scaled))`,
    skills: ['Preprocessing', 'Problem Solving'],
  },
  {
    id: 'dbg-onehot-after-split',
    title: 'The Mystery Column Mismatch',
    bugType: 'Encoding Mismatch',
    difficulty: 'Hard',
    scenario:
      'Rohan one-hot encodes the "city" column with pandas get_dummies — but he applies it to the train and test sets separately. Training works fine. At prediction time the code crashes with a shape mismatch: the test set has a "Jaipur" column the model never saw, and is missing the "Indore" column it trained on. On another run it does not crash at all — it silently misaligns the columns and predicts garbage.',
    brokenCode: `import pandas as pd

train = pd.DataFrame({"city": ["Mumbai", "Pune", "Indore"], "sales": [10, 20, 30]})
test = pd.DataFrame({"city": ["Mumbai", "Jaipur"], "sales": [15, 25]})

# BUG: encoding each split separately builds DIFFERENT columns.
X_train = pd.get_dummies(train[["city"]])  # Mumbai, Pune, Indore
X_test = pd.get_dummies(test[["city"]])    # Mumbai, Jaipur

model = fit_regressor(X_train, train["sales"])
model.predict(X_test)  # shape mismatch — or silent misalignment`,
    options: [
      'get_dummies cannot handle string columns; the cities must be converted to numbers first.',
      'Encoding train and test separately produces different columns, so the model receives misaligned features at prediction time.',
      'One-hot encoding only works for binary targets, not multi-category features.',
      'The categories need label encoding before one-hot encoding.',
    ],
    correctIndex: 1,
    explanation:
      'One-hot encoding defines the model\'s feature space: each category becomes one column, and the model learns one weight per column. Encoding the splits separately builds two different feature spaces — the test set gains a Jaipur column the model has no weight for and loses the Indore column it does have a weight for. Depending on the library this either crashes (the lucky outcome) or silently lines up the wrong columns (the dangerous one: Jaipur\'s 1s land in the Indore weight\'s slot). The fix is to define the column set once, from the training categories, and force the test set into exactly those columns — unseen categories simply get all zeros. In production, new categories appear all the time, so this alignment step is not optional.',
    fixedCode: `import pandas as pd

train = pd.DataFrame({"city": ["Mumbai", "Pune", "Indore"], "sales": [10, 20, 30]})
test = pd.DataFrame({"city": ["Mumbai", "Jaipur"], "sales": [15, 25]})

# Define the columns ONCE, from the training categories...
X_train = pd.get_dummies(train[["city"]])

# ...and force the test set into exactly those columns.
# Unseen categories (Jaipur) become all zeros; missing ones stay 0.
X_test = pd.get_dummies(test[["city"]]).reindex(columns=X_train.columns, fill_value=0)

model = fit_regressor(X_train, train["sales"])
model.predict(X_test)  # shapes match, columns aligned`,
    skills: ['Preprocessing', 'Problem Solving', 'Deployment'],
  },
  {
    id: 'dbg-timeseries-shuffle',
    title: 'The Forecast That Knew the Future',
    bugType: 'Invalid Validation',
    difficulty: 'Hard',
    scenario:
      'A retail chain builds a model to forecast next week\'s sales from two years of daily data. The team validates it with 5-fold cross-validation — with shuffling turned on. CV error looks tiny. In live use the forecasts are far worse. Shuffling time-series data lets the model train on the future and test on the past, so the validation never measured what the business actually needs: predicting forward in time.',
    brokenCode: `import numpy as np

# Two years of daily sales, in chronological order
sales = np.load("daily_sales.npy")  # shape (730,)
X, y = build_features(sales)        # X[i] uses days before i

# BUG: shuffling folds mixes past and future. Fold 3's "test" days
# sit BETWEEN training days — the model has already seen the future.
rng = np.random.RandomState(42)
indices = rng.permutation(len(X))
folds = np.array_split(indices, 5)
for test_idx in folds:
    train_idx = np.array([i for i in indices if i not in set(test_idx.tolist())])
    model = fit_regressor(X[train_idx], y[train_idx])
    print("fold error:", mse(model, X[test_idx], y[test_idx]))  # tiny — and fake`,
    options: [
      'KFold cross-validation only works for classification, not regression.',
      'Shuffling time-series data lets the model train on future observations and test on past ones, so validation hides both leakage and drift.',
      'Five folds are too few for 730 days of data; at least 20 folds are needed.',
      'Sales data must be log-transformed before any cross-validation.',
    ],
    correctIndex: 1,
    explanation:
      'Random cross-validation assumes the rows are interchangeable — true for shuffled customer records, false for time series. When folds are shuffled, a model training on day 500 can use patterns from day 501 (which sits in the test fold of a neighbouring fold), and seasonal effects leak across the boundary. Worse, it hides drift: the model never has to predict a genuinely later period than the ones it trained on, which is exactly what forecasting is. In production the model faces a future it has never seen — new trends, new seasonality, post-promotion slumps — and the shuffled CV score gives no warning. The fix is walk-forward validation: train on the past, test on the next window, roll forward, and average the errors.',
    fixedCode: `import numpy as np

sales = np.load("daily_sales.npy")  # shape (730,), chronological
X, y = build_features(sales)

# Walk-forward validation: each test window comes AFTER its train window.
n = len(X)
window = 90  # test on the next 90 days each time
errors = []
for end in range(365, n - window + 1, window):
    X_train, y_train = X[:end], y[:end]          # the past
    X_test, y_test = X[end:end + window], y[end:end + window]  # the future
    model = fit_regressor(X_train, y_train)
    errors.append(mse(model, X_test, y_test))
print("walk-forward error:", float(np.mean(errors)))`,
    skills: ['Model Selection', 'Evaluation', 'Problem Solving'],
  },
];
