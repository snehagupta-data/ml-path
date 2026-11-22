// Coding challenges — pure Python / NumPy / pandas only.
// scikit-learn is NOT available in the in-browser Pyodide runtime, so no
// challenge uses it. Each test runs AFTER the learner's code and must print
// "PASS" on success. Every test below was verified against its solution.
import type { CodingChallenge } from '../types';

export const CHALLENGES: CodingChallenge[] = [
  {
    id: 'ch-numpy-basics',
    title: 'NumPy Basics: Means and Masks',
    topic: 'NumPy',
    moduleId: 'm3',
    lessonId: 'm3-numpy',
    difficulty: 'Easy',
    description:
      'You have one week of daily revenue figures for a store. Compute the mean daily revenue, build a boolean mask for days with revenue above 150, and use it to select those days and find their mean. Success: mean_sales is the mean of all 7 days, high_mask is True exactly on the 200 and 300 days, and high_mean is 250.',
    starterCode: `import numpy as np

# Daily revenue (in thousands of rupees) for one week at a Mumbai store
sales = np.array([120, 85, 200, 150, 90, 300, 60])

# TODO 1: mean daily revenue
mean_sales = None

# TODO 2: boolean mask for days with revenue above 150
high_mask = None

# TODO 3: revenues on high days, and their mean
high_sales = None
high_mean = None

print("Mean:", mean_sales)
print("High days:", high_sales)
print("High-day mean:", high_mean)`,
    solution: `import numpy as np

# Daily revenue (in thousands of rupees) for one week at a Mumbai store
sales = np.array([120, 85, 200, 150, 90, 300, 60])

mean_sales = sales.mean()
high_mask = sales > 150
high_sales = sales[high_mask]
high_mean = high_sales.mean()

print("Mean:", mean_sales)
print("High days:", high_sales)
print("High-day mean:", high_mean)`,
    hints: [
      'NumPy arrays have a .mean() method — no loop needed.',
      'A comparison like sales > 150 returns an array of True/False values. That array IS the mask.',
      'Indexing an array with a boolean mask (sales[high_mask]) returns only the True elements.',
    ],
    tests: [
      {
        testCode: `assert abs(mean_sales - 1005 / 7) < 1e-6\nprint("PASS")`,
        description: 'mean_sales equals the mean of all 7 days (1005 / 7)',
      },
      {
        testCode: `assert high_mask.tolist() == [False, False, True, False, False, True, False]\nprint("PASS")`,
        description: 'high_mask is True exactly on the 200 and 300 days',
      },
      {
        testCode: `assert high_sales.tolist() == [200, 300]\nassert abs(high_mean - 250.0) < 1e-6\nprint("PASS")`,
        description: 'high_sales is [200, 300] and high_mean is 250',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Python', 'Statistics'],
  },
  {
    id: 'ch-pandas-filter',
    title: 'Pandas: Filter and GroupBy',
    topic: 'Pandas',
    moduleId: 'm3',
    lessonId: 'm3-pandas',
    difficulty: 'Easy',
    description:
      'You have a small orders table. Filter it down to high-value orders (amount above 500) and compute total revenue per category with groupby. Success: high_value has exactly the 3 orders above 500, and category_totals shows Electronics = 2350 and Fashion = 950.',
    starterCode: `import pandas as pd

orders = pd.DataFrame({
    "customer": ["A", "B", "A", "C", "B", "A"],
    "category": ["Electronics", "Fashion", "Electronics", "Fashion", "Electronics", "Fashion"],
    "amount": [800, 300, 650, 450, 900, 200],
})

# TODO 1: orders with amount above 500
high_value = None

# TODO 2: total amount per category
category_totals = None

print(high_value)
print(category_totals)`,
    solution: `import pandas as pd

orders = pd.DataFrame({
    "customer": ["A", "B", "A", "C", "B", "A"],
    "category": ["Electronics", "Fashion", "Electronics", "Fashion", "Electronics", "Fashion"],
    "amount": [800, 300, 650, 450, 900, 200],
})

high_value = orders[orders["amount"] > 500]
category_totals = orders.groupby("category")["amount"].sum()

print(high_value)
print(category_totals)`,
    hints: [
      'Filtering is boolean indexing: df[df["column"] > value].',
      'groupby("category") splits rows into groups; ["amount"].sum() aggregates each group.',
      'Check your filter with (high_value["amount"] > 500).all() — every row should pass.',
    ],
    tests: [
      {
        testCode: `assert len(high_value) == 3\nassert set(high_value["amount"]) == {800, 650, 900}\nprint("PASS")`,
        description: 'high_value holds exactly the 3 orders above 500',
      },
      {
        testCode: `assert category_totals["Electronics"] == 2350\nassert category_totals["Fashion"] == 950\nprint("PASS")`,
        description: 'category totals are Electronics 2350, Fashion 950',
      },
      {
        testCode: `assert bool((high_value["amount"] > 500).all())\nprint("PASS")`,
        description: 'every row in high_value really is above 500',
      },
    ],
    needsPackages: ['pandas'],
    skills: ['Python'],
  },
  {
    id: 'ch-missing-values',
    title: 'Handle Missing Values',
    topic: 'Data Quality',
    moduleId: 'm4',
    lessonId: 'm4-data-quality',
    difficulty: 'Easy',
    description:
      'A small employee table has missing ages and one missing salary. Fill the missing ages with the median age, then drop the row(s) where salary is still missing. Success: df_clean has 4 rows, no missing values at all, and the filled ages are 28 (the median of 25, 30, 28).',
    starterCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "name": ["Asha", "Rohan", "Meera", "Arjun", "Sara"],
    "age": [25, np.nan, 30, 28, np.nan],
    "salary": [50000, 60000, np.nan, 55000, 70000],
})

# TODO 1: fill missing ages with the median age
# TODO 2: drop rows where salary is still missing
# Store the result in df_clean
df_clean = df.copy()

print(df_clean)`,
    solution: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "name": ["Asha", "Rohan", "Meera", "Arjun", "Sara"],
    "age": [25, np.nan, 30, 28, np.nan],
    "salary": [50000, 60000, np.nan, 55000, 70000],
})

median_age = df["age"].median()
df_clean = df.copy()
df_clean["age"] = df_clean["age"].fillna(median_age)
df_clean = df_clean.dropna(subset=["salary"])

print(df_clean)`,
    hints: [
      'df["age"].median() ignores NaN automatically — the median of 25, 30, 28 is 28.',
      'fillna(value) replaces NaN; assign the result back to the column.',
      'dropna(subset=["salary"]) drops only rows missing a salary, not every row with any NaN.',
    ],
    tests: [
      {
        testCode: `assert int(df_clean["age"].isna().sum()) == 0\nassert int(df_clean["salary"].isna().sum()) == 0\nprint("PASS")`,
        description: 'df_clean has no missing ages or salaries',
      },
      {
        testCode: `assert len(df_clean) == 4\nassert df_clean["age"].tolist() == [25.0, 28.0, 28.0, 28.0]\nprint("PASS")`,
        description: '4 rows remain and the filled ages are 28',
      },
      {
        testCode: `assert df_clean["salary"].tolist() == [50000.0, 60000.0, 55000.0, 70000.0]\nprint("PASS")`,
        description: 'the row with the missing salary was dropped',
      },
    ],
    needsPackages: ['pandas', 'numpy'],
    skills: ['Preprocessing', 'Python'],
  },
  {
    id: 'ch-train-test-split',
    title: 'Fix the Broken Train-Test Split',
    topic: 'Train-Test Split',
    moduleId: 'm4',
    lessonId: 'm4-train-test-split',
    difficulty: 'Medium',
    description:
      'This toy dataset is sorted by class: the first 10 rows are class 0, the last 10 are class 1 — exactly what a real CSV sorted by its target column looks like. The starter code takes the first 80% as train and the rest as test, so the test set contains only class 1. Fix it: shuffle the indices with seed 42, then split 80/20. Success: both classes appear in both sets, the sets are disjoint, and together they cover all 20 rows.',
    starterCode: `import numpy as np

# Toy data: first 10 rows are class 0, last 10 are class 1
# (imagine a CSV sorted by the target column)
X = np.arange(20)
y = np.array([0] * 10 + [1] * 10)

# BUG: taking the first 80% as train and the rest as test
# silently puts only ONE class in the test set.
X_train, X_test = X[:16], X[16:]
y_train, y_test = y[:16], y[16:]

print("train classes:", sorted(set(y_train.tolist())))
print("test classes:", sorted(set(y_test.tolist())))`,
    solution: `import numpy as np

# Toy data: first 10 rows are class 0, last 10 are class 1
# (imagine a CSV sorted by the target column)
X = np.arange(20)
y = np.array([0] * 10 + [1] * 10)

# FIX: shuffle the indices first (seeded, so it is reproducible),
# then split 80/20 on the shuffled order.
np.random.seed(42)
indices = np.random.permutation(20)
train_idx, test_idx = indices[:16], indices[16:]
X_train, X_test = X[train_idx], X[test_idx]
y_train, y_test = y[train_idx], y[test_idx]

print("train classes:", sorted(set(y_train.tolist())))
print("test classes:", sorted(set(y_test.tolist())))`,
    hints: [
      'Shuffle INDICES, not X and y separately — shuffling them apart would scramble which label belongs to which row.',
      'np.random.permutation(20) returns the numbers 0-19 in random order.',
      'Set np.random.seed(42) before permuting so the split is reproducible.',
    ],
    tests: [
      {
        testCode: `assert len(X_train) == 16 and len(X_test) == 4\nassert len(y_train) == 16 and len(y_test) == 4\nprint("PASS")`,
        description: '80/20 split: 16 train rows, 4 test rows',
      },
      {
        testCode: `assert set(y_train.tolist()) == {0, 1}\nassert set(y_test.tolist()) == {0, 1}\nprint("PASS")`,
        description: 'both classes appear in both train and test',
      },
      {
        testCode: `assert len(set(X_train.tolist()) & set(X_test.tolist())) == 0\nassert len(set(X_train.tolist()) | set(X_test.tolist())) == 20\nprint("PASS")`,
        description: 'train and test are disjoint and cover all 20 rows',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Preprocessing', 'Model Selection'],
  },
  {
    id: 'ch-fix-leakage',
    title: 'Diagnose and Fix Data Leakage',
    topic: 'Data Leakage',
    moduleId: 'm4',
    lessonId: 'm4-train-test-split',
    difficulty: 'Medium',
    description:
      'The starter code fills missing values with column means computed from ALL 8 rows — including the test rows — and only then splits. That leaks test-set information into training. Fix it: split first (first 6 rows train, last 2 test), compute the means from the training rows only, and use those means to fill both sets. Success: every NaN is filled with the TRAIN mean (3.8 for column 0, 3.4 for column 1), not the full-data mean.',
    starterCode: `import numpy as np

X = np.array([
    [1.0, 2.0], [np.nan, 3.0], [7.0, 6.0], [4.0, np.nan],
    [5.0, 5.0], [2.0, 1.0], [np.nan, 8.0], [3.0, np.nan],
])

# BUG: the fill values are computed from ALL rows, including the
# test rows — information from the test set leaks into training.
col_means = np.nanmean(X, axis=0)
X_filled = np.where(np.isnan(X), col_means, X)

X_train_filled, X_test_filled = X_filled[:6], X_filled[6:]
print(X_train_filled)
print(X_test_filled)`,
    solution: `import numpy as np

X = np.array([
    [1.0, 2.0], [np.nan, 3.0], [7.0, 6.0], [4.0, np.nan],
    [5.0, 5.0], [2.0, 1.0], [np.nan, 8.0], [3.0, np.nan],
])

# FIX: split FIRST, then compute fill values from the train rows only.
X_train, X_test = X[:6], X[6:]
train_means = np.nanmean(X_train, axis=0)
X_train_filled = np.where(np.isnan(X_train), train_means, X_train)
X_test_filled = np.where(np.isnan(X_test), train_means, X_test)
print(X_train_filled)
print(X_test_filled)`,
    hints: [
      'The rule: split first, then fit anything (means, scalers, encoders) on the train split only.',
      'np.nanmean ignores NaN — the train mean of column 0 is (1+7+4+5+2)/5 = 3.8.',
      'np.where(condition, fill_values, X) replaces only the NaN positions.',
    ],
    tests: [
      {
        testCode: `assert abs(X_train_filled[1, 0] - 3.8) < 1e-6\nassert abs(X_train_filled[3, 1] - 3.4) < 1e-6\nprint("PASS")`,
        description: 'train NaNs filled with train means (3.8 and 3.4)',
      },
      {
        testCode: `assert abs(X_test_filled[0, 0] - 3.8) < 1e-6\nassert abs(X_test_filled[1, 1] - 3.4) < 1e-6\nprint("PASS")`,
        description: 'test NaNs filled with TRAIN means, not test/full-data means',
      },
      {
        testCode: `assert not bool(np.isnan(X_train_filled).any())\nassert not bool(np.isnan(X_test_filled).any())\nprint("PASS")`,
        description: 'no NaN remains in either split',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Preprocessing', 'Model Selection', 'Problem Solving'],
  },
  {
    id: 'ch-scaling',
    title: 'Standardize Features Correctly',
    topic: 'Feature Scaling',
    moduleId: 'm4',
    lessonId: 'm4-scaling',
    difficulty: 'Medium',
    description:
      'Standardize the features so each column has mean 0 and standard deviation 1 — but compute the mean and std from the TRAINING set only, then apply those same values to the test set. (Fitting on the test set would leak.) Success: the scaled training columns have mean ~0 and std ~1, and the test row [25, 250] scales to [0, 0] because it equals the training mean.',
    starterCode: `import numpy as np

X_train = np.array([[10.0, 100.0], [20.0, 200.0], [30.0, 300.0], [40.0, 400.0]])
X_test = np.array([[25.0, 250.0], [50.0, 500.0]])

# TODO: compute mean and std from the TRAINING set only,
# then standardize both train and test with those values.
X_train_scaled = None
X_test_scaled = None

print(X_train_scaled)
print(X_test_scaled)`,
    solution: `import numpy as np

X_train = np.array([[10.0, 100.0], [20.0, 200.0], [30.0, 300.0], [40.0, 400.0]])
X_test = np.array([[25.0, 250.0], [50.0, 500.0]])

# Fit on train only, apply to both.
mean = X_train.mean(axis=0)
std = X_train.std(axis=0)
X_train_scaled = (X_train - mean) / std
X_test_scaled = (X_test - mean) / std

print(X_train_scaled)
print(X_test_scaled)`,
    hints: [
      'X_train.mean(axis=0) gives one mean per column.',
      'Standardization is (x - mean) / std, using the TRAIN mean and std for both sets.',
      'NumPy broadcasting applies the per-column mean/std to every row automatically.',
    ],
    tests: [
      {
        testCode: `assert float(np.abs(X_train_scaled.mean(axis=0)).max()) < 1e-9\nassert float(np.abs(X_train_scaled.std(axis=0) - 1).max()) < 1e-9\nprint("PASS")`,
        description: 'scaled train columns have mean 0 and std 1',
      },
      {
        testCode: `assert abs(X_test_scaled[0, 0]) < 1e-9\nassert abs(X_test_scaled[0, 1]) < 1e-9\nprint("PASS")`,
        description: 'test row [25, 250] scales to [0, 0] (it equals the train mean)',
      },
      {
        testCode: `assert abs(X_test_scaled[1, 0] - 25 / np.sqrt(125)) < 1e-6\nassert abs(X_test_scaled[1, 1] - 250 / np.sqrt(12500)) < 1e-6\nprint("PASS")`,
        description: 'test row [50, 500] scales to about [2.236, 2.236]',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Preprocessing', 'Statistics'],
  },
  {
    id: 'ch-encoding',
    title: 'One-Hot Encode Categories',
    topic: 'Encoding',
    moduleId: 'm4',
    lessonId: 'm4-encoding',
    difficulty: 'Medium',
    description:
      'Turn the city names into a one-hot matrix: one column per unique city, columns in alphabetical order (Delhi, Mumbai, Pune), with a 1 in the column of each row\'s city and 0 elsewhere. Success: a 6x3 matrix where every row sums to 1, row 0 (Mumbai) is [0, 1, 0] and row 2 (Delhi) is [1, 0, 0].',
    starterCode: `import numpy as np

cities = np.array(["Mumbai", "Pune", "Delhi", "Pune", "Mumbai", "Delhi"])

# TODO: build a one-hot matrix with one column per unique city,
# columns in alphabetical order. Store it in \`one_hot\`.
one_hot = None

print(one_hot)`,
    solution: `import numpy as np

cities = np.array(["Mumbai", "Pune", "Delhi", "Pune", "Mumbai", "Delhi"])

unique = np.unique(cities)  # sorted: ['Delhi', 'Mumbai', 'Pune']
one_hot = (cities[:, None] == unique).astype(int)

print(one_hot)`,
    hints: [
      'np.unique returns the sorted unique values — those are your columns, in order.',
      'cities[:, None] turns the 1-D array into a column so it can be compared against the row of unique values.',
      'Comparing gives booleans; .astype(int) turns True/False into 1/0.',
    ],
    tests: [
      {
        testCode: `assert one_hot.shape == (6, 3)\nprint("PASS")`,
        description: 'one_hot is a 6x3 matrix',
      },
      {
        testCode: `assert one_hot.sum(axis=1).tolist() == [1, 1, 1, 1, 1, 1]\nprint("PASS")`,
        description: 'every row has exactly one 1',
      },
      {
        testCode: `assert one_hot[0].tolist() == [0, 1, 0]\nassert one_hot[1].tolist() == [0, 0, 1]\nassert one_hot[2].tolist() == [1, 0, 0]\nprint("PASS")`,
        description: 'Mumbai -> [0, 1, 0], Pune -> [0, 0, 1], Delhi -> [1, 0, 0]',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Preprocessing', 'Python'],
  },
  {
    id: 'ch-outliers',
    title: 'Detect Outliers with IQR',
    topic: 'Outliers',
    moduleId: 'm4',
    lessonId: 'm4-data-quality',
    difficulty: 'Medium',
    description:
      'One day of order values contains two suspicious entries (100 and 200 among values of 11-15). Detect them with the IQR rule: outliers are values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR. Success: lower bound 10, upper bound 18, and outliers [100, 200].',
    starterCode: `import numpy as np

# Order values (Rs.) from one day at a store — two look suspicious
amounts = np.array([12, 14, 13, 15, 12, 14, 13, 100, 11, 15, 13, 14, 200])

# TODO: compute Q1, Q3, IQR, and the outlier bounds.
# Store the outlier values in \`outliers\`.
lower, upper, outliers = None, None, None

print("bounds:", lower, upper)
print("outliers:", outliers)`,
    solution: `import numpy as np

# Order values (Rs.) from one day at a store — two look suspicious
amounts = np.array([12, 14, 13, 15, 12, 14, 13, 100, 11, 15, 13, 14, 200])

q1 = np.percentile(amounts, 25)
q3 = np.percentile(amounts, 75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
outliers = amounts[(amounts < lower) | (amounts > upper)]

print("bounds:", lower, upper)
print("outliers:", outliers)`,
    hints: [
      'np.percentile(amounts, 25) gives Q1; percentile 75 gives Q3.',
      'IQR is simply Q3 - Q1.',
      'Combine two boolean conditions with | (or) and wrap each side in parentheses.',
    ],
    tests: [
      {
        testCode: `assert abs(lower - 10.0) < 1e-9\nassert abs(upper - 18.0) < 1e-9\nprint("PASS")`,
        description: 'bounds are lower 10 and upper 18',
      },
      {
        testCode: `assert sorted(outliers.tolist()) == [100, 200]\nprint("PASS")`,
        description: 'outliers are exactly [100, 200]',
      },
      {
        testCode: `assert int(((amounts >= lower) & (amounts <= upper)).sum()) == 11\nprint("PASS")`,
        description: 'the other 11 values all fall inside the bounds',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Preprocessing', 'Statistics'],
  },
  {
    id: 'ch-linear-regression',
    title: 'Linear Regression from Scratch (Normal Equation)',
    topic: 'Linear Regression',
    moduleId: 'm5',
    lessonId: 'm5-linear-regression',
    difficulty: 'Medium',
    description:
      'Fit y = 2x + 1 by hand using the normal equation: add a bias column of 1s to X, then compute theta = (X\'X)^-1 X\'y. Then write predict(x) using the fitted coefficients. Success: theta is [1, 2] (intercept 1, slope 2) and predict(5) returns 11.',
    starterCode: `import numpy as np

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([3.0, 5.0, 7.0, 9.0])  # true rule: y = 2x + 1

# TODO: add a bias column of 1s, solve the normal equation
# theta = (X'X)^-1 X'y, and store coefficients in \`theta\`
# (theta[0] = intercept, theta[1] = slope).
theta = None

# TODO: write predict(x) that returns theta[0] + theta[1] * x
def predict(x):
    return None

print("theta:", theta)
print("predict(5):", predict(5.0))`,
    solution: `import numpy as np

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([3.0, 5.0, 7.0, 9.0])  # true rule: y = 2x + 1

X_b = np.c_[np.ones(len(X)), X]
theta = np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y

def predict(x):
    return theta[0] + theta[1] * x

print("theta:", theta)
print("predict(5):", predict(5.0))`,
    hints: [
      'np.c_[np.ones(len(X)), X] sticks a column of 1s on the left of X.',
      'The normal equation in NumPy: np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y.',
      '@ is matrix multiplication; * is element-wise — use @ here.',
    ],
    tests: [
      {
        testCode: `assert abs(theta[0] - 1.0) < 1e-6\nassert abs(theta[1] - 2.0) < 1e-6\nprint("PASS")`,
        description: 'theta is [1, 2]: intercept 1, slope 2',
      },
      {
        testCode: `assert abs(predict(5.0) - 11.0) < 1e-6\nassert abs(predict(0.0) - 1.0) < 1e-6\nprint("PASS")`,
        description: 'predict(5) is 11 and predict(0) is 1',
      },
      {
        testCode: `preds = [predict(v) for v in [1.0, 2.0, 3.0, 4.0]]\nassert all(abs(p - t) < 1e-6 for p, t in zip(preds, y))\nprint("PASS")`,
        description: 'predictions on the training points match y exactly',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Algorithms', 'Statistics', 'Python'],
  },
  {
    id: 'ch-eval-metrics',
    title: 'Implement MAE, MSE, RMSE and R²',
    topic: 'Regression Metrics',
    moduleId: 'm7',
    lessonId: 'm7-metric-selection',
    difficulty: 'Easy',
    description:
      'Implement the four core regression metrics from scratch: MAE (mean absolute error), MSE (mean squared error), RMSE (square root of MSE) and R² (1 - SS_res/SS_tot). Success: on the sample data MAE = 0.5, MSE = 0.375, RMSE = sqrt(0.375), and R² is about 0.9486; perfect predictions give R² = 1.',
    starterCode: `import numpy as np

y_true = np.array([3.0, -0.5, 2.0, 7.0])
y_pred = np.array([2.5, 0.0, 2.0, 8.0])

# TODO: implement the four metrics. Each takes (y_true, y_pred).
def mae(y_true, y_pred):
    return None

def mse(y_true, y_pred):
    return None

def rmse(y_true, y_pred):
    return None

def r2(y_true, y_pred):
    return None

print("MAE:", mae(y_true, y_pred))
print("MSE:", mse(y_true, y_pred))
print("RMSE:", rmse(y_true, y_pred))
print("R2:", r2(y_true, y_pred))`,
    solution: `import numpy as np

y_true = np.array([3.0, -0.5, 2.0, 7.0])
y_pred = np.array([2.5, 0.0, 2.0, 8.0])

def mae(y_true, y_pred):
    return float(np.mean(np.abs(y_true - y_pred)))

def mse(y_true, y_pred):
    return float(np.mean((y_true - y_pred) ** 2))

def rmse(y_true, y_pred):
    return float(np.sqrt(mse(y_true, y_pred)))

def r2(y_true, y_pred):
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    return float(1 - ss_res / ss_tot)

print("MAE:", mae(y_true, y_pred))
print("MSE:", mse(y_true, y_pred))
print("RMSE:", rmse(y_true, y_pred))
print("R2:", r2(y_true, y_pred))`,
    hints: [
      'All four start from the errors: y_true - y_pred.',
      'R² compares your squared errors (SS_res) against the squared errors of just predicting the mean (SS_tot).',
      'RMSE is just the square root of MSE — reuse your mse function.',
    ],
    tests: [
      {
        testCode: `assert abs(mae(y_true, y_pred) - 0.5) < 1e-6\nassert abs(mse(y_true, y_pred) - 0.375) < 1e-6\nprint("PASS")`,
        description: 'MAE is 0.5 and MSE is 0.375',
      },
      {
        testCode: `assert abs(rmse(y_true, y_pred) - float(np.sqrt(0.375))) < 1e-6\nprint("PASS")`,
        description: 'RMSE is sqrt(0.375), about 0.612',
      },
      {
        testCode: `assert abs(r2(y_true, y_pred) - (1 - 1.5 / 29.1875)) < 1e-6\nassert abs(r2(y_true, y_true) - 1.0) < 1e-9\nprint("PASS")`,
        description: 'R² is about 0.9486, and 1.0 for perfect predictions',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Evaluation', 'Statistics', 'Python'],
  },
  {
    id: 'ch-confusion-matrix',
    title: 'Build a Confusion Matrix and Compute Precision/Recall',
    topic: 'Classification Metrics',
    moduleId: 'm7',
    lessonId: 'm7-classification-metrics',
    difficulty: 'Medium',
    description:
      'Given true and predicted labels, count TP, FP, FN and TN into a dict, then compute precision (TP / (TP + FP)) and recall (TP / (TP + FN)). Success: the matrix is TP=4, FP=2, FN=1, TN=3, precision is 4/6 (about 0.667) and recall is 4/5 (0.8). Pure Python — no packages needed.',
    starterCode: `y_true = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]
y_pred = [1, 0, 0, 1, 0, 1, 1, 0, 1, 1]

# TODO: return a dict with keys "TP", "FP", "FN", "TN"
def confusion_matrix(y_true, y_pred):
    return None

# TODO: return (precision, recall) from a confusion-matrix dict
def precision_recall(cm):
    return None

cm = confusion_matrix(y_true, y_pred)
print(cm)
print(precision_recall(cm))`,
    solution: `y_true = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0]
y_pred = [1, 0, 0, 1, 0, 1, 1, 0, 1, 1]

def confusion_matrix(y_true, y_pred):
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)
    tn = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)
    return {"TP": tp, "FP": fp, "FN": fn, "TN": tn}

def precision_recall(cm):
    precision = cm["TP"] / (cm["TP"] + cm["FP"])
    recall = cm["TP"] / (cm["TP"] + cm["FN"])
    return precision, recall

cm = confusion_matrix(y_true, y_pred)
print(cm)
print(precision_recall(cm))`,
    hints: [
      'zip(y_true, y_pred) pairs each true label with its prediction.',
      'TP: true 1, predicted 1. FP: true 0, predicted 1. FN: true 1, predicted 0. TN: true 0, predicted 0.',
      'Precision asks "of everything I flagged positive, how many really were?" — TP / (TP + FP).',
    ],
    tests: [
      {
        testCode: `cm = confusion_matrix(y_true, y_pred)\nassert cm == {"TP": 4, "FP": 2, "FN": 1, "TN": 3}\nprint("PASS")`,
        description: 'confusion matrix is TP 4, FP 2, FN 1, TN 3',
      },
      {
        testCode: `p, r = precision_recall(confusion_matrix(y_true, y_pred))\nassert abs(p - 4 / 6) < 1e-6\nassert abs(r - 4 / 5) < 1e-6\nprint("PASS")`,
        description: 'precision is 4/6 and recall is 4/5',
      },
      {
        testCode: `p2, r2 = precision_recall(confusion_matrix([1, 0, 1], [1, 0, 1]))\nassert p2 == 1.0 and r2 == 1.0\nprint("PASS")`,
        description: 'perfect predictions give precision and recall of 1.0',
      },
    ],
    needsPackages: [],
    skills: ['Evaluation', 'Python'],
  },
  {
    id: 'ch-logistic-regression',
    title: 'Sigmoid and Log Loss from Scratch',
    topic: 'Logistic Regression',
    moduleId: 'm6',
    lessonId: 'm6-logistic-regression',
    difficulty: 'Medium',
    description:
      'Implement the two building blocks of logistic regression: the sigmoid function (1 / (1 + e^-z)), which squashes any number into a probability, and binary log loss (binary cross-entropy), the loss logistic regression minimizes. Clip predictions into [1e-15, 1 - 1e-15] before taking logs so log(0) never happens. Success: sigmoid(0) = 0.5, sigmoid(2) is about 0.881, and log loss on [1, 0] vs [0.9, 0.1] is about 0.105.',
    starterCode: `import numpy as np

# TODO: sigmoid(z) = 1 / (1 + e^-z). Must work for scalars and arrays.
def sigmoid(z):
    return None

# TODO: binary log loss (binary cross-entropy).
# Clip predictions into [eps, 1 - eps] with eps = 1e-15 first,
# so log(0) never happens.
def log_loss(y_true, y_pred):
    return None

print(sigmoid(0))
print(log_loss(np.array([1, 0]), np.array([0.9, 0.1])))`,
    solution: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def log_loss(y_true, y_pred):
    eps = 1e-15
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return float(-np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred)))

print(sigmoid(0))
print(log_loss(np.array([1, 0]), np.array([0.9, 0.1])))`,
    hints: [
      'np.exp works on scalars and arrays alike, so one line handles both.',
      'Log loss per example is y*log(p) + (1-y)*log(1-p); average it and negate.',
      'np.clip(y_pred, 1e-15, 1 - 1e-15) keeps predictions away from exactly 0 and 1.',
    ],
    tests: [
      {
        testCode: `assert abs(float(sigmoid(0)) - 0.5) < 1e-9\nassert abs(float(sigmoid(2)) - 0.8807970779778823) < 1e-6\nprint("PASS")`,
        description: 'sigmoid(0) is 0.5 and sigmoid(2) is about 0.881',
      },
      {
        testCode: `assert abs(log_loss(np.array([1, 0]), np.array([0.9, 0.1])) - 0.10536051565782628) < 1e-6\nprint("PASS")`,
        description: 'log loss on [1, 0] vs [0.9, 0.1] is about 0.105',
      },
      {
        testCode: `assert log_loss(np.array([1, 0]), np.array([1.0, 0.0])) < 1e-10\nassert abs(float(sigmoid(np.array([0.0]))[0]) - 0.5) < 1e-9\nprint("PASS")`,
        description: 'perfect predictions give near-zero loss (no log(0) crash), and sigmoid works on arrays',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Algorithms', 'Evaluation', 'Python'],
  },
  {
    id: 'ch-knn',
    title: 'KNN Classifier from Scratch',
    topic: 'KNN',
    moduleId: 'm6',
    lessonId: 'm6-knn',
    difficulty: 'Medium',
    description:
      'Implement k-nearest neighbours: for a query point, compute Euclidean distances to all training points, take the k nearest, and return the majority label (ties break to the smaller label). The training data has two clear clusters — class 0 near (1-3, 2-3) and class 1 near (6-8, 5-7). Success: [5, 5] with k=3 predicts 1, [2, 2] with k=3 predicts 0, and [6, 5] with k=1 predicts 1.',
    starterCode: `import numpy as np

X_train = np.array([[1, 2], [2, 3], [3, 3], [6, 5], [7, 7], [8, 6]])
y_train = np.array([0, 0, 0, 1, 1, 1])

# TODO: predict the label of x_query using the k nearest neighbours
# (Euclidean distance, majority vote; ties break to the smaller label).
def knn_predict(X_train, y_train, x_query, k):
    return None

print(knn_predict(X_train, y_train, np.array([5, 5]), 3))`,
    solution: `import numpy as np

X_train = np.array([[1, 2], [2, 3], [3, 3], [6, 5], [7, 7], [8, 6]])
y_train = np.array([0, 0, 0, 1, 1, 1])

def knn_predict(X_train, y_train, x_query, k):
    distances = np.sqrt(((X_train - x_query) ** 2).sum(axis=1))
    nearest = np.argsort(distances)[:k]
    labels, counts = np.unique(y_train[nearest], return_counts=True)
    return int(labels[np.argmax(counts)])

print(knn_predict(X_train, y_train, np.array([5, 5]), 3))`,
    hints: [
      'Broadcasting: X_train - x_query subtracts the query from every row at once.',
      'Euclidean distance is sqrt of the sum of squared differences along each row (axis=1).',
      'np.argsort(distances)[:k] gives the indices of the k nearest neighbours.',
    ],
    tests: [
      {
        testCode: `assert knn_predict(X_train, y_train, np.array([5, 5]), 3) == 1\nprint("PASS")`,
        description: '[5, 5] with k=3 predicts class 1',
      },
      {
        testCode: `assert knn_predict(X_train, y_train, np.array([2, 2]), 3) == 0\nprint("PASS")`,
        description: '[2, 2] with k=3 predicts class 0',
      },
      {
        testCode: `assert knn_predict(X_train, y_train, np.array([6, 5]), 1) == 1\nprint("PASS")`,
        description: '[6, 5] with k=1 predicts class 1 (it is a training point)',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Algorithms', 'Python'],
  },
  {
    id: 'ch-kmeans',
    title: 'One K-Means Iteration',
    topic: 'K-Means',
    moduleId: 'm10',
    lessonId: 'm10-kmeans',
    difficulty: 'Hard',
    description:
      'Implement a single k-means iteration: assign each point to its nearest centroid, then recompute each centroid as the mean of the points assigned to it. Return (labels, new_centroids). The data has two obvious clusters (x=1 and x=10). Success: labels are [0, 0, 0, 1, 1, 1] and the new centroids are [[1, 2], [10, 2]].',
    starterCode: `import numpy as np

X = np.array([[1, 2], [1, 4], [1, 0], [10, 2], [10, 4], [10, 0]], dtype=float)
centroids = np.array([[1.0, 1.0], [10.0, 1.0]])

# TODO: one k-means iteration — assign each point to its nearest
# centroid, then recompute each centroid as the mean of its points.
# Return (labels, new_centroids).
def kmeans_one_step(X, centroids):
    return None

print(kmeans_one_step(X, centroids))`,
    solution: `import numpy as np

X = np.array([[1, 2], [1, 4], [1, 0], [10, 2], [10, 4], [10, 0]], dtype=float)
centroids = np.array([[1.0, 1.0], [10.0, 1.0]])

def kmeans_one_step(X, centroids):
    # distances[i, j] = distance from point i to centroid j
    distances = np.sqrt(((X[:, None, :] - centroids[None, :, :]) ** 2).sum(axis=2))
    labels = np.argmin(distances, axis=1)
    new_centroids = np.array([X[labels == j].mean(axis=0) for j in range(len(centroids))])
    return labels, new_centroids

print(kmeans_one_step(X, centroids))`,
    hints: [
      'X[:, None, :] (shape 6x1x2) minus centroids[None, :, :] (shape 1x2x2) broadcasts to a 6x2x2 array of differences.',
      'np.argmin(distances, axis=1) picks the nearest centroid index for each point.',
      'X[labels == j] selects all points assigned to cluster j; .mean(axis=0) is the new centroid.',
    ],
    tests: [
      {
        testCode: `labels, new_c = kmeans_one_step(X, centroids)\nassert labels.tolist() == [0, 0, 0, 1, 1, 1]\nprint("PASS")`,
        description: 'points split into labels [0, 0, 0, 1, 1, 1]',
      },
      {
        testCode: `labels, new_c = kmeans_one_step(X, centroids)\nassert bool(np.allclose(new_c, np.array([[1.0, 2.0], [10.0, 2.0]])))\nprint("PASS")`,
        description: 'new centroids are [[1, 2], [10, 2]]',
      },
      {
        testCode: `labels2, new_c2 = kmeans_one_step(X, np.array([[0.0, 0.0], [10.0, 0.0]]))\nassert labels2.tolist() == [0, 0, 0, 1, 1, 1]\nassert bool(np.allclose(new_c2, np.array([[1.0, 2.0], [10.0, 2.0]])))\nprint("PASS")`,
        description: 'the same result comes from a different starting pair of centroids',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Algorithms', 'Python'],
  },
  {
    id: 'ch-cross-validation',
    title: 'Manual 5-Fold Cross-Validation Splits',
    topic: 'Cross-Validation',
    moduleId: 'm8',
    lessonId: 'm8-cross-validation',
    difficulty: 'Medium',
    description:
      'Write kfold_splits(n, k, seed) that returns a list of (train_idx, test_idx) tuples: shuffle the indices with the given seed, cut them into k folds, and for each fold use it as the test set and everything else as train. Success: 5 folds of 16 train / 4 test for n=20, every index appears in exactly one test fold, and the same seed always gives the same splits.',
    starterCode: `import numpy as np

# TODO: return a list of (train_idx, test_idx) tuples for k-fold CV.
# Shuffle the indices with the given seed BEFORE splitting so the
# folds are random but reproducible.
def kfold_splits(n, k, seed=42):
    return None

splits = kfold_splits(20, 5)
for train_idx, test_idx in splits:
    print("train:", len(train_idx), "test:", len(test_idx))`,
    solution: `import numpy as np

def kfold_splits(n, k, seed=42):
    rng = np.random.RandomState(seed)
    indices = rng.permutation(n)
    folds = np.array_split(indices, k)
    splits = []
    for i in range(k):
        test_idx = folds[i]
        train_idx = np.concatenate([folds[j] for j in range(k) if j != i])
        splits.append((train_idx, test_idx))
    return splits

splits = kfold_splits(20, 5)
for train_idx, test_idx in splits:
    print("train:", len(train_idx), "test:", len(test_idx))`,
    hints: [
      'np.random.RandomState(seed).permutation(n) shuffles 0..n-1 reproducibly.',
      'np.array_split(indices, k) cuts the shuffled indices into k near-equal folds.',
      'For fold i, the test set is folds[i] and the train set is all the other folds concatenated.',
    ],
    tests: [
      {
        testCode: `splits = kfold_splits(20, 5)\nassert len(splits) == 5\nassert all(len(t) == 16 and len(v) == 4 for t, v in splits)\nprint("PASS")`,
        description: '5 folds, each 16 train / 4 test',
      },
      {
        testCode: `splits = kfold_splits(20, 5)\nall_test = sorted(np.concatenate([v for _, v in splits]).tolist())\nassert all_test == list(range(20))\nprint("PASS")`,
        description: 'every index appears in exactly one test fold',
      },
      {
        testCode: `s1 = kfold_splits(20, 5, seed=7)\ns2 = kfold_splits(20, 5, seed=7)\nassert all(bool(np.array_equal(a1, a2)) and bool(np.array_equal(b1, b2)) for (a1, b1), (a2, b2) in zip(s1, s2))\nprint("PASS")`,
        description: 'the same seed gives identical splits every time',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Model Selection', 'Python'],
  },
  {
    id: 'ch-feature-engineering',
    title: 'Build RFM Features',
    topic: 'Feature Engineering',
    moduleId: 'm9',
    lessonId: 'm9-numerical-features',
    difficulty: 'Medium',
    description:
      'RFM (Recency, Frequency, Monetary) is the classic customer-value feature set. From the orders table, build one row per customer: recency = days from their last order to the reference date (2026-11-22), frequency = number of orders, monetary = total spend. Success: C1 has recency 2 / frequency 2 / monetary 300, C2 has 52 / 1 / 500, and C3 has 0 / 3 / 150.',
    starterCode: `import pandas as pd

orders = pd.DataFrame({
    "customer_id": ["C1", "C1", "C2", "C3", "C3", "C3"],
    "order_date": pd.to_datetime([
        "2026-11-20", "2026-11-10", "2026-10-01",
        "2026-11-22", "2026-11-21", "2026-09-15",
    ]),
    "amount": [100, 200, 500, 50, 75, 25],
})
reference_date = pd.Timestamp("2026-11-22")

# TODO: build an RFM table indexed by customer_id with columns:
# recency (days since last order), frequency (order count),
# monetary (total spend). Store it in \`rfm\`.
rfm = None

print(rfm)`,
    solution: `import pandas as pd

orders = pd.DataFrame({
    "customer_id": ["C1", "C1", "C2", "C3", "C3", "C3"],
    "order_date": pd.to_datetime([
        "2026-11-20", "2026-11-10", "2026-10-01",
        "2026-11-22", "2026-11-21", "2026-09-15",
    ]),
    "amount": [100, 200, 500, 50, 75, 25],
})
reference_date = pd.Timestamp("2026-11-22")

rfm = orders.groupby("customer_id").agg(
    recency=("order_date", lambda d: (reference_date - d.max()).days),
    frequency=("order_date", "count"),
    monetary=("amount", "sum"),
)

print(rfm)`,
    hints: [
      'groupby("customer_id").agg(...) with named aggregations builds all three columns in one call.',
      'Recency needs the LAST order date per customer: (reference_date - d.max()).days.',
      'Frequency is a count of orders; monetary is a sum of amounts.',
    ],
    tests: [
      {
        testCode: `assert int(rfm.loc["C1", "recency"]) == 2\nassert int(rfm.loc["C2", "recency"]) == 52\nassert int(rfm.loc["C3", "recency"]) == 0\nprint("PASS")`,
        description: 'recency is C1 2 days, C2 52 days, C3 0 days',
      },
      {
        testCode: `assert int(rfm.loc["C1", "frequency"]) == 2\nassert int(rfm.loc["C2", "frequency"]) == 1\nassert int(rfm.loc["C3", "frequency"]) == 3\nprint("PASS")`,
        description: 'frequency is C1 2, C2 1, C3 3 orders',
      },
      {
        testCode: `assert int(rfm.loc["C1", "monetary"]) == 300\nassert int(rfm.loc["C2", "monetary"]) == 500\nassert int(rfm.loc["C3", "monetary"]) == 150\nprint("PASS")`,
        description: 'monetary is C1 300, C2 500, C3 150',
      },
    ],
    needsPackages: ['pandas'],
    skills: ['Feature Engineering', 'Python'],
  },
  {
    id: 'ch-overfitting-fix',
    title: 'Fix an Overfitting Polynomial Fit',
    topic: 'Overfitting',
    moduleId: 'm5',
    lessonId: 'm5-polynomial',
    difficulty: 'Hard',
    description:
      'The true pattern here is a straight line (y = 2x + 1) plus small noise, but the starter code fits a degree-7 polynomial that threads every noisy training point and swings wildly on the held-out points x=8 and x=9. Fix it by choosing a simpler model: change the degree so the model generalizes. Success: degree is 2 or less, test MSE is below 1.0, and train MSE stays below 1.0 too (the simple model fits the training data fine — the line was always there).',
    starterCode: `import numpy as np

x = np.arange(10, dtype=float)
noise = np.array([0.3, -0.4, 0.2, -0.1, 0.5, -0.3, 0.1, -0.2, 0.4, -0.5])
y = 2 * x + 1 + noise  # true pattern is a straight line + small noise

x_train, y_train = x[:8], y[:8]
x_test, y_test = x[8:], y[8:]

# BUG: a degree-7 polynomial threads every noisy training point
# and swings wildly outside the training range.
degree = 7
model = np.polyfit(x_train, y_train, degree)
y_pred_test = np.polyval(model, x_test)
test_mse = float(np.mean((y_test - y_pred_test) ** 2))
print("degree:", degree, "test MSE:", test_mse)`,
    solution: `import numpy as np

x = np.arange(10, dtype=float)
noise = np.array([0.3, -0.4, 0.2, -0.1, 0.5, -0.3, 0.1, -0.2, 0.4, -0.5])
y = 2 * x + 1 + noise  # true pattern is a straight line + small noise

x_train, y_train = x[:8], y[:8]
x_test, y_test = x[8:], y[8:]

# FIX: the true pattern is linear, so a degree-1 fit generalizes
# instead of memorizing the noise.
degree = 1
model = np.polyfit(x_train, y_train, degree)
y_pred_test = np.polyval(model, x_test)
test_mse = float(np.mean((y_test - y_pred_test) ** 2))
print("degree:", degree, "test MSE:", test_mse)`,
    hints: [
      'The data is a straight line plus noise — the simplest model that captures the pattern is degree 1.',
      'A high-degree polynomial can hit every training point exactly and still be terrible on new points.',
      'Compare train MSE and test MSE: when test MSE is far worse, the model memorized noise.',
    ],
    tests: [
      {
        testCode: `assert degree <= 2\nprint("PASS")`,
        description: 'the chosen degree is 2 or less',
      },
      {
        testCode: `assert test_mse < 1.0\nprint("PASS")`,
        description: 'test MSE is below 1.0 (the degree-7 fit is in the hundreds)',
      },
      {
        testCode: `train_mse = float(np.mean((y_train - np.polyval(model, x_train)) ** 2))\nassert train_mse < 1.0\nprint("PASS")`,
        description: 'train MSE is also below 1.0 — the simple model fits the data',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Algorithms', 'Model Selection', 'Problem Solving'],
  },
  {
    id: 'ch-pca',
    title: 'PCA Projection with NumPy',
    topic: 'PCA',
    moduleId: 'm10',
    lessonId: 'm10-pca',
    difficulty: 'Hard',
    description:
      'Implement PCA by hand: center X, build the covariance matrix, take its leading eigenvector as the first principal component, and project the data onto it. Return (projected, explained_variance_ratio). The sample data lies exactly on a line, so one component explains everything. Success: the projected values have magnitudes [2.121, 0.707, 0.707, 2.121] (sign may flip — that is fine, eigenvectors have no preferred sign) and the explained variance ratio is 1.0.',
    starterCode: `import numpy as np

X = np.array([[2.0, 1.0], [3.0, 2.0], [4.0, 3.0], [5.0, 4.0]])

# TODO: center X, build the covariance matrix, take its leading
# eigenvector as the first principal component, and project X onto it.
# Return (projected, explained_variance_ratio) where projected has
# one value per row and the ratio is a single float.
def pca_project(X):
    return None

print(pca_project(X))`,
    solution: `import numpy as np

X = np.array([[2.0, 1.0], [3.0, 2.0], [4.0, 3.0], [5.0, 4.0]])

def pca_project(X):
    X_centered = X - X.mean(axis=0)
    cov = np.cov(X_centered, rowvar=False)
    eigenvalues, eigenvectors = np.linalg.eigh(cov)
    order = np.argsort(eigenvalues)[::-1]
    eigenvalues = eigenvalues[order]
    eigenvectors = eigenvectors[:, order]
    pc1 = eigenvectors[:, 0]
    projected = X_centered @ pc1
    explained = float(eigenvalues[0] / eigenvalues.sum())
    return projected, explained

print(pca_project(X))`,
    hints: [
      'PCA starts with centering: subtract the column means (X - X.mean(axis=0)).',
      'np.cov(centered, rowvar=False) treats rows as observations and returns the feature covariance matrix.',
      'np.linalg.eigh returns eigenvalues in ASCENDING order — reverse them to get the leading component first.',
    ],
    tests: [
      {
        testCode: `projected, explained = pca_project(X)\nassert bool(np.allclose(np.abs(projected), [2.12132034, 0.70710678, 0.70710678, 2.12132034], atol=1e-6))\nprint("PASS")`,
        description: 'projected magnitudes are [2.121, 0.707, 0.707, 2.121]',
      },
      {
        testCode: `projected, explained = pca_project(X)\nassert abs(explained - 1.0) < 1e-9\nprint("PASS")`,
        description: 'the first component explains 100% of the variance',
      },
      {
        testCode: `projected, explained = pca_project(X)\nassert abs(float(np.var(projected, ddof=1)) - 10 / 3) < 1e-6\nprint("PASS")`,
        description: 'the projected values have variance 10/3, the leading eigenvalue',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Algorithms', 'Statistics', 'Python'],
  },
  {
    id: 'ch-roc-auc',
    title: 'Compute ROC Points and AUC',
    topic: 'ROC & AUC',
    moduleId: 'm7',
    lessonId: 'm7-roc-auc',
    difficulty: 'Hard',
    description:
      'Implement roc_auc(y_true, scores): sort examples by predicted score from high to low, sweep a threshold down the list tracking true-positive and false-positive rates, and compute the area under the curve with the trapezoid rule. Return (fpr, tpr, auc) with the curve starting at (0, 0) and ending at (1, 1). Success: AUC is 0.75 on the sample data and 1.0 for a perfect ranking. (The trapezoid is written as a loop so it works in any NumPy version.)',
    starterCode: `import numpy as np

y_true = np.array([0, 0, 1, 1])
scores = np.array([0.1, 0.4, 0.35, 0.8])

# TODO: return (fpr, tpr, auc) — the ROC curve points as lists
# starting at (0, 0) and ending at (1, 1), and the AUC computed
# with the trapezoid rule.
def roc_auc(y_true, scores):
    return None

print(roc_auc(y_true, scores))`,
    solution: `import numpy as np

y_true = np.array([0, 0, 1, 1])
scores = np.array([0.1, 0.4, 0.35, 0.8])

def roc_auc(y_true, scores):
    order = np.argsort(-scores)
    y_sorted = y_true[order]
    n_pos = int((y_true == 1).sum())
    n_neg = int((y_true == 0).sum())
    fpr = [0.0]
    tpr = [0.0]
    tp = fp = 0
    for label in y_sorted:
        if label == 1:
            tp += 1
        else:
            fp += 1
        tpr.append(tp / n_pos)
        fpr.append(fp / n_neg)
    # Trapezoid rule (plain loop — no version-dependent helper needed).
    auc = 0.0
    for i in range(1, len(fpr)):
        auc += (fpr[i] - fpr[i - 1]) * (tpr[i] + tpr[i - 1]) / 2
    return fpr, tpr, float(auc)

print(roc_auc(y_true, scores))`,
    hints: [
      'np.argsort(-scores) sorts by score from highest to lowest.',
      'Walk the sorted labels: each positive steps TPR up by 1/n_pos, each negative steps FPR up by 1/n_neg.',
      'The trapezoid area of one segment is width * average height: (x2-x1) * (y1+y2) / 2.',
    ],
    tests: [
      {
        testCode: `fpr, tpr, auc = roc_auc(y_true, scores)\nassert abs(auc - 0.75) < 1e-9\nprint("PASS")`,
        description: 'AUC is 0.75 on the sample data',
      },
      {
        testCode: `fpr, tpr, auc = roc_auc(y_true, scores)\nassert fpr[0] == 0.0 and tpr[0] == 0.0\nassert fpr[-1] == 1.0 and tpr[-1] == 1.0\nprint("PASS")`,
        description: 'the curve starts at (0, 0) and ends at (1, 1)',
      },
      {
        testCode: `fpr2, tpr2, auc2 = roc_auc(np.array([0, 1]), np.array([0.2, 0.9]))\nassert abs(auc2 - 1.0) < 1e-9\nprint("PASS")`,
        description: 'a perfect ranking gives AUC 1.0',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Evaluation', 'Algorithms', 'Python'],
  },
  {
    id: 'ch-grid-search',
    title: 'Grid Search Over Ridge Alpha',
    topic: 'Hyperparameter Tuning',
    moduleId: 'm8',
    lessonId: 'm8-hyperparameter-tuning',
    difficulty: 'Hard',
    description:
      'Implement ridge regression in closed form — theta = (X\'X + alpha*I)^-1 X\'y — then grid-search alpha over [0.1, 1.0, 10.0, 100.0], recording validation MSE for each in the results dict and storing the best alpha in best_alpha. The data follows y = 2x, so small alphas (weak regularization) should win. Success: best_alpha is 0.1 and validation MSE grows as alpha grows.',
    starterCode: `import numpy as np

X_train = np.array([[1.0], [2.0], [3.0], [4.0], [5.0]])
y_train = np.array([2.1, 4.0, 5.9, 8.2, 10.1])
X_val = np.array([[6.0], [7.0]])
y_val = np.array([12.0, 14.1])
alphas = [0.1, 1.0, 10.0, 100.0]

# TODO: ridge regression, closed form:
# theta = (X'X + alpha * I)^-1 X'y  (no intercept column here)
def ridge_fit(X, y, alpha):
    return None

# TODO: try every alpha, record validation MSE in \`results\`
# (dict: alpha -> val MSE), and store the best alpha in \`best_alpha\`.
results = {}
best_alpha = None

print(results)
print("best alpha:", best_alpha)`,
    solution: `import numpy as np

X_train = np.array([[1.0], [2.0], [3.0], [4.0], [5.0]])
y_train = np.array([2.1, 4.0, 5.9, 8.2, 10.1])
X_val = np.array([[6.0], [7.0]])
y_val = np.array([12.0, 14.1])
alphas = [0.1, 1.0, 10.0, 100.0]

def ridge_fit(X, y, alpha):
    n_features = X.shape[1]
    A = X.T @ X + alpha * np.eye(n_features)
    return np.linalg.solve(A, X.T @ y)

results = {}
for alpha in alphas:
    theta = ridge_fit(X_train, y_train, alpha)
    preds = X_val @ theta
    results[alpha] = float(np.mean((y_val - preds) ** 2))
best_alpha = min(results, key=results.get)

print(results)
print("best alpha:", best_alpha)`,
    hints: [
      'The ridge penalty adds alpha * I to X\'X before inverting — np.eye(n_features) builds I.',
      'np.linalg.solve(A, b) solves A theta = b without forming the inverse explicitly.',
      'min(results, key=results.get) returns the key with the smallest value.',
    ],
    tests: [
      {
        testCode: `assert best_alpha == 0.1\nprint("PASS")`,
        description: 'the best alpha is 0.1',
      },
      {
        testCode: `assert set(results.keys()) == {0.1, 1.0, 10.0, 100.0}\nassert results[0.1] < results[1.0] < results[10.0] < results[100.0]\nprint("PASS")`,
        description: 'all four alphas were tried and val MSE grows with alpha',
      },
      {
        testCode: `theta = ridge_fit(X_train, y_train, 0.1)\nassert abs(float(theta[0]) - 111.1 / 55.1) < 1e-6\nprint("PASS")`,
        description: 'ridge_fit with alpha 0.1 gives slope 111.1 / 55.1, about 2.016',
      },
    ],
    needsPackages: ['numpy'],
    skills: ['Model Selection', 'Algorithms', 'Python'],
  },
];
