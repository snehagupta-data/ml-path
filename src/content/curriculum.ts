// Curriculum content — Modules 0–14 (48 lessons).
// Written for Sneha: final-year B.Sc. Data Science student, Mumbai.
// Knows SQL, Python basics, Pandas, NumPy, Matplotlib, Excel, Power BI, DAX.
// Simple-first, accurate, practical, interview-oriented. Business context:
// churn, loan default, fraud, sales forecasting. No invented content.
import type { Module } from '../types';

export const MODULES: Module[] = [
  // ─── Module 0 — Diagnostic Assessment ────────────────────────────────────
  {
    id: 'm0',
    number: 0,
    title: 'Diagnostic Assessment',
    shortTitle: 'Diagnostic',
    description:
      'Find out where you stand before you start. A short diagnostic across Python, statistics, probability, linear algebra, Pandas & NumPy, preprocessing, ML basics and problem solving — so the platform can point you at exactly what to learn first.',
    icon: 'target',
    skills: ['Problem Solving'],
    lessons: [
      {
        id: 'm0-diagnostic-intro',
        moduleId: 'm0',
        title: 'How the Diagnostic Works',
        subtitle: 'A 15-minute check of your starting point — no marks, no pressure',
        minutes: 8,
        simple:
          'The diagnostic is a short quiz that measures what you already know across eight areas: Python, statistics, probability, linear algebra, Pandas & NumPy, preprocessing, ML basics, and problem solving. It is not an exam — there is no pass or fail. Its only job is to show you (and the platform) your strong and weak areas so you spend time on what actually needs work.',
        technical:
          'The diagnostic samples questions across eight skill dimensions that the curriculum builds on. Each answer updates a per-area score (0–100) that feeds the mastery model: areas below threshold surface their lessons earlier and flag related revision. Scores are stored in AppState.diagnostic and are used only to personalise your path — they never lock you out of content. Retaking is always allowed; the latest attempt is what counts.',
        interview:
          'Before starting any learning plan, I like to diagnose first. I take a short assessment across the fundamentals — Python, statistics, probability, linear algebra, data handling — so I know exactly which areas are strong and which need work, instead of revising everything blindly.',
        analogy:
          'Like a blood test before a fitness plan: the doctor does not guess what is wrong, they measure first, then prescribe. The diagnostic is your blood test for ML readiness.',
        realWorld:
          'Good data teams do the same thing with new hires and new projects: a quick skills audit before training, and a data audit before modelling. In consulting, the first week of any engagement is almost always discovery — measuring the current state before proposing anything.',
        mistakes: [
          'Skipping the diagnostic and starting at Module 1 anyway — then discovering halfway through that a statistics gap is slowing you down.',
          'Treating a low score as failure instead of information. A low score in probability just means "spend an extra hour there".',
          'Guessing randomly to finish fast. Wrong guesses create a wrong map of your weaknesses.',
          'Retaking it repeatedly to chase a perfect score. The diagnostic measures your starting point, not your final ability.',
        ],
        keyPoints: [
          'The diagnostic covers 8 areas: Python, Statistics, Probability, Linear Algebra, Pandas & NumPy, Preprocessing, ML Basics, Problem Solving.',
          'There is no pass or fail — it only maps strengths and gaps.',
          'Results personalise your learning path and revision schedule.',
          'Answer honestly; guessing gives you a misleading map.',
          'You can retake it any time — the latest attempt counts.',
        ],
        questionIds: [],
        skills: ['Problem Solving'],
      },
    ],
  },

  // ─── Module 1 — Machine Learning Foundations ─────────────────────────────
  {
    id: 'm1',
    number: 1,
    title: 'Machine Learning Foundations',
    shortTitle: 'Foundations',
    description:
      'What machine learning actually is, the three families of ML, the vocabulary every practitioner uses, how data is split for honest evaluation, and the single most important trade-off in the field: bias vs variance.',
    icon: 'brain',
    skills: ['Algorithms', 'Problem Solving'],
    lessons: [
      {
        id: 'm1-what-is-ml',
        moduleId: 'm1',
        title: 'What Is Machine Learning?',
        subtitle: 'Learning patterns from data instead of writing rules by hand',
        minutes: 12,
        simple:
          'Machine learning is a way of getting computers to learn patterns from data instead of following rules a programmer wrote by hand. You show the computer many examples — say, past loan applications and whether each one defaulted — and it builds a model that can predict the outcome for new applications. The model is not magic: it is a mathematical function fitted to the data you gave it.',
        technical:
          'Machine learning is the study of algorithms that improve their performance on a task T, measured by a performance measure P, with experience E (data) — Mitchell\'s classic definition. In practice, you choose a model family (a hypothesis space), define a loss function that measures how wrong predictions are, and use an optimisation algorithm to find parameters that minimise that loss on training data. The learned model generalises only as far as the training data is representative of the deployment distribution.',
        interview:
          'Machine learning is learning patterns from data instead of hand-writing rules. I give the algorithm labelled examples, it finds the pattern that maps inputs to outputs, and then it can predict on new data. The key difference from traditional programming is that the rules are learned from data rather than explicitly coded by me.',
        analogy:
          'Think of teaching a child to recognise a mango. You do not give them a rulebook ("yellow, oval, roughly 300 grams"). You show them many mangoes, they build an internal sense of "mango-ness", and then they recognise a new one. ML does the same: examples in, pattern learned, new cases predicted.',
        realWorld:
          'A bank does not write rules like "if income > 5 lakh and credit score > 700, approve the loan" by hand for every combination. It trains a model on lakhs of past loan outcomes, and the model learns which combinations of income, credit history and loan size predict default. When the model scores a new applicant, it is applying patterns learned from history — the same way your Power BI churn dashboard summarises history, except the model predicts the future.',
        mistakes: [
          'Saying ML is "AI that thinks like a human". It is pattern-fitting on data, not reasoning.',
          'Believing more data automatically means a better model. Bad, biased or irrelevant data makes models worse.',
          'Confusing ML with a dashboard. A dashboard describes the past; a model predicts the future (or finds hidden structure).',
          'Expecting a model to work on data very different from its training data — a model trained on metro customers will misjudge rural customers.',
        ],
        whenToUse: [
          'The pattern is too complex or too shifting to write as explicit rules (fraud, recommendations).',
          'You have lots of historical examples with known outcomes.',
          'The decision needs to scale to thousands or lakhs of cases.',
        ],
        whenNotToUse: [
          'A simple rule or SQL query answers the question exactly (e.g. "list customers with balance < 0").',
          'You have almost no data, or the data is unreliable.',
          'The decision needs a fully explainable, auditable rule by law and a black box is unacceptable.',
        ],
        comparison: [
          { label: 'vs Traditional programming', text: 'Traditional code: human writes rules, data flows through them. ML: data + outcomes are given, the algorithm writes the rules (the model).' },
          { label: 'vs Business Intelligence', text: 'BI (Power BI, SQL reports) answers "what happened and why" from history. ML answers "what will happen" and "what should we do". They complement each other.' },
          { label: 'vs Statistics', text: 'Statistics focuses on inference — understanding relationships and uncertainty. ML focuses on prediction — accuracy on new data. They share most of the same maths.' },
        ],
        keyPoints: [
          'ML learns patterns from data; traditional programming follows hand-written rules.',
          'A model is a mathematical function fitted to examples — not magic, not human thinking.',
          'ML needs representative data: the model only knows what the training data showed it.',
          'Use ML when rules are too complex to write by hand and you have enough historical examples.',
          'ML complements BI: dashboards explain the past, models predict the future.',
        ],
        questionIds: ['q-m1-what-is-ml-1', 'q-m1-what-is-ml-2', 'q-m1-what-is-ml-3'],
        skills: ['Algorithms', 'Problem Solving'],
      },
      {
        id: 'm1-types-of-ml',
        moduleId: 'm1',
        title: 'Types of ML: Supervised, Unsupervised & Reinforcement',
        subtitle: 'Three families, distinguished by what the data tells the algorithm',
        minutes: 14,
        simple:
          'Supervised learning learns from examples that already have answers — like past loans labelled "defaulted" or "repaid" — so it can predict answers for new cases. Unsupervised learning gets no answers at all; it finds hidden structure, like grouping customers into segments. Reinforcement learning learns by trial and error, getting rewards and penalties, like training a game-playing agent.',
        technical:
          'Supervised learning fits a function f: X → y from labelled pairs (x_i, y_i), optimising a loss over predictions. It splits into classification (discrete y: churn yes/no) and regression (continuous y: next month\'s sales). Unsupervised learning works on unlabelled X only: clustering (K-Means, DBSCAN), dimensionality reduction (PCA), and anomaly detection. Reinforcement learning is a sequential decision problem: an agent takes actions in an environment, receives rewards, and learns a policy that maximises cumulative reward — formalised as a Markov Decision Process. Semi-supervised and self-supervised learning sit between: a little labelled data plus lots of unlabelled data.',
        interview:
          'There are three main types. Supervised learning uses labelled data — I know the answer for past examples, and the model learns to predict it; that covers classification like churn prediction and regression like sales forecasting. Unsupervised learning has no labels — it finds structure, like clustering customers into segments. And reinforcement learning learns by trial and error with rewards, which is how game agents and some recommendation systems work. Most business analytics work is supervised.',
        analogy:
          'Supervised learning is studying with an answer key: you check your answers and correct yourself. Unsupervised is being handed a box of mixed photographs with no labels and sorting them into piles that look alike. Reinforcement is learning to ride a bicycle: nobody gives you the "correct" steering angle — you fall, you adjust, you stay upright.',
        realWorld:
          'A telecom company uses supervised classification to predict which customers will churn next month (label: churned or not). The same company uses unsupervised clustering to discover natural customer segments for targeted offers — no labels needed. A food-delivery app uses reinforcement learning to decide dispatch and pricing: each decision gets a reward (delivery completed fast, order accepted) and the system improves its policy over time.',
        mistakes: [
          'Calling any prediction "supervised learning" even when there are no labels — clustering has no target variable.',
          'Treating regression and classification as different ML families. They are both supervised; the difference is whether the target is continuous or categorical.',
          'Forgetting that unsupervised results have no ground truth — you cannot "score" clusters the way you score a classifier.',
          'Reaching for reinforcement learning for a standard prediction problem. RL is powerful but data-hungry and rarely the right first tool in analytics.',
        ],
        whenToUse: [
          'Supervised: you have historical outcomes and need to predict future ones (churn, default, sales).',
          'Unsupervised: you want to discover segments, reduce dimensions, or find anomalies without labels.',
          'Reinforcement: decisions are sequential and feedback comes as rewards over time.',
        ],
        comparison: [
          { label: 'Supervised vs Unsupervised', text: 'Supervised has labels and a clear accuracy score; unsupervised has no labels and is judged by usefulness and internal coherence (e.g. silhouette score).' },
          { label: 'Classification vs Regression', text: 'Both supervised. Classification predicts a category (will churn? yes/no); regression predicts a number (how much will they spend?).' },
          { label: 'Reinforcement vs Supervised', text: 'Supervised learns from fixed labelled examples; reinforcement learns from interaction, where its own actions change what data it sees next.' },
        ],
        keyPoints: [
          'Supervised = labelled data → predict outcomes (classification or regression).',
          'Unsupervised = no labels → find structure (clustering, PCA, anomaly detection).',
          'Reinforcement = learn from rewards through trial and error.',
          'Most business analytics ML is supervised learning.',
          'The type of ML is decided by what your data contains — labels or not.',
        ],
        questionIds: ['q-m1-types-of-ml-1', 'q-m1-types-of-ml-2', 'q-m1-types-of-ml-3'],
        skills: ['Algorithms', 'Problem Solving'],
      },
      {
        id: 'm1-ml-vocabulary',
        moduleId: 'm1',
        title: 'Features, Labels, Samples & Models',
        subtitle: 'The five words you will use in every ML conversation',
        minutes: 10,
        simple:
          'A sample (or row) is one example — one customer, one loan, one transaction. Features are the columns you use to describe it: age, income, tenure. The label (or target) is the answer you want to predict: churned or not, defaulted or not. A model is the learned mapping from features to label. Training is the process of fitting the model to data; prediction is using it on new rows.',
        technical:
          'In the standard notation, the dataset is a matrix X of shape (n_samples, n_features) plus a target vector y of length n_samples. Each row x_i is a feature vector in R^d; each y_i is its label. A model is a parameterised function f_theta(x) → y_hat. Training chooses theta to minimise a loss L(y, y_hat) over the training set; inference applies the fitted f to unseen rows. Related terms: a feature is also called a predictor, attribute or independent variable; the label is also called the target, outcome or dependent variable; hyperparameters are settings chosen before training (e.g. tree depth), as opposed to parameters learned during training.',
        interview:
          'A sample is one row — one customer or one loan. Features are the input columns I use to describe it, like tenure or monthly spend. The label is what I am trying to predict, like whether the customer churned. The model is the function the algorithm learns that maps features to the label. Training fits that function on historical data, and prediction applies it to new rows.',
        analogy:
          'Think of a spreadsheet — you already know this from Excel and Pandas. Each row is a sample. The input columns are features. The column you want to predict is the label. The model is like a formula you did not write yourself: the algorithm discovered it from the data. In SQL terms, features are the columns in your SELECT, and the label is the column you wish you knew in advance.',
        realWorld:
          'In a loan-default model, each sample is one past loan application. Features: applicant income, credit score, loan amount, employment type, number of existing loans. Label: did the loan default within 12 months (1) or not (0)? The model learns the mapping, and for a new applicant it outputs a default probability. In Power BI terms, features are the fields you would put on the X-axis of your analysis, and the label is the KPI you are trying to move.',
        mistakes: [
          'Calling the target a "feature". The label is the thing being predicted, not an input — feeding it in as a feature is leakage.',
          'Mixing up parameters and hyperparameters. Parameters are learned (regression coefficients); hyperparameters are set by you before training (tree depth, K in KNN).',
          'Thinking a model is the algorithm. The algorithm (e.g. decision tree) is the recipe; the model is the specific fitted result after training on your data.',
          'Using "sample" to mean a subset for testing. In ML, a sample is one row; the test set is a set of samples.',
        ],
        keyPoints: [
          'Sample = one row. Features = input columns. Label = the answer to predict.',
          'Model = the learned mapping from features to label.',
          'Training fits the model; prediction (inference) applies it to new data.',
          'Parameters are learned during training; hyperparameters are set before training.',
          'In Pandas terms: X is your feature DataFrame, y is your target Series.',
        ],
        questionIds: ['q-m1-ml-vocabulary-1', 'q-m1-ml-vocabulary-2', 'q-m1-ml-vocabulary-3'],
        skills: ['Algorithms', 'Problem Solving'],
      },
      {
        id: 'm1-train-val-test',
        moduleId: 'm1',
        title: 'Training, Validation & Test Data',
        subtitle: 'Why you must never grade a model on the data it studied',
        minutes: 13,
        simple:
          'You split your data into three parts. The training set teaches the model. The validation set helps you choose between models and settings. The test set is used once, at the very end, to estimate how the model will do on genuinely new data. If you evaluate on the same data you trained on, the score is flattering and meaningless — like letting a student take an exam with the answer key open.',
        technical:
          'The train/validation/test split exists because in-sample error is a biased, optimistic estimate of generalisation error. The training set fits parameters; the validation set (or cross-validation) selects hyperparameters and model variants; the held-out test set provides an unbiased estimate of performance on unseen data from the same distribution. A typical split is 70/15/15 or 80/10/10, though with small data cross-validation often replaces a fixed validation set. Crucially, any decision informed by the test set — including "peeking" to pick the best model — leaks information and invalidates it as an unbiased estimate. For time-series data, splits must be chronological, not random.',
        interview:
          'I split data into three parts. The training set fits the model. The validation set lets me compare models and tune hyperparameters. The test set is held out completely and used only once at the end, to get an honest estimate of how the model performs on unseen data. If I evaluate on training data, the score is optimistic because the model has already seen those rows.',
        analogy:
          'Training data is the textbook and practice problems. Validation data is the mock test — you use it to decide which study method works. Test data is the final board exam — you see it once, and it is the only honest measure of what you actually learned. Studying the final exam paper in advance does not make you smarter; it just fakes the score.',
        realWorld:
          'A bank building a loan-default model trains on 2022–2024 loans, validates on early-2025 loans to pick the best model, and tests on late-2025 loans it has never touched. If the team instead tuned the model until the test score looked great, the "test" score would be a lie — and the model would underperform on real 2026 applicants. This is exactly why regulators and model-risk teams insist on a clean, untouched holdout.',
        mistakes: [
          'Evaluating on the training set and reporting that as the model\'s accuracy.',
          'Using the test set repeatedly to pick models — every peek leaks information and the test set stops being honest.',
          'Random splitting for time-series data. Future rows leak into training; split chronologically instead.',
          'Splitting rows that belong to the same entity (same customer, same loan) across train and test — the model has effectively seen the answer.',
        ],
        whenToUse: [
          'Always split data before training any supervised model.',
          'Use a validation set (or cross-validation) whenever you compare models or tune settings.',
          'Use chronological splits for time-ordered data like sales or transactions.',
        ],
        whenNotToUse: [
          'Do not use a random split when rows are grouped by customer, store or time period — use group or time-based splits.',
          'Do not skip the test set just because the dataset is small — use cross-validation instead.',
        ],
        keyPoints: [
          'Train = fit the model. Validation = choose settings. Test = one honest final check.',
          'In-sample scores are optimistic; only unseen data measures generalisation.',
          'Every decision made using the test set leaks information into it.',
          'Time-series data needs chronological splits, never random ones.',
          'With small data, cross-validation can replace a fixed validation set.',
        ],
        questionIds: ['q-m1-train-val-test-1', 'q-m1-train-val-test-2', 'q-m1-train-val-test-3'],
        skills: ['Algorithms', 'Problem Solving', 'Evaluation'],
      },
      {
        id: 'm1-bias-variance',
        moduleId: 'm1',
        title: 'Bias, Variance & Overfitting',
        subtitle: 'The central trade-off of machine learning',
        minutes: 20,
        simple:
          'Bias is the error from a model that is too simple — it misses real patterns, like drawing a straight line through curved data. Variance is the error from a model that is too sensitive — it memorises noise and quirks in the training data, so it fails on new data. Overfitting is what happens when variance dominates: great on training data, poor on new data. Underfitting is the opposite: too much bias, poor everywhere. Good models balance the two.',
        technical:
          'For a regression target y = f(x) + ε, the expected squared error decomposes as: E[(y − f_hat(x))^2] = Bias(f_hat)^2 + Var(f_hat) + σ^2 (irreducible noise). Bias is the error from approximating the true function with a simpler model class; variance is how much the fitted model changes across different training samples. As model complexity grows, bias falls and variance rises — the classic U-shaped test-error curve. Overfitting occurs when a model captures noise: training error keeps falling while validation error rises. Remedies include more data, simpler models, regularisation (Ridge/Lasso), feature selection, early stopping, and cross-validation to detect it. Underfitting is remedied by more expressive models, better features, or less regularisation.',
        interview:
          'Bias is the error from a model being too simple — it underfits and misses real patterns. Variance is the error from a model being too sensitive to the training data — it overfits, memorising noise, so it performs well in training but badly on new data. The total error is bias squared plus variance plus irreducible noise. In practice I watch the gap between training and validation error: if training error is low but validation error is high, that is overfitting, and I would simplify the model, add regularisation, or get more data. If both errors are high, that is underfitting, and I need a more expressive model or better features.',
        analogy:
          'Imagine preparing for an exam. A high-bias student reads only the chapter summaries and misses the details — underfits, scores poorly everywhere. A high-variance student memorises last year\'s paper word for word — aces the practice test, fails the real exam because the questions changed. The best student understands the concepts: good on practice, good on the real exam. That is the bias–variance balance.',
        realWorld:
          'A churn model trained on 5,000 customers with 200 features and a deep decision tree can hit 99% training accuracy — and 62% on new customers. It memorised quirks: "customers whose ID ends in 7 churned" is noise, not signal. The team pruned the tree, reduced features, and added regularisation; training accuracy fell to 88% but test accuracy rose to 84%. The honest model is the one that generalises, not the one that memorises. In Power BI terms: a dashboard that perfectly explains last quarter but predicts nothing about next quarter is overfit thinking.',
        math: 'Expected test error = Bias^2 + Variance + Irreducible noise. Bias(f_hat) = E[f_hat(x)] − f(x). Variance(f_hat) = E[(f_hat(x) − E[f_hat(x)])^2].',
        code: {
          code: `from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error

X, y = make_regression(n_samples=200, n_features=5, noise=20, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)

# Simple model: low variance, possibly high bias
lin = LinearRegression().fit(X_train, y_train)
# Complex model: low bias, high variance
tree = DecisionTreeRegressor(max_depth=None).fit(X_train, y_train)

for name, model in [("Linear", lin), ("Deep tree", tree)]:
    tr = mean_squared_error(y_train, model.predict(X_train))
    te = mean_squared_error(y_test, model.predict(X_test))
    print(f"{name}: train MSE={tr:.1f}, test MSE={te:.1f}, gap={te - tr:.1f}")`,
          explanation:
            'Run this and you will see the deep tree has near-zero training error but much worse test error — the gap is the signature of overfitting (high variance). The linear model has a smaller gap. Comparing train vs test error is the fastest diagnostic in ML.',
        },
        mistakes: [
          'Thinking overfitting means "the model is bad". It means the model is too fitted to the training sample — often fixable with regularisation or more data.',
          'Chasing 100% training accuracy. Near-perfect training scores are a red flag, not a goal.',
          'Adding more features to fix underfitting when the real problem is a too-simple model — and vice versa.',
          'Confusing bias in ML (simplification error) with bias in data (unfairness). They are different concepts that share a word.',
          'Judging a model by training error alone. Always compare train vs validation/test error.',
        ],
        whenToUse: [
          'Use the bias–variance lens every time train and test performance disagree.',
          'Prefer simpler models when data is small or noisy.',
          'Prefer more complex models when data is large and the pattern is genuinely complex.',
        ],
        comparison: [
          { label: 'Underfitting vs Overfitting', text: 'Underfitting: high bias, high train and test error. Overfitting: high variance, low train error, high test error. Diagnose from the train–test gap.' },
          { label: 'More data vs Regularisation', text: 'More data reduces variance by averaging out noise; regularisation reduces variance by constraining the model. Both fight overfitting, but more data also helps underfitting slightly.' },
        ],
        keyPoints: [
          'Total error = bias² + variance + irreducible noise.',
          'High bias → underfitting (bad everywhere). High variance → overfitting (good in training, bad on new data).',
          'Diagnose with the train–validation gap, not training error alone.',
          'Fight overfitting with more data, simpler models, regularisation, feature selection, cross-validation.',
          'Fight underfitting with more expressive models, better features, less regularisation.',
          'You cannot beat irreducible noise — some error is inherent to the data.',
        ],
        formulas: [
          { name: 'Bias–variance decomposition', formula: 'E[(y − f_hat)^2] = Bias(f_hat)^2 + Var(f_hat) + sigma^2' },
          { name: 'Bias', formula: 'Bias(f_hat) = E[f_hat(x)] − f(x)' },
          { name: 'Variance', formula: 'Var(f_hat) = E[(f_hat(x) − E[f_hat(x)])^2]' },
        ],
        visual: 'bias-variance',
        questionIds: ['q-m1-bias-variance-1', 'q-m1-bias-variance-2', 'q-m1-bias-variance-3'],
        skills: ['Algorithms', 'Problem Solving', 'Evaluation'],
      },
    ],
  },

  // ─── Module 2 — Mathematics for ML ───────────────────────────────────────
  {
    id: 'm2',
    number: 2,
    title: 'Mathematics for ML',
    shortTitle: 'Maths for ML',
    description:
      'The maths you actually need for ML, nothing more: descriptive statistics, probability, correlation, the linear algebra behind every model, and gradient descent — the engine that trains almost everything.',
    icon: 'bar-chart',
    skills: ['Statistics'],
    lessons: [
      {
        id: 'm2-stats-essentials',
        moduleId: 'm2',
        title: 'Statistics Essentials',
        subtitle: 'Mean, median, spread, and why distributions matter',
        minutes: 16,
        simple:
          'Statistics is how you summarise and reason about data before you model it. The mean and median tell you the centre; variance and standard deviation tell you the spread; percentiles and skew tell you the shape. A good analyst checks these first, because a model built on data you have not understood is a model built on sand.',
        technical:
          'Descriptive statistics: central tendency (mean, median, mode), dispersion (range, variance, standard deviation, IQR), and shape (skewness, kurtosis). The standard deviation is in the original units; variance is its square. For inference: the sampling distribution of the mean has standard error σ/√n, and the Central Limit Theorem says sample means approach normality as n grows, which justifies confidence intervals and many hypothesis tests. Percentiles (p25, p50, p75) and the IQR give robust summaries that resist outliers. In ML, these summaries drive feature scaling, outlier handling and sanity checks on train/test splits.',
        interview:
          'Before modelling, I always summarise the data: mean and median for the centre, standard deviation and IQR for spread, and I check skew and outliers. The median is more robust than the mean when the data is skewed — like income. I also use the standard error and confidence intervals when I need to say how reliable an estimate is. Statistics is not a separate subject for me; it is the first step of every analysis.',
        analogy:
          'Statistics is the health checkup of your data. The mean is like your average temperature, the standard deviation is how much it fluctuates, and the median is the value that splits the crowd in half. You would not prescribe medicine without a checkup, and you should not build a model without descriptive stats.',
        realWorld:
          'An analyst looking at monthly revenue sees a mean of ₹42 lakh but a median of ₹28 lakh — the mean is pulled up by two festive-season spikes. Reporting only the mean would mislead leadership. In ML, the same skew matters: a regression trained on skewed revenue will chase the spikes. That is why you check distributions first, then decide on transforms like log.',
        math: 'Mean: x-bar = (Σx_i) / n. Variance: s^2 = Σ(x_i − x-bar)^2 / (n−1). Standard deviation: s = sqrt(variance). Standard error of the mean: SE = s / sqrt(n).',
        code: {
          code: `import pandas as pd

df = pd.read_csv("customers.csv")

# One line, most of descriptive statistics
print(df[["age", "monthly_spend", "tenure_months"]].describe(percentiles=[.1, .25, .5, .75, .9, .99]))

# Skew: > 1 means a long right tail (a few huge values)
print("skew:", df["monthly_spend"].skew())

# IQR-based outlier bounds
q1, q3 = df["monthly_spend"].quantile([0.25, 0.75])
iqr = q3 - q1
print("outlier bounds:", q1 - 1.5 * iqr, "to", q3 + 1.5 * iqr)`,
          explanation:
            'describe() is your first stop in any EDA: count, mean, std, min, quartiles, max. Adding the 1st and 99th percentiles shows the tails where outliers live. Skew above ~1 tells you a log transform may help before modelling.',
        },
        mistakes: [
          'Reporting the mean for heavily skewed data (income, revenue) without the median.',
          'Confusing standard deviation with standard error. SD describes spread of the data; SE describes uncertainty of the mean estimate.',
          'Treating outliers as errors to delete automatically. Some outliers are the signal — fraud is, by definition, an outlier.',
          'Forgetting that describe() only covers numeric columns — categorical columns need value_counts().',
        ],
        keyPoints: [
          'Mean = centre, standard deviation = spread, median = robust centre.',
          'Skewed data: prefer the median; consider a log transform for modelling.',
          'IQR = Q3 − Q1; values beyond 1.5×IQR from the quartiles are candidate outliers.',
          'Standard error = s/√n — how precise your mean estimate is.',
          'Descriptive statistics come before modelling, always.',
        ],
        formulas: [
          { name: 'Mean', formula: 'x-bar = (x_1 + x_2 + ... + x_n) / n' },
          { name: 'Sample variance', formula: 's^2 = Σ(x_i − x-bar)^2 / (n − 1)' },
          { name: 'Standard deviation', formula: 's = sqrt(s^2)' },
          { name: 'Standard error', formula: 'SE = s / sqrt(n)' },
        ],
        questionIds: ['q-m2-stats-essentials-1', 'q-m2-stats-essentials-2', 'q-m2-stats-essentials-3'],
        skills: ['Statistics'],
      },
      {
        id: 'm2-probability',
        moduleId: 'm2',
        title: 'Probability & Conditional Probability',
        subtitle: 'The language of uncertainty — and of every classifier',
        minutes: 18,
        simple:
          'Probability measures how likely something is, on a scale from 0 (impossible) to 1 (certain). Conditional probability asks: how likely is this, given that something else already happened? "What is the chance a customer churns, given they have not logged in for 30 days?" That "given" is the heart of ML: every classifier is really estimating a conditional probability.',
        technical:
          'Probability P(A) satisfies 0 ≤ P(A) ≤ 1 and P(all outcomes) = 1. Conditional probability: P(A|B) = P(A ∩ B) / P(B). Two events are independent if P(A|B) = P(A). Bayes\' theorem inverts a conditional: P(A|B) = P(B|A)·P(A) / P(B) — the posterior equals likelihood times prior over evidence. Key distributions: Bernoulli (one coin flip), Binomial (n flips), Normal (bell curve, mean μ and std σ), and Uniform. A classifier like logistic regression directly models P(y=1|x); Naive Bayes applies Bayes\' theorem with a feature-independence assumption.',
        interview:
          'Probability is how I quantify uncertainty. The most important idea is conditional probability — P of A given B — because that is what a classifier actually outputs: the probability of churn given this customer\'s features. Bayes\' theorem lets me flip a conditional around, which is the basis of Naive Bayes. And I always keep the base rate in mind: a rare event like fraud stays rare even after a positive test, unless the test is very strong.',
        analogy:
          'Probability is weather forecasting for data. "30% chance of rain" does not mean it will rain 30% of the day — it means that in 100 days like today, it rained on about 30. Conditional probability adds the "given": the chance of rain given dark clouds is much higher than the chance of rain on any random day. ML models do the same: the chance of churn given this customer\'s behaviour.',
        realWorld:
          'A fraud team sees an alert: a transaction flagged by a model. The model says P(fraud | this transaction pattern) = 0.85. But fraud is rare — only 0.1% of transactions. Bayes\' theorem is what lets the team combine the base rate with the model\'s signal to get a calibrated probability, instead of panicking at every alert. Similarly, a churn model\'s output of 0.72 means "customers like this churned 72% of the time in the past" — a probability, not a certainty.',
        math: 'Conditional probability: P(A|B) = P(A and B) / P(B). Bayes\' theorem: P(A|B) = P(B|A) * P(A) / P(B). Independence: P(A and B) = P(A) * P(B).',
        code: {
          code: `# Bayes in action: a fraud alert with a rare base rate
p_fraud = 0.001            # base rate: 0.1% of transactions are fraud
p_alert_given_fraud = 0.95 # model catches 95% of fraud
p_alert_given_ok = 0.02    # false alarm rate: 2% of good txns flagged

# P(alert) = P(alert|fraud)P(fraud) + P(alert|ok)P(ok)
p_alert = p_alert_given_fraud * p_fraud + p_alert_given_ok * (1 - p_fraud)

# Bayes: P(fraud | alert)
p_fraud_given_alert = p_alert_given_fraud * p_fraud / p_alert
print(f"P(fraud | alert) = {p_fraud_given_alert:.3f}")  # ~0.045
# Even after an alert, fraud is only ~4.5% likely — the base rate dominates!`,
          explanation:
            'This is the base-rate fallacy made concrete: a 95%-accurate fraud detector still yields mostly false alarms when fraud is rare, because there are so many more legitimate transactions. This is why precision matters more than accuracy for rare events.',
        },
        mistakes: [
          'Ignoring the base rate. A "95% accurate" test for a 0.1%-rare event still produces mostly false positives.',
          'Confusing P(A|B) with P(B|A). P(alert|fraud) is not P(fraud|alert) — Bayes\' theorem is the bridge.',
          'Treating a model\'s 0.72 output as "72% sure" without checking calibration — raw scores are not always true probabilities.',
          'Assuming independence without checking. Naive Bayes assumes features are independent given the label — often false, sometimes harmless.',
        ],
        keyPoints: [
          'Conditional probability P(A|B) is the core of classification: P(label | features).',
          'Bayes\' theorem: posterior = likelihood × prior / evidence.',
          'Base rates matter enormously for rare events like fraud.',
          'Bernoulli, Binomial and Normal are the distributions you will meet most.',
          'A classifier\'s probability output is only useful if the model is calibrated.',
        ],
        formulas: [
          { name: 'Conditional probability', formula: 'P(A|B) = P(A ∩ B) / P(B)' },
          { name: "Bayes' theorem", formula: 'P(A|B) = P(B|A) * P(A) / P(B)' },
          { name: 'Independence', formula: 'P(A ∩ B) = P(A) * P(B)' },
          { name: 'Normal distribution', formula: 'f(x) = (1 / (σ√(2π))) * e^(−(x−μ)^2 / (2σ^2))' },
        ],
        questionIds: ['q-m2-probability-1', 'q-m2-probability-2', 'q-m2-probability-3'],
        skills: ['Statistics'],
      },
      {
        id: 'm2-correlation',
        moduleId: 'm2',
        title: 'Correlation & Covariance',
        subtitle: 'How two variables move together — and what it does not prove',
        minutes: 14,
        simple:
          'Covariance measures whether two variables move together, but its size depends on the units. Correlation fixes that: it rescales covariance to a number between −1 and +1. A correlation near +1 means the two rise together; near −1 means one rises as the other falls; near 0 means no linear relationship. But correlation is not causation — two things can move together without one causing the other.',
        technical:
          'Covariance: Cov(X, Y) = E[(X − μ_X)(Y − μ_Y)]. It is scale-dependent, so we standardise: Pearson\'s r = Cov(X, Y) / (σ_X · σ_Y), ranging from −1 to +1. Pearson measures linear association only; Spearman\'s rank correlation captures any monotonic relationship and is robust to outliers. A correlation matrix (df.corr()) summarises all pairwise relationships and is a standard EDA step. In ML, correlation helps with feature selection (drop one of two near-identical features to avoid multicollinearity) and with spotting leakage — a feature correlated 0.99 with the target is suspicious. Correlation never implies causation: confounding variables, reverse causation and coincidence all produce correlation.',
        interview:
          'Correlation measures how strongly two variables move together linearly, from minus one to plus one. Covariance is the same idea but in the original units, which makes it hard to compare. I use correlation matrices in EDA to find redundant features and to sanity-check relationships. And I always remember correlation is not causation — ice cream sales and drowning both rise in summer, but one does not cause the other; the confounder is temperature.',
        analogy:
          'Correlation is like two friends walking together. If they always speed up and slow down at the same time, correlation is high. But that does not mean one is pulling the other — maybe both are reacting to the same traffic light. Covariance is the same idea measured in their shoe sizes — the number changes with units, so correlation standardises it into a universal scale.',
        realWorld:
          'An e-commerce analyst finds a 0.87 correlation between "number of app sessions" and "monthly spend". Useful for a model, but the business question is causal: will pushing more sessions increase spend, or do big spenders just open the app more? The correlation cannot answer that — only an experiment (A/B test) can. Meanwhile, the analyst also spots two features correlated at 0.98 — "total orders" and "total items" — and drops one to reduce multicollinearity before fitting a regression.',
        math: 'Covariance: Cov(X,Y) = Σ(x_i − x-bar)(y_i − y-bar) / (n−1). Pearson r = Cov(X,Y) / (s_X * s_Y). r ranges from −1 to +1.',
        code: {
          code: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv("customers.csv")

# Pearson correlation matrix — the standard EDA view
corr = df[["age", "tenure_months", "monthly_spend", "support_tickets"]].corr()
print(corr.round(2))

# Heatmap makes strong relationships jump out
sns.heatmap(corr, annot=True, cmap="coolwarm", vmin=-1, vmax=1)
plt.title("Feature correlations")
plt.show()

# Spearman: rank-based, catches non-linear monotonic relationships
print(df["monthly_spend"].corr(df["tenure_months"], method="spearman"))`,
          explanation:
            'corr() gives the Pearson matrix; the heatmap is how you actually read it. Look for features strongly correlated with each other (redundancy, multicollinearity) and with the target (predictive signal — but check for leakage if it is suspiciously perfect).',
        },
        mistakes: [
          'Saying "correlation proves X causes Y". It never does — confounders, reverse causation and coincidence all create correlation.',
          'Using Pearson on a clearly non-linear relationship (like a U-shape) and concluding "no relationship" — Pearson only sees straight lines.',
          'Ignoring multicollinearity: two features correlated at 0.98 make regression coefficients unstable and hard to interpret.',
          'Treating a 0.99 correlation with the target as a great feature. It is usually leakage — information from the future.',
        ],
        whenToUse: [
          'EDA: quick scan of which features relate to the target and to each other.',
          'Feature selection: drop one of a highly correlated pair.',
          'Sanity checks: a feature with near-perfect correlation to the target needs investigation.',
        ],
        comparison: [
          { label: 'Pearson vs Spearman', text: 'Pearson measures linear association and is sensitive to outliers; Spearman uses ranks, so it catches any monotonic trend and is robust.' },
          { label: 'Covariance vs Correlation', text: 'Covariance is unstandardised (units matter); correlation divides by the standard deviations, giving a comparable −1 to +1 scale.' },
        ],
        keyPoints: [
          'Correlation is standardised covariance, on a −1 to +1 scale.',
          'Pearson = linear; Spearman = monotonic (rank-based).',
          'Correlation never proves causation.',
          'High feature–feature correlation → multicollinearity → drop one.',
          'Near-perfect feature–target correlation is usually leakage, not gold.',
        ],
        formulas: [
          { name: 'Covariance', formula: 'Cov(X,Y) = Σ(x_i − x-bar)(y_i − y-bar) / (n − 1)' },
          { name: 'Pearson correlation', formula: 'r = Cov(X,Y) / (s_X * s_Y)' },
        ],
        questionIds: ['q-m2-correlation-1', 'q-m2-correlation-2', 'q-m2-correlation-3'],
        skills: ['Statistics'],
      },
      {
        id: 'm2-linear-algebra',
        moduleId: 'm2',
        title: 'Linear Algebra: Vectors & Matrices',
        subtitle: 'The data structures underneath every ML model',
        minutes: 16,
        simple:
          'A vector is a list of numbers — one row of your data, like [age=28, income=60000, tenure=14]. A matrix is a table of numbers — your whole dataset. Machine learning is, underneath, matrix arithmetic: multiplying matrices, taking dot products, and finding directions that matter. You do not need to do it by hand — NumPy does it — but you need to know what the operations mean.',
        technical:
          'A vector v in R^n is an ordered list of n numbers; a matrix A in R^(m×n) is a table. Core operations: dot product (v·w = Σ v_i w_i) measures alignment and is the heart of linear models — a prediction is w·x + b. Matrix multiplication composes linear transformations; Xw computes predictions for all rows at once. The norm ||v|| = sqrt(Σ v_i^2) is a vector\'s length and is used in distance (KNN, K-Means) and regularisation (Ridge penalises ||w||^2). Eigenvectors/eigenvalues describe the directions and magnitudes along which a matrix stretches space — PCA is built on them. Rank, transpose and inverse appear in the closed-form solution of linear regression: w = (X^T X)^(−1) X^T y.',
        interview:
          'Linear algebra is the language ML is written in. A dataset is a matrix, each row is a vector, and a linear model\'s prediction is just a dot product of the weight vector and the feature vector, plus a bias. Distance in KNN and K-Means is a vector norm. And PCA is built on eigenvectors — the directions of maximum variance in the data. I do not compute these by hand, but I need to know what they mean to understand what the model is doing.',
        analogy:
          'Think of a vector as a recipe: [2 cups flour, 1 cup sugar, 3 eggs] is a vector in "ingredient space". A matrix is a whole cookbook — one recipe per row. A dot product is like comparing two recipes: multiply matching ingredients and add them up to see how similar they are. That is exactly what a linear model does: it compares your data row with its learned "recipe" of weights.',
        realWorld:
          'In a recommendation system, each user is a vector of their ratings, each movie is a vector of its attributes, and similarity between users is a dot product. In a churn model, the prediction for a customer is the dot product of the learned weights with that customer\'s feature vector — one number, computed in a single NumPy operation for all 100,000 customers at once. That is why vectorisation matters: matrix multiplication replaces slow loops.',
        math: 'Dot product: v·w = v_1*w_1 + v_2*w_2 + ... + v_n*w_n. Norm: ||v|| = sqrt(v_1^2 + ... + v_n^2). Linear prediction: y_hat = w·x + b. OLS solution: w = (X^T X)^(−1) X^T y.',
        code: {
          code: `import numpy as np

# One customer as a vector; the model's learned weights as a vector
x = np.array([28, 60000, 14])        # age, income, tenure
w = np.array([0.02, -0.0001, -0.5])  # learned weights
b = 1.5                              # bias

# A linear model's prediction IS a dot product
print("prediction:", np.dot(w, x) + b)

# The same operation for 100,000 customers at once — matrix multiply
X = np.random.randn(100_000, 3)
print("all predictions:", (X @ w + b)[:3])

# Distance (used by KNN and K-Means) is a norm of the difference
a = np.array([1.0, 2.0])
c = np.array([4.0, 6.0])
print("euclidean distance:", np.linalg.norm(a - c))  # 5.0`,
          explanation:
            'np.dot and the @ operator are the workhorses: one line replaces a loop over 100,000 rows. Notice that prediction, distance and similarity are all the same few operations — dot products and norms — reused everywhere in ML.',
        },
        mistakes: [
          'Thinking linear algebra is "just theory". The dot product is literally how a linear model predicts.',
          'Confusing rows and columns: in X, rows are samples and columns are features. X @ w only works when the shapes line up.',
          'Forgetting the bias term b. Without it, every prediction line is forced through the origin.',
          'Looping over rows in Python instead of using matrix operations — 100x slower and the most common beginner performance mistake.',
        ],
        keyPoints: [
          'Vector = one row. Matrix = the whole dataset.',
          'A linear model\'s prediction is a dot product: y_hat = w·x + b.',
          'Distance is a norm of the difference vector — used by KNN and K-Means.',
          'Matrix multiplication vectorises predictions across all rows at once.',
          'Eigenvectors are the directions PCA uses to find maximum variance.',
        ],
        formulas: [
          { name: 'Dot product', formula: 'v·w = Σ v_i * w_i' },
          { name: 'Euclidean norm', formula: '||v|| = sqrt(Σ v_i^2)' },
          { name: 'Linear prediction', formula: 'y_hat = w·x + b' },
          { name: 'OLS closed form', formula: 'w = (X^T X)^(−1) X^T y' },
        ],
        questionIds: ['q-m2-linear-algebra-1', 'q-m2-linear-algebra-2', 'q-m2-linear-algebra-3'],
        skills: ['Statistics'],
      },
      {
        id: 'm2-gradient-descent',
        moduleId: 'm2',
        title: 'Derivatives, Gradients & Gradient Descent',
        subtitle: 'How models actually learn — one small step downhill at a time',
        minutes: 22,
        simple:
          'A derivative tells you how fast something is changing — the slope of a curve at a point. A gradient is the same idea for many variables at once: it points uphill on the error surface. Gradient descent is the learning algorithm: start with random weights, compute the gradient of the error, and take a small step in the opposite direction — downhill. Repeat thousands of times, and the error shrinks until the model fits the data.',
        technical:
          'For a loss function L(θ), the gradient ∇L(θ) is the vector of partial derivatives — it points in the direction of steepest ascent. Gradient descent updates parameters by θ := θ − α·∇L(θ), where α is the learning rate. Too large an α and the updates overshoot and diverge; too small and training crawls. Variants: batch GD (whole dataset per step), stochastic GD (one sample per step — noisy but fast, can escape shallow local minima), and mini-batch GD (the standard compromise, typically 32–256 samples). For linear regression with MSE loss, the loss surface is convex — one global minimum — so gradient descent always finds it. For neural networks the surface is non-convex, and variants like Adam add momentum and adaptive per-parameter learning rates. Feature scaling matters enormously here: unscaled features make the loss surface elongated, and gradient descent zigzags slowly instead of descending directly.',
        interview:
          'Gradient descent is how most models learn. I define a loss function that measures how wrong the model is, then compute its gradient — the direction of steepest increase — and update the weights by stepping in the opposite direction, scaled by the learning rate. I repeat that until the loss stops improving. The learning rate is the key hyperparameter: too high and it overshoots and diverges, too low and training is painfully slow. I usually use mini-batch gradient descent, and I always scale my features first, because unscaled features make the loss surface elongated and the descent zigzag.',
        analogy:
          'Imagine you are blindfolded on a hillside and want to reach the valley. You feel the slope under your feet — that is the gradient. You take a step downhill — that is the update. The size of your step is the learning rate: giant steps and you leap over the valley and up the other side; tiny steps and you take forever. Mini-batch gradient descent is like feeling the slope with a few friends\' help instead of the whole crowd — faster, slightly noisier, and usually good enough.',
        realWorld:
          'When a bank trains a logistic regression on 10 lakh loan applications, it does not solve a formula — it runs gradient descent (or a variant) over the data, nudging the weights a little after each batch of applications until the loss flattens. The same engine trains neural networks for fraud detection and the gradient-boosted trees\' internal optimisation. This is also why data scientists obsess over feature scaling: income in lakhs and age in years create a stretched loss surface where gradient descent zigzags for thousands of extra steps.',
        math: 'Update rule: θ := θ − α * ∇L(θ). Gradient: ∇L = [∂L/∂θ_1, ∂L/∂θ_2, ..., ∂L/∂θ_n]. MSE loss: L = (1/n) * Σ(y_i − y_hat_i)^2. Gradient of MSE wrt weights: ∇L = −(2/n) * X^T (y − Xw).',
        code: {
          code: `import numpy as np

# Gradient descent from scratch — linear regression on one feature
np.random.seed(0)
X = np.random.rand(100, 1) * 10          # feature
y = 2.5 * X.ravel() + 1.0 + np.random.randn(100)  # true: y = 2.5x + 1 + noise

w, b = 0.0, 0.0                          # start from zero
lr = 0.01                                # learning rate
n = len(X)

for step in range(500):
    y_hat = w * X.ravel() + b
    error = y_hat - y
    # Gradients of MSE wrt w and b
    grad_w = (2 / n) * np.dot(error, X.ravel())
    grad_b = (2 / n) * np.sum(error)
    # Step downhill
    w -= lr * grad_w
    b -= lr * grad_b

print(f"learned w={w:.2f} (true 2.5), b={b:.2f} (true 1.0)")
# Try lr = 0.5 and watch it diverge; try lr = 0.0001 and watch it crawl.`,
          explanation:
            'This is the entire learning algorithm in 15 lines: predict, measure error, compute gradients, step downhill. Change the learning rate and you can feel the trade-off yourself — too big diverges, too small crawls. Every library you will use (scikit-learn, XGBoost, PyTorch) is doing a fancier version of exactly this.',
        },
        mistakes: [
          'Picking a learning rate blindly. Too high → divergence (loss explodes or becomes NaN); too low → the model barely learns.',
          'Running gradient descent on unscaled features. Income (lakhs) vs age (years) stretches the loss surface and makes descent zigzag.',
          'Thinking gradient descent always finds the best answer. It does for convex losses like linear regression; for neural nets it finds a good local minimum, not necessarily the global one.',
          'Confusing an epoch with a step. One step = one update on one batch; one epoch = one full pass over the data.',
          'Forgetting to shuffle before mini-batch SGD — ordered data (all churners first) makes updates biased.',
        ],
        whenToUse: [
          'Training almost any model with a differentiable loss: linear/logistic regression, neural networks.',
          'Large datasets where closed-form solutions are too expensive.',
        ],
        whenNotToUse: [
          'Small linear regression where the closed-form solution (normal equation) is exact and instant.',
          'Tree-based models — they do not use gradients to learn splits (though boosting uses gradients to fit residuals).',
        ],
        comparison: [
          { label: 'Batch vs Stochastic vs Mini-batch', text: 'Batch: stable, slow per step, one update per epoch. Stochastic: one sample per update, noisy, fast, can escape local minima. Mini-batch: the standard — stable enough, fast enough, and it uses hardware well.' },
          { label: 'GD vs Normal equation', text: 'For linear regression, the normal equation gives the exact answer in one shot but costs O(n^3) for n features; gradient descent scales to huge data and works for any differentiable loss.' },
          { label: 'SGD vs Adam', text: 'Adam adds momentum plus per-parameter adaptive learning rates; it usually converges faster and is more forgiving of the learning-rate choice, at the cost of more memory and hyperparameters.' },
        ],
        keyPoints: [
          'Gradient = direction of steepest increase; descent steps the opposite way.',
          'Update rule: θ := θ − α·∇L(θ). The learning rate α controls step size.',
          'Too high α → divergence; too low α → slow training.',
          'Mini-batch GD is the standard: a balance of speed and stability.',
          'Scale features first — unscaled features make descent zigzag.',
          'Convex losses (linear regression) have one global minimum; neural nets do not.',
        ],
        formulas: [
          { name: 'Gradient descent update', formula: 'θ := θ − α * ∇L(θ)' },
          { name: 'MSE loss', formula: 'L = (1/n) * Σ(y_i − y_hat_i)^2' },
          { name: 'Gradient of MSE', formula: '∇L = −(2/n) * X^T (y − Xw)' },
        ],
        visual: 'gradient-descent',
        questionIds: ['q-m2-gradient-descent-1', 'q-m2-gradient-descent-2', 'q-m2-gradient-descent-3'],
        skills: ['Statistics', 'Algorithms'],
      },
    ],
  },

  // ─── Module 3 — Python for Machine Learning ──────────────────────────────
  {
    id: 'm3',
    number: 3,
    title: 'Python for Machine Learning',
    shortTitle: 'Python for ML',
    description:
      'The three libraries that carry all of practical ML: NumPy for fast vectorised computation, Pandas for real-world tabular data, and Matplotlib & Seaborn for the charts that make EDA and results readable.',
    icon: 'code',
    skills: ['Python'],
    lessons: [
      {
        id: 'm3-numpy',
        moduleId: 'm3',
        title: 'NumPy: Vectorized Thinking',
        subtitle: 'Arrays, broadcasting, and why loops are the slow way',
        minutes: 15,
        simple:
          'NumPy gives Python fast arrays — fixed-type, contiguous blocks of numbers that operations apply to all at once. Instead of looping over a million rows, you write one expression and NumPy runs it in compiled C. This "vectorised" style is not just faster; it is how ML code is written, because models are matrix operations.',
        technical:
          'A NumPy ndarray is a homogeneous, fixed-size array with a shape (e.g. (100000, 12)) and a dtype. Vectorised operations (arr * 2, arr1 + arr2, np.dot) execute in compiled C and avoid Python-level loops — typically 10–100x faster. Broadcasting aligns arrays of different shapes by stretching the smaller one (a (3,) vector added to a (1000, 3) matrix applies per-row). Key operations: indexing and slicing (arr[0:5, 1]), boolean masking (arr[arr > 0]), aggregation along axes (arr.mean(axis=0)), reshaping (arr.reshape(-1, 1)), and linear algebra (np.dot, @, np.linalg.norm). Random number generation (np.random) underpins train/test splits and synthetic data. NumPy is the foundation under Pandas, scikit-learn and most of the ML stack.',
        interview:
          'NumPy is the foundation of the Python ML stack. Its arrays are typed and contiguous, so operations run in compiled C instead of Python loops — that is vectorisation, and it is typically ten to a hundred times faster. The two ideas I use most are broadcasting, where a smaller array is stretched to match a bigger one, and boolean masking for filtering. Almost every ML library sits on top of NumPy, so thinking in arrays instead of loops is essential.',
        analogy:
          'A Python list is a row of separate boxes, each labelled, each opened one at a time. A NumPy array is a single steel tray with identical slots — you can stamp all of them at once. Broadcasting is like a rubber stamp: one small pattern pressed across a big tray. Vectorised code says "do this to everything" once, instead of saying "do this" a million times.',
        realWorld:
          'A data scientist scoring 10 lakh customers with a churn model does not loop: she holds the features in one (1000000, 20) array and computes predictions with a single matrix multiplication, X @ w + b, in milliseconds. The same loop in pure Python would take minutes. In a pricing model, broadcasting applies one discount rule across every row of a price matrix in a single expression — the same operation you would do with a calculated column in Power BI, but on millions of rows.',
        code: {
          code: `import numpy as np

prices = np.array([100.0, 250.0, 400.0, 1200.0])
# Vectorised: one expression, whole array — no loop
discounted = prices * 0.9
print(discounted)  # [ 90. 225. 360. 1080.]

# Broadcasting: (3,) vector applied to every row of a (4, 3) matrix
X = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]], dtype=float)
means = X.mean(axis=0)          # column means, shape (3,)
print("centered:\\n", X - means)  # (4,3) - (3,) -> broadcasts per row

# Boolean masking: filter without a loop
print("high spenders:", X[X[:, 2] > 5])

# The speed difference (run this once to feel it)
big = np.random.rand(1_000_000)
# np.sum(big) is ~100x faster than sum(big) — same answer, compiled loop`,
          explanation:
            'Three habits to build: operate on whole arrays, let broadcasting handle the per-row logic, and use boolean masks instead of if-statements inside loops. If you find yourself writing "for row in df..." in ML code, there is almost always a vectorised way.',
        },
        mistakes: [
          'Looping over rows or elements in Python when a vectorised operation exists — the single most common performance mistake.',
          'Forgetting that slicing returns a view, not a copy: modifying arr[0:3] can modify the original array. Use .copy() when you need independence.',
          'Broadcasting errors from mismatched shapes, e.g. adding a (4,) vector to a (3, 4) matrix the wrong way — check shapes with .shape first.',
          'Using np.random without a seed when reproducibility matters — set np.random.seed() or use a Generator.',
        ],
        keyPoints: [
          'ndarray: typed, contiguous, fast — the base of the ML stack.',
          'Vectorisation replaces loops with whole-array operations in compiled C.',
          'Broadcasting stretches smaller arrays to match bigger ones.',
          'Boolean masking filters arrays without loops.',
          'Always check .shape when an operation fails — shape mismatch is the usual cause.',
        ],
        questionIds: ['q-m3-numpy-1', 'q-m3-numpy-2', 'q-m3-numpy-3'],
        skills: ['Python'],
      },
      {
        id: 'm3-pandas',
        moduleId: 'm3',
        title: 'Pandas: DataFrames in Practice',
        subtitle: 'The analyst\'s workbench — filter, group, join, reshape',
        minutes: 18,
        simple:
          'Pandas gives you the DataFrame: a table with named columns, like an Excel sheet you can program. You already know the operations from SQL and Excel — filter rows, group and aggregate, join tables, create calculated columns — Pandas just lets you do them in Python, in a pipeline, on data too big for a spreadsheet.',
        technical:
          'A DataFrame is a 2D labelled structure of Series columns. Core verbs: selection (df[col], df.loc[rows, cols], df.iloc), boolean filtering (df[df["age"] > 30]), groupby-aggregate (df.groupby("city")["revenue"].sum()), joins (pd.merge with how="left"/"inner"), reshaping (pivot_table, melt), and vectorised column creation (df["margin"] = df["revenue"] - df["cost"]). Missing data: isna(), fillna(), dropna(). Datetime handling via pd.to_datetime and the .dt accessor. Method chaining with .assign() and .pipe() keeps pipelines readable. Performance: prefer vectorised column operations over .apply() with a Python function, and over .iterrows() — which is almost always the wrong tool. Pandas is the bridge between SQL-shaped thinking and ML-shaped data: X and y for a model usually start life as a DataFrame.',
        interview:
          'Pandas is where I spend most of my time before modelling. I use boolean filtering, groupby with aggregations, merges for joins, and pivot tables — the same operations I know from SQL, but in Python. I create features as new columns, handle missing values with fillna or dropna, and parse dates with to_datetime. The habit I had to build was avoiding iterrows and row-wise apply — vectorised column operations are far faster.',
        analogy:
          'If Excel is a calculator with a grid, Pandas is a factory floor: the same tables, but every operation is a machine you can chain together, rerun, and scale to millions of rows. groupby is a pivot table. merge is a VLOOKUP that actually works. A boolean mask is an auto-filter that returns a new table.',
        realWorld:
          'Before building a churn model, an analyst loads three tables in Pandas — customers, transactions, support tickets — merges them on customer_id, engineers features with groupby (orders in the last 90 days, days since last login, average ticket resolution time), and exports the feature table to the modelling step. In Power BI the same work would be Power Query steps; in Pandas it is a script that reruns identically every month. The RFM analysis in your own ShopKart project is exactly this pattern: groupby customer, aggregate recency/frequency/monetary.',
        code: {
          code: `import pandas as pd

df = pd.read_csv("orders.csv", parse_dates=["order_date"])

# Filter + calculated column (vectorised, no loops)
df["margin"] = df["revenue"] - df["cost"]
recent = df[df["order_date"] >= "2025-01-01"]

# groupby = SQL GROUP BY / Excel pivot table
summary = (
    recent.groupby("customer_id")
    .agg(
        orders=("order_id", "count"),
        total_spend=("revenue", "sum"),
        last_order=("order_date", "max"),
    )
    .reset_index()
)

# Join like SQL LEFT JOIN
customers = pd.read_csv("customers.csv")
features = customers.merge(summary, on="customer_id", how="left")

# Date feature: days since last order (a classic churn signal)
features["days_since_order"] = (
    pd.Timestamp("2026-01-01") - features["last_order"]
).dt.days
print(features.head())`,
          explanation:
            'This is the standard feature-engineering pipeline in miniature: read, filter, derive, groupby-aggregate, merge, and create a date-based feature. Note the named aggregations in .agg() — they produce clean column names, and the whole pipeline is one rerunnable script.',
        },
        mistakes: [
          'Using .iterrows() or a for loop over rows — vectorised column operations are 10–100x faster.',
          'Chained assignment (df["x"][mask] = ...) which may silently fail. Use df.loc[mask, "x"] = ... instead.',
          'Forgetting that merge() defaults to an inner join — rows vanish silently. Use how="left" and check row counts after every join.',
          'Not parsing dates with parse_dates or pd.to_datetime, then comparing date strings lexicographically.',
          'Ignoring the SettingWithCopyWarning — it usually means you are modifying a copy, not the original.',
        ],
        keyPoints: [
          'DataFrame = programmable spreadsheet; Series = one column.',
          'groupby + agg is SQL GROUP BY; merge is SQL JOIN; boolean masks are WHERE.',
          'Create features as vectorised column operations, never row loops.',
          'Always check row counts after a merge — inner joins drop rows silently.',
          'parse_dates + .dt accessor for all date work.',
        ],
        questionIds: ['q-m3-pandas-1', 'q-m3-pandas-2', 'q-m3-pandas-3'],
        skills: ['Python'],
      },
      {
        id: 'm3-plotting',
        moduleId: 'm3',
        title: 'Matplotlib & Seaborn for EDA',
        subtitle: 'The right chart for the question you are asking',
        minutes: 14,
        simple:
          'Matplotlib is Python\'s base plotting library — full control, verbose syntax. Seaborn sits on top of it and makes statistical charts (distributions, relationships, heatmaps) in one line. The skill is not the syntax; it is choosing the right chart: histograms for distributions, scatter plots for relationships, box plots for comparing groups, and heatmaps for correlation matrices.',
        technical:
          'Matplotlib\'s object-oriented API (fig, ax = plt.subplots()) is the standard for reproducible plots: ax.plot, ax.scatter, ax.hist, ax.bar, with explicit titles and labels. Seaborn provides statistical defaults on top: histplot/kdeplot for distributions, scatterplot and regplot for relationships, boxplot/violinplot for group comparisons, heatmap for matrices, pairplot for a full EDA overview. Good practice: one chart, one question; label axes and units; start bar-chart axes at zero; use log scales for skewed data; prefer colourblind-safe palettes. In ML workflows, plots diagnose problems: residual plots for regression, ROC curves for classifiers, learning curves for overfitting, and distribution plots to check train/test similarity.',
        interview:
          'For EDA I use Seaborn for speed and Matplotlib when I need control. Histograms and KDE plots show distributions, scatter plots show relationships, box plots compare groups, and heatmaps show correlation matrices. I always label axes and keep one question per chart. In modelling, I plot residuals to check a regression, ROC curves for classifiers, and learning curves to spot overfitting — the chart usually tells me the problem before the metric does.',
        analogy:
          'Charts are X-rays for data. A table of numbers is like describing a broken bone in words; a plot shows it. A histogram shows you the shape of a distribution the way an X-ray shows the shape of a bone — instantly, without reading a hundred numbers.',
        realWorld:
          'An analyst exploring a loan dataset plots income as a histogram and immediately sees the right skew — most applicants earn modest amounts, a few earn crores. That one chart decides the log transform before modelling. A scatter plot of loan amount vs default rate, coloured by employment type, reveals that the risk pattern differs by group — a hint that an interaction feature might help. In a churn project, a box plot of tenure by churned/not-churned shows at a glance that churners skew to short tenure.',
        code: {
          code: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("customers.csv")

# 1. Distribution: histogram + KDE
sns.histplot(df["monthly_spend"], kde=True, bins=30)
plt.title("Monthly spend is right-skewed")
plt.xlabel("Monthly spend (Rs)")
plt.show()

# 2. Relationship: scatter with a regression line
sns.scatterplot(data=df, x="tenure_months", y="monthly_spend", hue="churned", alpha=0.6)
plt.title("Spend vs tenure, coloured by churn")
plt.show()

# 3. Group comparison: box plot
sns.boxplot(data=df, x="churned", y="support_tickets")
plt.title("Churners raise more support tickets")
plt.show()

# 4. Correlation heatmap
sns.heatmap(df.select_dtypes("number").corr(), annot=True, cmap="coolwarm", vmin=-1, vmax=1)
plt.title("Correlation matrix")
plt.show()`,
          explanation:
            'Four charts cover most of EDA: distribution (histogram), relationship (scatter), group comparison (box plot), and the correlation heatmap. Build the habit of plotting before modelling — the chart often reveals skew, outliers or group differences that numbers hide.',
        },
        mistakes: [
          'Plotting without labels or titles — a chart nobody can read is worse than no chart.',
          'Using a bar chart with a truncated y-axis, which exaggerates small differences.',
          'Plotting 100,000-point scatter plots without alpha transparency — the overplotting hides the pattern. Use alpha=0.3 or sample the data.',
          'Choosing pie charts for comparisons. Humans judge angles badly; bars are almost always clearer.',
          'Skipping plots entirely and modelling blind. EDA plots catch data errors that metrics never will.',
        ],
        keyPoints: [
          'Histogram/KDE → distribution. Scatter → relationship. Box plot → group comparison. Heatmap → correlation.',
          'Seaborn for quick statistical plots; Matplotlib for full control.',
          'One chart, one question. Always label axes and units.',
          'Use alpha transparency for dense scatter plots.',
          'Plots diagnose models too: residuals, ROC curves, learning curves.',
        ],
        questionIds: ['q-m3-plotting-1', 'q-m3-plotting-2', 'q-m3-plotting-3'],
        skills: ['Python'],
      },
    ],
  },

  // ─── Module 4 — Data Preprocessing ───────────────────────────────────────
  {
    id: 'm4',
    number: 4,
    title: 'Data Preprocessing',
    shortTitle: 'Preprocessing',
    description:
      'Real data is messy. This module covers cleaning it up — missing values, duplicates and outliers — converting categories to numbers, scaling features so distance and gradient methods behave, and splitting data without leaking the future into training.',
    icon: 'database',
    skills: ['Preprocessing'],
    lessons: [
      {
        id: 'm4-data-quality',
        moduleId: 'm4',
        title: 'Data Quality: Missing Values, Duplicates & Outliers',
        subtitle: 'Garbage in, garbage out — cleaning is modelling',
        minutes: 18,
        simple:
          'Models cannot learn from data they cannot read. Missing values must be filled or the rows dropped; duplicates must be removed or they double-count evidence; outliers must be investigated — some are errors, some are the most important rows in the dataset. Cleaning is not a chore before the real work. It is the real work: most models fail on data quality, not on algorithm choice.',
        technical:
          'Missingness mechanisms matter: MCAR (missing completely at random — safe to drop or impute), MAR (missing at random — predictable from other columns), and MNAR (missing not at random — the missingness itself carries information, e.g. high earners skipping the income question). Imputation options: mean/median/mode, forward-fill for time series, KNN or model-based imputation, and adding a "was missing" indicator column when missingness is informative. Duplicates: drop exact duplicates; investigate near-duplicates (same customer, slightly different spelling). Outliers: detect via IQR bounds, z-scores (|z| > 3), or domain rules; handle by capping (winsorising), transforming, or removing only with justification. Always profile first: df.isna().sum(), df.duplicated().sum(), and describe() before deciding anything. Document every cleaning decision — it is part of the model.',
        interview:
          'I start every project by profiling the data: how much is missing, where, and whether the missingness itself is informative. If values are missing at random, I impute with the median for numeric columns and the mode for categorical ones; if the missingness carries signal, I add a missing-indicator column. I remove exact duplicates, and I investigate outliers before touching them — a huge transaction might be a data error, or it might be the fraud I am trying to detect. Every cleaning choice gets documented, because it is part of the model.',
        analogy:
          'Preprocessing is mise en place in a kitchen: washing, peeling, chopping, measuring before you cook. A great chef with rotten ingredients still serves a bad dish. No algorithm rescues dirty data — the model can only learn from what you feed it.',
        realWorld:
          'A bank\'s loan data has income missing for 8% of applicants — mostly self-employed applicants whose income is harder to verify. Dropping those rows would silently exclude the self-employed from the model. The team imputes income by employment type and adds an "income_missing" flag, which turns out to be predictive itself. In a churn dataset, a duplicate-customer bug doubles 2,000 rows; the model trained on it overweights those customers until the duplicates are removed. In fraud data, the "outliers" are the fraud — deleting them deletes the target.',
        code: {
          code: `import pandas as pd
import numpy as np

df = pd.read_csv("loans.csv")

# 1. Profile first: where is data missing?
print(df.isna().sum()[df.isna().sum() > 0])
print("duplicate rows:", df.duplicated().sum())

# 2. Missingness that carries signal -> keep a flag, then impute
df["income_missing"] = df["income"].isna().astype(int)
df["income"] = df["income"].fillna(df.groupby("employment_type")["income"].transform("median"))

# 3. Duplicates: drop exact ones
df = df.drop_duplicates()

# 4. Outliers: IQR capping (winsorising) instead of blind deletion
q1, q3 = df["loan_amount"].quantile([0.25, 0.75])
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
n_out = ((df["loan_amount"] < lo) | (df["loan_amount"] > hi)).sum()
print(f"{n_out} loan_amount outliers; capping to [{lo:,.0f}, {hi:,.0f}]")
df["loan_amount"] = df["loan_amount"].clip(lo, hi)`,
          explanation:
            'Notice the order: profile, then decide. The income imputation uses the median within employment type (better than a global median), and the missing-indicator preserves the signal that income was absent. Outliers are capped, not deleted — capping keeps the row while limiting its influence.',
        },
        mistakes: [
          'Deleting all rows with any missing value by default. You can lose a large, biased chunk of your data.',
          'Imputing with the mean on skewed columns — the mean is pulled by outliers; the median is safer.',
          'Deleting outliers automatically. In fraud and anomaly work, outliers are the target.',
          'Imputing before splitting the data — the imputation statistics (mean, median) then leak information from the test set into training.',
          'Cleaning silently without documenting decisions. Nobody can reproduce or audit a model whose cleaning is undocumented.',
        ],
        keyPoints: [
          'Profile first: isna().sum(), duplicated().sum(), describe().',
          'Missingness has types: MCAR, MAR, MNAR — the type decides the fix.',
          'Impute with median (numeric, skewed) or mode (categorical); add a missing-indicator when missingness is informative.',
          'Investigate outliers before removing them; prefer capping over deletion.',
          'Clean after splitting (or fit imputers on train only) to avoid leakage.',
        ],
        questionIds: ['q-m4-data-quality-1', 'q-m4-data-quality-2', 'q-m4-data-quality-3'],
        skills: ['Preprocessing'],
      },
      {
        id: 'm4-encoding',
        moduleId: 'm4',
        title: 'Encoding Categorical Variables',
        subtitle: 'Turning text categories into numbers models can use',
        minutes: 20,
        simple:
          'Models do maths, and maths needs numbers — so text categories like "Mumbai", "Thane" or "Salaried" must be converted. One-hot encoding turns each category into its own yes/no column. Label encoding assigns numbers 0, 1, 2 — but that falsely implies an order, so it is only safe for truly ordered categories like "Low / Medium / High". Ordinal encoding is the ordered version, done deliberately.',
        technical:
          'One-hot encoding (pd.get_dummies, OneHotEncoder) creates one binary column per category: k categories become k columns (or k−1 with drop="first" to avoid the dummy-variable trap in linear models — perfect multicollinearity). It is the default for nominal categories with low cardinality, but it explodes dimensionality for high-cardinality features (a city column with 500 values becomes 500 columns). Label/ordinal encoding maps categories to integers; safe only for ordinal data, because models will treat the numbers as ordered and spaced. Target encoding replaces a category with the mean of the target for that category — powerful for high-cardinality features, but it must be computed with cross-validation inside the training fold, or it leaks the target. Frequency encoding uses the category\'s count. Modern practice: use sklearn\'s OneHotEncoder(handle_unknown="ignore") inside a Pipeline so unseen categories at prediction time do not crash the model. Tree models can sometimes use ordinal codes, but one-hot is still the safer default for nominal data.',
        interview:
          'For nominal categories I use one-hot encoding — one binary column per category — because it does not imply any order. Label encoding assigns numbers, so I only use it for genuinely ordered categories like Low, Medium, High. For high-cardinality features like city with hundreds of values, one-hot explodes, so I use target encoding or frequency encoding instead — but target encoding has to be computed inside cross-validation folds, otherwise it leaks the target. I always put the encoder inside a scikit-learn Pipeline with handle_unknown set to ignore, so a new category at prediction time does not crash the model.',
        analogy:
          'One-hot encoding is a checklist: "Is this customer from Mumbai? Yes/No. From Thane? Yes/No." Each category gets its own tick box. Label encoding is like assigning roll numbers — roll number 5 is not "more" than roll number 2, but a model doing maths on them will act as if it is. That is why roll numbers are fine for ordering (first, second, third) and dangerous for names.',
        realWorld:
          'A loan-default model has an employment_type column: Salaried, Self-employed, Business, Retired. One-hot encoding turns it into four binary columns, and the model learns a separate weight for each. But a "city" column with 400 values would add 400 sparse columns — so the team uses target encoding (each city\'s historical default rate) computed with cross-validation, which captures the signal in one column. A bank that once label-encoded employment_type 0–3 found its logistic regression treating "Retired (3)" as three times "Salaried (1)" — a meaningless ordering that hurt the model.',
        code: {
          code: `import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

df = pd.read_csv("loans.csv")
X = df[["income", "employment_type", "city"]]
y = df["defaulted"]

# The right way: encoder inside a Pipeline, fitted on TRAIN data only
preprocess = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False),
     ["employment_type", "city"]),
], remainder="passthrough")

model = Pipeline([
    ("prep", preprocess),
    ("clf", LogisticRegression(max_iter=1000)),
])
model.fit(X, y)

# A brand-new city at prediction time no longer crashes the model
print(model.predict(pd.DataFrame({
    "income": [50000], "employment_type": ["Salaried"], "city": ["NewCity"]})))

# Quick one-hot for exploration (not for production pipelines)
print(pd.get_dummies(df["employment_type"], dtype=int).head())`,
          explanation:
            'The Pipeline is the key habit: the encoder is fitted on training data only, and handle_unknown="ignore" means unseen categories at prediction time become all-zero rows instead of an error. get_dummies is fine for quick EDA but has no memory of the training categories — never use it across train/test splits.',
        },
        mistakes: [
          'Label-encoding nominal categories (city, product) and letting the model treat the numbers as ordered.',
          'Using pd.get_dummies separately on train and test — the columns will not match if a category is missing in one split.',
          'One-hot encoding a high-cardinality column (hundreds of categories) and exploding the feature space.',
          'Target-encoding on the full dataset before splitting — the target leaks directly into the feature.',
          'Forgetting handle_unknown="ignore": a new category in production crashes the pipeline.',
        ],
        whenToUse: [
          'One-hot: nominal categories with few values (< ~15).',
          'Ordinal: genuinely ordered categories (education level, satisfaction rating).',
          'Target/frequency encoding: high-cardinality categories (city, product ID) — with CV-safe computation.',
        ],
        whenNotToUse: [
          'Do not label-encode nominal categories for linear models, KNN or neural nets.',
          'Do not one-hot a column with hundreds of categories without considering the dimensionality cost.',
          'Do not target-encode without cross-validation — it leaks the label.',
        ],
        comparison: [
          { label: 'One-hot vs Label', text: 'One-hot makes no ordering assumption but adds columns; label encoding is compact but implies order and spacing. Use one-hot for nominal, label only for ordinal.' },
          { label: 'Target vs One-hot', text: 'Target encoding compresses a high-cardinality feature into one informative column but risks leakage; one-hot is safe but explodes in width.' },
        ],
        keyPoints: [
          'One-hot for nominal categories; ordinal only for truly ordered ones.',
          'Label encoding implies order — dangerous for names and cities.',
          'High cardinality → target or frequency encoding, computed CV-safely.',
          'Put encoders inside a Pipeline fitted on train only.',
          'handle_unknown="ignore" protects production predictions from new categories.',
        ],
        questionIds: ['q-m4-encoding-1', 'q-m4-encoding-2', 'q-m4-encoding-3'],
        skills: ['Preprocessing'],
      },
      {
        id: 'm4-scaling',
        moduleId: 'm4',
        title: 'Scaling: Standardization vs Normalization',
        subtitle: 'Putting features on a common scale so no column dominates',
        minutes: 18,
        simple:
          'Features live on wildly different scales: income in lakhs, age in years, tenure in months. Models that use distance (KNN, K-Means) or gradients (linear/logistic regression, neural nets) get dominated by the biggest-scale feature. Scaling fixes that. Standardization (z-score) centres each feature at mean 0 with standard deviation 1. Normalization (min-max) squeezes each feature into a fixed range, usually 0 to 1.',
        technical:
          'Standardization: z = (x − μ) / σ, fitted on the training set only. It centres the data and gives unit variance; it does not bound the range, and it assumes roughly symmetric distributions (outliers distort μ and σ — use RobustScaler, based on median and IQR, when outliers are heavy). Min-max normalization: x\' = (x − min) / (max − min), mapping to [0, 1]; it is sensitive to outliers, which compress the bulk of the data. Scaling is essential for distance-based models (KNN, K-Means, SVM), gradient-based models (linear/logistic regression, neural nets — it makes the loss surface rounder so gradient descent converges faster), and regularised models (Ridge/Lasso penalise coefficients, so unscaled features get penalised unevenly). Tree-based models (decision trees, random forest, boosting) do not need scaling — splits are based on ordering, not distances. Always fit the scaler on the training set and transform both train and test — fitting on all data leaks test information.',
        interview:
          'I scale features when the model cares about distances or gradients — KNN, K-Means, SVM, logistic regression, neural networks. Standardization subtracts the mean and divides by the standard deviation, giving mean zero and unit variance; min-max normalization squeezes values into zero to one. I prefer standardization in general, and RobustScaler when there are heavy outliers, since it uses the median and IQR. Tree models do not need scaling at all, because splits are based on order. And I always fit the scaler on the training set only — fitting on the full data leaks information from the test set.',
        analogy:
          'Scaling is converting currencies before comparing prices. Income in rupees and age in years are like comparing a price in yen with a price in dollars — the bigger number wins for no reason. Standardization converts everything to "how many standard deviations from average", a universal currency. Min-max is like grading everything out of 100.',
        realWorld:
          'A KNN churn model used raw features: monthly_spend (₹500–₹50,000) and tenure (1–60 months). Distance was dominated by spend, so "nearest neighbours" were just "similar spenders" and tenure barely mattered. After standardization, both features contributed fairly and accuracy rose sharply. In a loan model with Ridge regression, unscaled income got a tiny coefficient simply because its numbers were huge — scaling fixed the penalisation. Meanwhile, the team\'s random forest needed no scaling at all.',
        math: 'Standardization (z-score): z = (x − μ) / σ. Min-max: x\' = (x − min) / (max − min). Robust scaling: x\' = (x − median) / IQR.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
from sklearn.pipeline import Pipeline
from sklearn.neighbors import KNeighborsClassifier

df = pd.read_csv("customers.csv")
X = df[["age", "monthly_spend", "tenure_months"]]
y = df["churned"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# The scaler lives INSIDE the pipeline: fitted on train only, applied to test
model = Pipeline([
    ("scale", StandardScaler()),
    ("knn", KNeighborsClassifier(n_neighbors=5)),
])
model.fit(X_train, y_train)
print("test accuracy:", model.score(X_test, y_test))

# Compare scalers on the same data (fit on train only!)
for name, scaler in [("standard", StandardScaler()),
                     ("minmax", MinMaxScaler()),
                     ("robust", RobustScaler())]:
    scaler.fit(X_train)
    print(name, "-> train means:", scaler.transform(X_train).mean(axis=0).round(2))`,
          explanation:
            'The Pipeline pattern again: StandardScaler is fitted on X_train inside fit(), so no test information leaks. Compare the three scalers — standard centres at 0, min-max squeezes to [0,1], robust resists outliers. For a KNN model, scaling is not optional: without it, monthly_spend would dominate every distance.',
        },
        mistakes: [
          'Scaling before splitting the data — the scaler\'s mean/std then include test rows (leakage).',
          'Scaling the target variable in classification, or forgetting to inverse-transform a scaled regression target.',
          'Using min-max scaling on data with extreme outliers — one huge value compresses everything else into a tiny range.',
          'Scaling for tree models out of habit. It is harmless but pointless — trees split on order, not scale.',
          'Using StandardScaler on heavily skewed data without considering a log transform or RobustScaler first.',
        ],
        whenToUse: [
          'Always for KNN, K-Means, SVM, PCA, logistic/linear regression, neural networks, Ridge/Lasso.',
          'RobustScaler when outliers are heavy.',
          'Min-max when you need a bounded range (e.g. neural nets, or features that must stay in [0, 1]).',
        ],
        whenNotToUse: [
          'Tree-based models (decision trees, random forest, gradient boosting) do not need scaling.',
          'Do not scale one-hot encoded binary columns — they are already 0/1.',
        ],
        comparison: [
          { label: 'Standardization vs Min-max', text: 'Standardization centres at 0 with unit variance and handles unbounded data; min-max bounds to [0,1] but is outlier-sensitive. Standard is the safer default.' },
          { label: 'RobustScaler vs StandardScaler', text: 'RobustScaler uses median and IQR, so outliers barely move it; StandardScaler uses mean and std, which outliers distort. Use robust when outliers are real and heavy.' },
        ],
        keyPoints: [
          'Standardization: z = (x − μ)/σ. Min-max: (x − min)/(max − min).',
          'Scaling is essential for distance and gradient-based models.',
          'Tree models do not need scaling.',
          'Fit scalers on train only — inside a Pipeline is the safest habit.',
          'Outliers → RobustScaler (median/IQR) instead of StandardScaler.',
        ],
        formulas: [
          { name: 'Standardization (z-score)', formula: 'z = (x − μ) / σ' },
          { name: 'Min-max normalization', formula: "x' = (x − min) / (max − min)" },
          { name: 'Robust scaling', formula: "x' = (x − median) / IQR" },
        ],
        questionIds: ['q-m4-scaling-1', 'q-m4-scaling-2', 'q-m4-scaling-3'],
        skills: ['Preprocessing'],
      },
      {
        id: 'm4-train-test-split',
        moduleId: 'm4',
        title: 'Train-Test Split & Data Leakage',
        subtitle: 'The split that decides whether your score is honest',
        minutes: 20,
        simple:
          'A train-test split holds back part of your data so you can honestly measure the model on rows it has never seen. Data leakage is when information from the test set — or from the future — sneaks into training, making the model look far better than it really is. Leakage is the most common reason a model that scored 98% in the notebook scores 65% in production.',
        technical:
          'train_test_split(X, y, test_size=0.2, random_state=42) is the standard tool; stratify=y preserves the class ratio in classification, which matters for imbalanced targets (without it, a rare class can vanish from the test set). random_state fixes the split for reproducibility. Leakage comes in three main forms: (1) preprocessing leakage — fitting scalers, imputers or encoders on the full dataset before splitting; (2) target leakage — a feature that contains information about the target that would not be available at prediction time (e.g. "days to repay" in a default model, or a post-churn field in a churn model); (3) split leakage — rows from the same entity or time period in both train and test (same customer in both sets; random split on time-series data). Fixes: split first, then preprocess inside a Pipeline; audit features for "would I know this at prediction time?"; use GroupKFold for grouped data and TimeSeriesSplit for time-ordered data. A suspiciously perfect score (99%+) is the classic symptom — investigate before celebrating.',
        interview:
          'I split the data before doing any preprocessing, and I use stratify for classification so the class balance is preserved. Then I fit all preprocessing — scaling, imputation, encoding — inside a Pipeline on the training data only. The thing I watch for most is leakage: any feature that would not be available at prediction time, like a post-outcome field, or preprocessing fitted on the full dataset. If a model scores suspiciously high, like 99 percent, my first thought is leakage, not success.',
        analogy:
          'Leakage is like a student who practised on the actual exam paper: their mock-test score is perfect, but it says nothing about the real exam. Splitting first and preprocessing inside a pipeline is like sealing the exam paper in an envelope until test day. Stratified splitting is making sure every class section gets a fair mix of strong and weak students in both the practice set and the exam.',
        realWorld:
          'A fintech team built a loan-default model with 97% accuracy — until someone noticed a feature called "repayment_status_6m", recorded six months after the loan was given. At prediction time, for a brand-new applicant, that field does not exist. Removing it dropped accuracy to 78% — the honest number. In another case, a churn model was trained on data where scaling was fitted on the full dataset before splitting; the leak was subtle (a few tenths of a percent), but it was still a leak. The fix in both cases: split first, pipeline everything, and ask of every feature, "would I know this when I have to make the prediction?"',
        code: {
          code: `from sklearn.model_selection import train_test_split, GroupKFold, TimeSeriesSplit
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression

# 1. Split FIRST — before any preprocessing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)  # stratify keeps class balance

# 2. Preprocessing inside the Pipeline: fitted on train only
model = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
print("honest test score:", model.score(X_test, y_test))

# 3. Grouped data (same customer, many rows): keep each group in one fold
gkf = GroupKFold(n_splits=5)
for train_idx, val_idx in gkf.split(X, y, groups=df["customer_id"]):
    pass  # no customer appears in both train and validation

# 4. Time-ordered data: never shuffle; use expanding-window splits
tscv = TimeSeriesSplit(n_splits=5)
for train_idx, val_idx in tscv.split(X):
    pass  # validation always comes AFTER training in time`,
          explanation:
            'Three habits in one snippet: split before preprocessing, stratify for imbalanced classes, and use a Pipeline so every preprocessing step is fitted on train only. GroupKFold and TimeSeriesSplit handle the two most common split-leakage situations — repeated entities and time-ordered data.',
        },
        mistakes: [
          'Preprocessing (scaling, imputation) before splitting — the most common leakage in beginner notebooks.',
          'Forgetting stratify=y on imbalanced data — the test set can end up with almost no positive cases.',
          'Using a feature that is only known after the outcome (repayment status, post-churn survey) — target leakage.',
          'Random splitting on time-series data — future rows leak into training.',
          'Splitting rows from the same customer across train and test — the model has effectively seen the answer.',
          'Celebrating a 99% score instead of investigating it. Suspiciously perfect usually means leakage.',
        ],
        whenToUse: [
          'train_test_split with stratify=y for standard classification/regression.',
          'GroupKFold when rows share an entity (customer, store, patient).',
          'TimeSeriesSplit or a chronological holdout for time-ordered data.',
        ],
        whenNotToUse: [
          'Do not use a random split on time-series or grouped data.',
          'Do not skip the split because the dataset is small — use cross-validation instead.',
        ],
        keyPoints: [
          'Split first, then preprocess — inside a Pipeline fitted on train only.',
          'stratify=y preserves class balance in classification splits.',
          'Leakage types: preprocessing, target (future info), split (groups/time).',
          'Ask of every feature: "would I know this at prediction time?"',
          'A suspiciously perfect score is a leakage alarm, not a success.',
          'Grouped data → GroupKFold; time data → chronological splits.',
        ],
        questionIds: ['q-m4-train-test-split-1', 'q-m4-train-test-split-2', 'q-m4-train-test-split-3'],
        skills: ['Preprocessing', 'Evaluation'],
      },
    ],
  },

  // ─── Module 5 — Supervised Learning: Regression ──────────────────────────
  {
    id: 'm5',
    number: 5,
    title: 'Supervised Learning: Regression',
    shortTitle: 'Regression',
    description:
      'Predicting numbers: the workhorse linear regression, how polynomial features bend the line (and invite overfitting), regularisation with Ridge and Lasso, and the assumptions and diagnostics that separate a responsible regression from a naive one.',
    icon: 'line-chart',
    skills: ['Algorithms', 'Evaluation'],
    lessons: [
      {
        id: 'm5-linear-regression',
        moduleId: 'm5',
        title: 'Linear Regression',
        subtitle: 'The simplest model — and the one every other model is compared to',
        minutes: 22,
        simple:
          'Linear regression finds the straight line (or flat plane, with many features) that best fits the relationship between your features and a number you want to predict — like next month\'s sales from advertising spend. "Best" means the line that minimises the squared gaps between its predictions and the real values. The slope tells you how much the target moves when a feature moves by one unit.',
        technical:
          'The model is y_hat = w_0 + w_1·x_1 + ... + w_p·x_p, fitted by minimising the sum of squared residuals (ordinary least squares, OLS). The closed-form solution is w = (X^T X)^(−1) X^T y; for large data, gradient descent is used instead. Coefficients are interpretable: w_j is the expected change in y for a one-unit change in x_j, holding others fixed — which is why linear regression is the go-to interpretable baseline. Evaluation: R² (fraction of variance explained, 1 − SS_res/SS_tot), MAE (mean absolute error, in target units), RMSE (root mean squared error, penalises large errors more). Key assumptions: linearity, independence of errors, homoscedasticity (constant error variance), normality of errors (matters for inference, less for prediction), and no severe multicollinearity. Violations show up in residual plots — the primary diagnostic.',
        interview:
          'Linear regression models the target as a weighted sum of the features plus an intercept, and it fits those weights by minimising the sum of squared errors. I like it because it is interpretable — each coefficient says how much the target moves when that feature moves by one unit — and because it is a strong baseline: if a fancy model cannot beat linear regression, something is wrong. I evaluate it with R-squared, MAE and RMSE, and I always check the residual plots, because the assumptions — linearity, constant variance, independent errors — show up there first.',
        analogy:
          'Linear regression is like finding the best straight ruler to lay across a scatter of points. You slide and tilt the ruler until the total squared distance from the points to the ruler is as small as possible. The slope of the ruler is the coefficient: "for every extra rupee of ad spend, sales rise by this much." If the points actually curve, a straight ruler is the wrong tool — that is where polynomial regression comes in.',
        realWorld:
          'A retail chain predicts next month\'s revenue per store from footfall, local income, store size and promotion spend. Linear regression gives a model the business can read: "each extra 1,000 visitors is worth ₹X, each promotion rupee returns ₹Y". The team checks R² (0.81 — the model explains 81% of revenue variation) and the residual plot, which shows larger errors for the biggest stores — a hint that variance grows with size (heteroscedasticity) and a log transform of revenue might help. The model is also the baseline: a gradient-boosted model must beat its RMSE to justify its complexity.',
        math: 'Model: y_hat = w_0 + w_1*x_1 + ... + w_p*x_p. OLS: minimise Σ(y_i − y_hat_i)^2. Closed form: w = (X^T X)^(−1) X^T y. R^2 = 1 − SS_res / SS_tot.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("stores.csv")
X = df[["footfall", "local_income", "store_size_sqft", "promo_spend"]]
y = df["monthly_revenue"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression().fit(X_train, y_train)
pred = model.predict(X_test)

print("R^2:", round(r2_score(y_test, pred), 3))
print("MAE (Rs):", round(mean_absolute_error(y_test, pred), 0))
print("RMSE (Rs):", round(np.sqrt(mean_squared_error(y_test, pred)), 0))
print("coefficients:", dict(zip(X.columns, model.coef_.round(2))))
print("intercept:", round(model.intercept_, 2))

# The diagnostic that matters: residuals vs predicted
residuals = y_test - pred
plt.scatter(pred, residuals, alpha=0.6)
plt.axhline(0, color="red", linestyle="--")
plt.xlabel("Predicted revenue")
plt.ylabel("Residual (actual - predicted)")
plt.title("Residual plot: look for patterns, not noise")
plt.show()`,
          explanation:
            'Three metrics together tell the story: R² for explained variance, MAE for typical error in rupees, RMSE to see if big errors dominate. The coefficients are the business story. But the residual plot is the real diagnostic — a random cloud means the linear assumption holds; a curve or a fan shape means it does not.',
        },
        mistakes: [
          'Fitting a line to a clearly curved relationship and trusting the R².',
          'Reporting R² alone. A high R² with huge MAE in rupees can still be a useless model for the business.',
          'Ignoring multicollinearity: two near-identical features make coefficients unstable and uninterpretable.',
          'Extrapolating far beyond the training range. A line fitted on stores of 500–2,000 sq ft says nothing reliable about a 10,000 sq ft store.',
          'Forgetting that coefficients are only comparable if features are on similar scales — standardise first if you want to compare feature importance.',
        ],
        whenToUse: [
          'The relationship is roughly linear and you want an interpretable baseline.',
          'You need to explain drivers to stakeholders ("each extra visitor is worth ₹X").',
          'Small data, where complex models would overfit.',
        ],
        whenNotToUse: [
          'The relationship is clearly non-linear (use polynomial features or trees).',
          'The target is a category — that is classification, not regression.',
          'Features are highly collinear without regularisation (use Ridge).',
        ],
        comparison: [
          { label: 'vs Decision trees', text: 'Trees capture non-linearity and interactions automatically but are less interpretable as "per-unit effects" and overfit more easily.' },
          { label: 'vs KNN regression', text: 'KNN makes no linearity assumption but is slow at prediction time, needs scaling, and cannot extrapolate.' },
          { label: 'vs Ridge/Lasso', text: 'Plain OLS has no penalty on coefficients; Ridge/Lasso add one, trading a little bias for much lower variance.' },
        ],
        keyPoints: [
          'y_hat = w_0 + w_1·x_1 + ... — fitted by minimising squared errors.',
          'Coefficients are interpretable: per-unit effect, holding others fixed.',
          'Metrics: R² (variance explained), MAE (typical error), RMSE (penalises big errors).',
          'Assumptions: linearity, independent errors, constant variance, low multicollinearity.',
          'The residual plot is the primary diagnostic — look for curves and fan shapes.',
          'Always the baseline: a complex model must beat linear regression to earn its place.',
        ],
        formulas: [
          { name: 'Linear model', formula: 'y_hat = w_0 + w_1*x_1 + ... + w_p*x_p' },
          { name: 'OLS objective', formula: 'minimise Σ(y_i − y_hat_i)^2' },
          { name: 'R-squared', formula: 'R^2 = 1 − SS_res / SS_tot' },
          { name: 'MAE', formula: 'MAE = (1/n) * Σ|y_i − y_hat_i|' },
          { name: 'RMSE', formula: 'RMSE = sqrt((1/n) * Σ(y_i − y_hat_i)^2)' },
        ],
        visual: 'linear-regression',
        questionIds: ['q-m5-linear-regression-1', 'q-m5-linear-regression-2', 'q-m5-linear-regression-3'],
        skills: ['Algorithms', 'Evaluation'],
      },
      {
        id: 'm5-polynomial',
        moduleId: 'm5',
        title: 'Polynomial Regression',
        subtitle: 'Bending the line — and the overfitting trap that comes with it',
        minutes: 16,
        simple:
          'Polynomial regression is still linear regression — but on transformed features. Instead of only x, you give the model x, x², x³, and so on, so the fitted curve can bend. A degree-2 polynomial fits a parabola; higher degrees fit wigglier curves. The trap: high degrees fit the training data almost perfectly by chasing noise, then fail on new data. That is overfitting in its purest form.',
        technical:
          'Polynomial regression extends the linear model with basis expansion: y_hat = w_0 + w_1·x + w_2·x² + ... + w_d·x^d. It remains linear in the parameters, so OLS still applies — the non-linearity is in the features, not the fitting. In sklearn, PolynomialFeatures(degree=d) generates the expanded features (including interaction terms for multiple inputs), and it must be used inside a Pipeline so the expansion is consistent across train and test. Degree is a hyperparameter: too low underfits curved data, too high overfits — validation curves (train vs validation error across degrees) show the sweet spot. The number of features grows combinatorially with degree and input count, so polynomial expansion is usually combined with Ridge regularisation. Scaling is important: x² and x³ have very different magnitudes from x.',
        interview:
          'Polynomial regression is linear regression on transformed features — I add x squared, x cubed, and the model can fit curves while still being solved with least squares. The degree is the key choice: too low and it underfits curved data, too high and it overfits badly. I pick the degree with cross-validation, watching where validation error starts rising, and I usually combine it with Ridge regularisation and scaling, since the powers of x have very different magnitudes.',
        analogy:
          'A degree-1 line is a rigid ruler. A degree-2 curve is a flexible strip you can bend once. A degree-15 curve is a piece of string — it can touch every single point, including the ones that are just noise. The string looks perfect on the training points and useless anywhere else. The art is choosing a strip flexible enough for the real shape but stiff enough to ignore the noise.',
        realWorld:
          'A marketing team models sales against ad spend. Spend helps, but with diminishing returns — the curve flattens. A straight line misses the flattening and over-predicts at high spend; a degree-2 polynomial captures the curve and lets the team find the spend level where extra rupees stop paying off. But a degree-9 polynomial fitted to the same data weaves through every monthly blip — including a one-off festive spike — and its forecast for next quarter is nonsense. The team picks degree 2 by cross-validation and sleeps well.',
        math: 'Polynomial model: y_hat = w_0 + w_1*x + w_2*x^2 + ... + w_d*x^d. Still linear in w, so OLS applies.',
        code: {
          code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import cross_val_score

np.random.seed(0)
X = np.linspace(0, 10, 60).reshape(-1, 1)
y = 2 + 3 * X.ravel() - 0.4 * X.ravel() ** 2 + np.random.randn(60) * 2  # true curve: degree 2

# Validation curve: which degree generalises?
for degree in [1, 2, 3, 9, 15]:
    pipe = Pipeline([
        ("poly", PolynomialFeatures(degree=degree)),
        ("scale", StandardScaler()),
        ("reg", LinearRegression()),
    ])
    scores = cross_val_score(pipe, X, y, cv=5, scoring="neg_mean_squared_error")
    print(f"degree {degree}: CV MSE = {-scores.mean():.1f}")

# Degree 2 should win; degree 15 memorises noise.
# Ridge tames high degrees by shrinking the wild coefficients:
ridge_pipe = Pipeline([
    ("poly", PolynomialFeatures(degree=9)),
    ("scale", StandardScaler()),
    ("reg", Ridge(alpha=1.0)),
])
print("degree 9 + Ridge CV MSE:",
      -cross_val_score(ridge_pipe, X, y, cv=5, scoring="neg_mean_squared_error").mean().round(1))`,
          explanation:
            'The validation curve is the lesson: CV error falls from degree 1 to 2 (the true shape), then rises as the polynomial starts memorising noise. Ridge pulls the degree-9 model back toward sanity. Note the Pipeline: polynomial expansion and scaling are fitted per fold, so the CV score is honest.',
        },
        mistakes: [
          'Cranking the degree up until training error hits zero and calling it a good model.',
          'Forgetting to scale after polynomial expansion — x³ dwarfs x and destabilises the fit.',
          'Applying PolynomialFeatures to many input columns at once: the feature count explodes combinatorially.',
          'Judging the degree by training error instead of cross-validation error.',
          'Using polynomial regression when a tree or spline would capture the shape more safely.',
        ],
        whenToUse: [
          'The relationship is smooth and curved (diminishing returns, saturation).',
          'You want to keep the interpretability and simplicity of linear regression.',
          'Low-dimensional data (1–3 features) where expansion stays manageable.',
        ],
        whenNotToUse: [
          'High-dimensional data — the expanded feature count explodes.',
          'Very wiggly or discontinuous relationships — trees or splines fit better.',
          'Without cross-validation to choose the degree.',
        ],
        comparison: [
          { label: 'vs Linear regression', text: 'Polynomial adds curved flexibility; linear is safer when the true relationship is straight.' },
          { label: 'vs Decision trees', text: 'Trees capture arbitrary non-linearity and interactions but give step-like predictions; polynomials give smooth curves.' },
          { label: 'vs Splines', text: 'Splines (piecewise polynomials) bend locally and are more stable than one global high-degree polynomial.' },
        ],
        keyPoints: [
          'Polynomial regression = linear regression on x, x², x³, ...',
          'Degree is a hyperparameter: choose it by cross-validation, not training error.',
          'High degrees overfit — the classic bias–variance demonstration.',
          'Scale after expansion; combine with Ridge for high degrees.',
          'Feature count explodes with many inputs — keep it low-dimensional.',
        ],
        formulas: [
          { name: 'Polynomial model', formula: 'y_hat = w_0 + w_1*x + w_2*x^2 + ... + w_d*x^d' },
        ],
        visual: 'overfitting',
        questionIds: ['q-m5-polynomial-1', 'q-m5-polynomial-2', 'q-m5-polynomial-3'],
        skills: ['Algorithms', 'Evaluation'],
      },
      {
        id: 'm5-ridge-lasso',
        moduleId: 'm5',
        title: 'Ridge, Lasso & Elastic Net',
        subtitle: 'Regularisation — deliberately adding bias to reduce variance',
        minutes: 18,
        simple:
          'Regularisation adds a penalty for large coefficients to the loss function, which stops the model from leaning too hard on any one feature. Ridge shrinks all coefficients toward zero but keeps them all. Lasso can shrink some coefficients to exactly zero, which performs feature selection automatically. Elastic Net combines both penalties. The strength of the penalty, alpha, is tuned by cross-validation.',
        technical:
          'Ridge (L2): loss = SSE + α·Σw_j². The penalty shrinks coefficients smoothly toward zero, never exactly to zero; it handles multicollinearity well because correlated features share the weight. Lasso (L1): loss = SSE + α·Σ|w_j|. The absolute-value penalty has a kink at zero, so it sets some coefficients exactly to zero — automatic feature selection — but with correlated features it tends to pick one arbitrarily and zero the rest. Elastic Net: loss = SSE + α·(ρ·Σ|w_j| + (1−ρ)·Σw_j²), combining both: selection plus stability. All three require scaled features, because the penalty treats every coefficient equally — an unscaled feature with huge values gets an unfairly small coefficient. Alpha is tuned by cross-validation (RidgeCV, LassoCV, or GridSearchCV). As α → 0, all three approach OLS; as α → ∞, all coefficients → 0.',
        interview:
          'Regularisation adds a penalty on the size of the coefficients to the loss function. Ridge uses the squared penalty, L2 — it shrinks all coefficients toward zero and handles multicollinearity well. Lasso uses the absolute penalty, L1 — it can push coefficients to exactly zero, so it does feature selection automatically. Elastic Net combines both. I tune alpha with cross-validation, and I always scale features first, because the penalty applies to all coefficients equally. The trade-off is deliberate: I accept a little bias to get a large reduction in variance.',
        analogy:
          'Think of coefficients as a team\'s salaries. OLS pays whatever each member demands, even if one star takes everything. Ridge is a salary cap that trims everyone proportionally — nobody is fired, but nobody dominates. Lasso is a stricter cap that can fire people outright — some coefficients become zero and leave the team. Elastic Net is a policy that trims salaries and occasionally lets someone go.',
        realWorld:
          'A bank\'s credit model has 60 features, many of them correlated (three different measures of income, four of past delinquency). Plain OLS gives wild, unstable coefficients — one income measure gets +500, another −480. Ridge stabilises them into sensible, similar weights and improves test RMSE. In a marketing-mix model with 40 channels, Lasso zeroes out 28 of them, telling the team which channels actually move sales — a result the business can act on. Elastic Net is used when the team wants Lasso\'s selection without its arbitrary choice among correlated channels.',
        math: 'Ridge (L2): loss = Σ(y − y_hat)^2 + α * Σw_j^2. Lasso (L1): loss = Σ(y − y_hat)^2 + α * Σ|w_j|. Elastic Net: loss = SSE + α * (ρ * Σ|w_j| + (1−ρ) * Σw_j^2).',
        code: {
          code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet

# 60 features, many of them redundant — a classic regularisation scenario
X, y = make_regression(n_samples=200, n_features=60, n_informative=10,
                       noise=15, random_state=0)

for name, model in [
    ("OLS", LinearRegression()),
    ("Ridge a=1", Ridge(alpha=1.0)),
    ("Ridge a=10", Ridge(alpha=10.0)),
    ("Lasso a=0.5", Lasso(alpha=0.5, max_iter=5000)),
    ("ElasticNet", ElasticNet(alpha=0.5, l1_ratio=0.5, max_iter=5000)),
]:
    pipe = Pipeline([("scale", StandardScaler()), ("m", model)])
    mse = -cross_val_score(pipe, X, y, cv=5, scoring="neg_mean_squared_error").mean()
    pipe.fit(X, y)
    n_zero = int(np.sum(np.abs(pipe[-1].coef_) < 1e-6))
    print(f"{name:14s} CV MSE={mse:8.1f}   coefficients set to 0: {n_zero}")`,
          explanation:
            'OLS overfits the 50 noise features; Ridge shrinks them and improves CV error; Lasso zeroes most of them out entirely. The scaler in the pipeline is not optional here — the penalty is meaningless if features are on different scales. In real work you would tune alpha with RidgeCV/LassoCV rather than guessing.',
        },
        mistakes: [
          'Regularising without scaling — the penalty hits features unevenly and the results are meaningless.',
          'Using Lasso and treating its arbitrary choice among correlated features as "the truth" about which feature matters.',
          'Tuning alpha on the test set instead of cross-validation.',
          'Expecting Lasso to keep all important features. With correlated features it keeps one and zeroes the rest.',
          'Forgetting that regularisation shrinks coefficients, so they are no longer unbiased estimates — do not report them as causal effects.',
        ],
        whenToUse: [
          'Ridge: many correlated features, multicollinearity, or when you want to keep all features.',
          'Lasso: you want automatic feature selection and a sparse, readable model.',
          'Elastic Net: correlated features plus a desire for selection.',
        ],
        whenNotToUse: [
          'When you need unbiased coefficient estimates for inference (regularisation adds bias by design).',
          'When features are few, uncorrelated and data is plentiful — plain OLS is fine.',
        ],
        comparison: [
          { label: 'Ridge vs Lasso', text: 'Ridge shrinks everything, keeps everything, stable with correlated features. Lasso zeroes some coefficients (selection) but chooses arbitrarily among correlated ones.' },
          { label: 'Elastic Net vs both', text: 'Elastic Net keeps Lasso\'s sparsity while Ridge\'s L2 part stabilises the choice among correlated features.' },
          { label: 'vs Feature selection', text: 'Lasso is embedded selection (happens during fitting); filter/wrapper selection happens before fitting. Lasso is cheaper and integrated.' },
        ],
        keyPoints: [
          'Regularisation = penalty on coefficient size, trading bias for variance.',
          'Ridge (L2): shrinks all coefficients, keeps all features, handles collinearity.',
          'Lasso (L1): can zero coefficients → automatic feature selection.',
          'Elastic Net: both penalties — selection plus stability.',
          'Always scale features before regularising.',
          'Tune alpha by cross-validation, never on the test set.',
        ],
        formulas: [
          { name: 'Ridge (L2)', formula: 'loss = Σ(y − y_hat)^2 + α * Σw_j^2' },
          { name: 'Lasso (L1)', formula: 'loss = Σ(y − y_hat)^2 + α * Σ|w_j|' },
          { name: 'Elastic Net', formula: 'loss = SSE + α * (ρ * Σ|w_j| + (1−ρ) * Σw_j^2)' },
        ],
        questionIds: ['q-m5-ridge-lasso-1', 'q-m5-ridge-lasso-2', 'q-m5-ridge-lasso-3'],
        skills: ['Algorithms', 'Evaluation'],
      },
      {
        id: 'm5-regression-practice',
        moduleId: 'm5',
        title: 'Regression in Practice: Assumptions & Diagnostics',
        subtitle: 'Checking a regression the way a professional does',
        minutes: 16,
        simple:
          'A regression is only trustworthy if its assumptions hold: the relationship is roughly linear, the errors have constant spread and no pattern, and the features are not near-duplicates of each other. You check these with residual plots, not with faith. When an assumption fails, you fix it — transform a skewed target, add a missing feature, or switch models — rather than reporting a number you do not believe.',
        technical:
          'The OLS assumptions: (1) linearity — E[y|X] is linear in X; (2) independence — errors are uncorrelated (violated in time series: autocorrelation); (3) homoscedasticity — constant error variance; (4) normality of errors — needed for confidence intervals and p-values, less so for pure prediction; (5) no perfect multicollinearity. Diagnostics: residual-vs-fitted plot (curves → non-linearity; fan shape → heteroscedasticity), Q-Q plot of residuals (normality), Durbin–Watson statistic (~2 means no autocorrelation), VIF (variance inflation factor; VIF > 5–10 flags multicollinearity). Fixes: log/sqrt transforms for skew and heteroscedasticity, polynomial or interaction terms for non-linearity, Ridge for multicollinearity, adding lag features or time-aware models for autocorrelation. Always compare against a naive baseline (predict the mean) — a model that barely beats the mean is not a model.',
        interview:
          'After fitting a regression I check the assumptions with residual plots. A curve in the residuals means the relationship is not linear — I would add polynomial terms. A fan shape means the variance grows with the prediction — heteroscedasticity — and a log transform of the target often fixes it. I check multicollinearity with VIF, and if two features are near-duplicates I drop one or use Ridge. And I always compare against the simplest baseline, predicting the mean, so I know whether the model adds anything at all.',
        analogy:
          'Running a regression without diagnostics is like buying a house without an inspection: the outside looks fine, but the plumbing might be broken. Residual plots are the inspection report — they show the cracks the summary statistics hide.',
        realWorld:
          'A sales-forecasting regression shows R² of 0.88 — impressive, until the residual plot reveals a clear curve: the model systematically under-predicts in festive months and over-predicts in lean months. The relationship is not linear; adding a festive-season indicator and a squared term for ad spend fixes it, and R² rises to 0.94 with residuals that look like noise. In another model, residuals fan out as predictions grow — the team logs the revenue target, the fan disappears, and the forecast errors become stable across store sizes.',
        code: {
          code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

df = pd.read_csv("stores.csv")
X = sm.add_constant(df[["footfall", "promo_spend"]])  # statsmodels needs an explicit intercept
y = df["monthly_revenue"]
res = sm.OLS(y, X).fit()
print(res.summary())  # coefficients, p-values, R^2, F-statistic, Durbin-Watson

# 1. Residuals vs fitted — the master diagnostic
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].scatter(res.fittedvalues, res.resid, alpha=0.6)
axes[0].axhline(0, color="red", linestyle="--")
axes[0].set_title("Residuals vs fitted")
axes[0].set_xlabel("Fitted"); axes[0].set_ylabel("Residual")

# 2. Q-Q plot — are residuals roughly normal?
sm.qqplot(res.resid, line="s", ax=axes[1])
axes[1].set_title("Q-Q plot of residuals")
plt.tight_layout(); plt.show()

# 3. VIF for multicollinearity (VIF > 5-10 is a flag)
from statsmodels.stats.outliers_influence import variance_inflation_factor
print("VIF:", {c: round(variance_inflation_factor(X.values, i), 2)
               for i, c in enumerate(X.columns)})

# 4. Baseline check: does the model beat predicting the mean?
print("model RMSE:", round(np.sqrt(mean_squared_error(y, res.fittedvalues)), 0))
print("mean baseline RMSE:", round(np.sqrt(mean_squared_error(y, np.full_like(y, y.mean(), dtype=float))), 0))`,
          explanation:
            'statsmodels is the right tool for diagnostics: its summary gives p-values, confidence intervals, R² and Durbin–Watson in one place, which scikit-learn deliberately does not. The residual plot and Q-Q plot are visual checks you should do for every regression; VIF catches multicollinearity; the mean baseline tells you whether the model earns its keep.',
        },
        mistakes: [
          'Reporting R² without ever looking at a residual plot.',
          'Treating a statistically significant coefficient as practically important. With 10 lakh rows, tiny effects are "significant".',
          'Ignoring autocorrelation in time-ordered data — standard errors become wrong and the model looks more certain than it is.',
          'Using p-values from a model whose assumptions are violated. The p-values inherit the violations.',
          'Forgetting the baseline: a model with R² 0.3 might still be valuable, or worthless — it depends on what predicting the mean achieves.',
        ],
        keyPoints: [
          'Check assumptions with plots: residuals vs fitted, Q-Q plot.',
          'Curve in residuals → non-linearity. Fan shape → heteroscedasticity.',
          'VIF > 5–10 flags multicollinearity.',
          'Log transforms fix skew and stabilise variance.',
          'Always compare against the predict-the-mean baseline.',
          'statsmodels for inference and diagnostics; scikit-learn for prediction pipelines.',
        ],
        questionIds: ['q-m5-regression-practice-1', 'q-m5-regression-practice-2', 'q-m5-regression-practice-3'],
        skills: ['Algorithms', 'Evaluation'],
      },
    ],
  },

  // ─── Module 6 — Classification ───────────────────────────────────────────
  {
    id: 'm6',
    number: 6,
    title: 'Classification',
    shortTitle: 'Classification',
    description:
      'Predicting categories: logistic regression, KNN, decision trees, random forests, gradient boosting, and SVM & Naive Bayes. The algorithms behind churn prediction, loan default, and fraud detection — with their trade-offs made explicit.',
    icon: 'git-branch',
    skills: ['Algorithms', 'Model Selection'],
    lessons: [
      {
        id: 'm6-logistic-regression',
        moduleId: 'm6',
        title: 'Logistic Regression',
        subtitle: 'Regression\'s name, classification\'s job — probabilities done right',
        minutes: 22,
        simple:
          'Despite its name, logistic regression is a classification algorithm. It takes the linear combination of features you know from linear regression and squeezes it through the sigmoid function, which maps any number to a probability between 0 and 1. Above 0.5, predict class 1; below, class 0. The output is a probability, not just a label — which is why businesses love it.',
        technical:
          'The model: P(y=1|x) = σ(w·x + b), where σ(z) = 1 / (1 + e^(−z)) is the sigmoid. The decision boundary is linear in feature space: the set of points where w·x + b = 0. Parameters are fitted by maximising the log-likelihood, equivalently minimising the log loss (binary cross-entropy): L = −Σ [y·log(p) + (1−y)·log(1−p)], optimised by gradient descent or Newton methods. Coefficients are interpretable as log-odds: a one-unit increase in x_j multiplies the odds of y=1 by e^(w_j). The 0.5 threshold is a default, not a law — it should be tuned to the business cost of false positives vs false negatives. In sklearn, LogisticRegression applies L2 regularisation by default (C is the inverse strength; smaller C = stronger regularisation), and features should be scaled. Extensions: multinomial logistic regression (softmax) for multi-class problems, and class_weight="balanced" for imbalanced data.',
        interview:
          'Logistic regression models the probability that an example belongs to the positive class. It takes a linear combination of the features and passes it through the sigmoid function, which maps any value to a probability between zero and one. I fit it by maximising the likelihood, or equivalently minimising log loss. I like it because it is interpretable — the coefficients are log-odds — it outputs calibrated probabilities, and it is a strong baseline for any classification problem. The 0.5 threshold is just a default; I tune it based on whether false positives or false negatives cost the business more.',
        analogy:
          'Linear regression is a ruler that can read any number, including impossible ones like a probability of 1.4. Logistic regression puts a clamp on the ruler: the sigmoid squeezes every reading into the 0–1 range, like a thermometer that cannot read below freezing or above boiling. The decision boundary is the line where the thermometer reads exactly 0.5.',
        realWorld:
          'A bank\'s loan-default model is usually logistic regression, not because it is the most accurate, but because regulators and credit officers can read it: "each 10-point rise in credit score multiplies the odds of default by 0.85". The probability output feeds directly into pricing — a 2% default probability gets a lower interest rate than a 12% one. The team tunes the approval threshold to the business: approving a defaulter costs far more than rejecting a good applicant, so they set the threshold at 0.3, not 0.5.',
        math: 'Sigmoid: σ(z) = 1 / (1 + e^(−z)). Model: P(y=1|x) = σ(w·x + b). Log loss: L = −Σ [y*log(p) + (1−y)*log(1−p)]. Log-odds: log(p / (1−p)) = w·x + b.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score
import numpy as np

df = pd.read_csv("loans.csv")
X = df[["income", "credit_score", "loan_amount", "existing_loans"]]
y = df["defaulted"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

model = Pipeline([
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
])
model.fit(X_train, y_train)

proba = model.predict_proba(X_test)[:, 1]  # P(default) for each applicant
print(classification_report(y_test, model.predict(X_test)))
print("ROC-AUC:", round(roc_auc_score(y_test, proba), 3))

# Coefficients as odds ratios: how each feature multiplies the odds of default
clf = model.named_steps["clf"]
for feat, coef in zip(X.columns, clf.coef_[0]):
    print(f"{feat:16s} odds ratio = {np.exp(coef):.3f}")

# Threshold tuning: at 0.3 we catch more defaulters (higher recall), at a cost
print("flagged as risky at 0.3 threshold:", int((proba >= 0.3).sum()),
      "of", len(proba))`,
          explanation:
            'Two things to notice: predict_proba gives probabilities, not just labels — that is the business value. And the odds ratios translate coefficients into plain language: an odds ratio of 0.85 for credit score means each unit rise cuts the odds of default by 15%. class_weight="balanced" helps when defaults are rare.',
        },
        mistakes: [
          'Calling it a regression algorithm in an interview. It is classification; the "regression" is historical.',
          'Using the 0.5 threshold blindly when false negatives cost far more than false positives (or vice versa).',
          'Forgetting to scale features — regularisation then penalises coefficients unevenly.',
          'Interpreting coefficients as probabilities. They are log-odds; exponentiate them for odds ratios.',
          'Expecting it to capture non-linear patterns. The boundary is linear — add polynomial/interaction features or use trees if the pattern curves.',
        ],
        whenToUse: [
          'You need interpretable, explainable classification with probability outputs.',
          'Baseline for any binary classification problem.',
          'Regulated domains (credit, insurance) where explainability is required.',
        ],
        whenNotToUse: [
          'The decision boundary is strongly non-linear and you cannot engineer features to fix it.',
          'Features interact in complex ways that trees or boosting capture more naturally.',
        ],
        comparison: [
          { label: 'vs Linear regression', text: 'Linear regression predicts unbounded numbers; logistic regression squeezes the linear output through a sigmoid to give probabilities for a binary outcome.' },
          { label: 'vs Decision trees', text: 'Trees capture non-linearity automatically but output coarse probabilities and are harder to explain as "per-unit effects".' },
          { label: 'vs Random forest / boosting', text: 'Usually less accurate on complex data, but far more interpretable and faster; the right baseline to beat.' },
        ],
        keyPoints: [
          'Logistic regression is classification: sigmoid maps a linear score to a probability.',
          'Decision boundary is linear; coefficients are log-odds.',
          'Fitted by minimising log loss (cross-entropy).',
          'The 0.5 threshold is a default — tune it to business costs.',
          'Scale features; use class_weight="balanced" for imbalanced data.',
          'The interpretable baseline every classifier is compared against.',
        ],
        formulas: [
          { name: 'Sigmoid', formula: 'σ(z) = 1 / (1 + e^(−z))' },
          { name: 'Logistic model', formula: 'P(y=1|x) = σ(w·x + b)' },
          { name: 'Log loss', formula: 'L = −Σ [y*log(p) + (1−y)*log(1−p)]' },
          { name: 'Log-odds', formula: 'log(p / (1−p)) = w·x + b' },
        ],
        questionIds: ['q-m6-logistic-regression-1', 'q-m6-logistic-regression-2', 'q-m6-logistic-regression-3'],
        skills: ['Algorithms', 'Model Selection'],
      },
      {
        id: 'm6-knn',
        moduleId: 'm6',
        title: 'K-Nearest Neighbors (KNN)',
        subtitle: 'You are the average of your nearest neighbours',
        minutes: 20,
        simple:
          'KNN makes no model at all. To predict a new case, it finds the K most similar cases in the training data — by distance — and takes a majority vote (classification) or an average (regression). A new customer is predicted to churn if most of their nearest neighbours churned. Simple, intuitive, and surprisingly effective on small, clean data.',
        technical:
          'KNN is a lazy, non-parametric, instance-based learner: there is no training phase beyond storing the data; all computation happens at prediction time. Distance is usually Euclidean (Minkowski p=2), but Manhattan (p=1) suits grid-like or high-dimensional data, and cosine similarity suits text. The choice of K controls the bias–variance trade-off: small K (1–3) is noisy and overfits (high variance); large K smooths the boundary but can underfit (high bias) and, in imbalanced data, drowns the minority class. Features must be scaled — distance is meaningless when one feature spans lakhs and another spans tens. Complexity: prediction is O(n·d) per query (brute force), so KNN is slow on large data; KD-trees/ball trees help in low dimensions but degrade in high dimensions (the curse of dimensionality: in high dimensions, all points become roughly equidistant). Weighted KNN gives nearer neighbours more votes. KNN also does regression (average of neighbours\' targets) and imputation.',
        interview:
          'KNN is a lazy learner — there is no training step; it stores the data and, at prediction time, finds the K closest training examples by distance and takes a majority vote for classification or an average for regression. The K is the key hyperparameter: small K is noisy and overfits, large K over-smooths. I always scale features, because distance is meaningless otherwise, and I avoid KNN on very large or very high-dimensional data, because prediction is slow and distances lose meaning — the curse of dimensionality.',
        analogy:
          'KNN is the "show me your friends" rule. To guess whether a new student will enjoy the data science club, look at the five students most similar to them — same subjects, same interests. If four of the five love it, predict they will too. No theory, no formula — just the wisdom of the nearest crowd.',
        realWorld:
          'A small boutique retailer with 2,000 customers uses KNN to recommend products: for each customer, find the 10 most similar shoppers (by purchase history and demographics) and suggest what they bought. It works because the data is small and the similarity idea is intuitive. But a bank with 50 lakh customers cannot use KNN for real-time fraud scoring — every prediction would scan 50 lakh rows. And a genomics team with 20,000 features finds KNN useless: in 20,000 dimensions, every point is equally far from every other point.',
        math: 'Euclidean distance: d(x, z) = sqrt(Σ(x_i − z_i)^2). Prediction (classification): majority vote of the K nearest neighbours. Prediction (regression): mean of the K neighbours\' targets.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
import matplotlib.pyplot as plt

df = pd.read_csv("customers.csv")
X = df[["age", "monthly_spend", "tenure_months", "support_tickets"]]
y = df["churned"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

# Choose K by cross-validation — watch the bias-variance trade-off
scores = {}
for k in [1, 3, 5, 9, 15, 25, 51]:
    pipe = Pipeline([
        ("scale", StandardScaler()),   # REQUIRED for KNN
        ("knn", KNeighborsClassifier(n_neighbors=k)),
    ])
    scores[k] = cross_val_score(pipe, X_train, y_train, cv=5).mean()
    print(f"K={k:3d}  CV accuracy={scores[k]:.3f}")

best_k = max(scores, key=scores.get)
print("best K:", best_k)

plt.plot(list(scores.keys()), list(scores.values()), marker="o")
plt.xlabel("K"); plt.ylabel("CV accuracy"); plt.title("KNN: small K overfits, large K underfits")
plt.show()`,
          explanation:
            'The CV curve is the lesson: K=1 usually scores worst (pure noise), accuracy rises to a sweet spot, then falls as K grows too large. Note the scaler inside the pipeline — without it, monthly_spend would dominate every distance and KNN would effectively use one feature.',
        },
        mistakes: [
          'Forgetting to scale features — the single most damaging KNN mistake.',
          'Using KNN on large datasets and wondering why prediction is slow. KNN stores everything and scans it per query.',
          'Using KNN on high-dimensional data (hundreds of features) where distances become meaningless.',
          'Picking K=1 by default. It memorises noise; cross-validate K instead.',
          'Using Euclidean distance on one-hot encoded or mixed-type data without thinking — consider Manhattan or Hamming for such cases.',
        ],
        whenToUse: [
          'Small, clean, low-dimensional datasets where similarity is meaningful.',
          'A quick intuitive baseline, or recommendation by similarity.',
          'When the decision boundary is irregular and local patterns matter.',
        ],
        whenNotToUse: [
          'Large datasets (slow prediction) or high-dimensional data (curse of dimensionality).',
          'Real-time scoring with tight latency budgets.',
          'When you need an interpretable model or feature importance.',
        ],
        comparison: [
          { label: 'vs Logistic regression', text: 'KNN makes no linearity assumption and captures local patterns; logistic regression is faster at prediction, interpretable, and works better on large data.' },
          { label: 'vs Decision trees', text: 'Trees learn explicit rules and handle mixed types; KNN needs scaling and stores all data, but needs no training.' },
          { label: 'vs K-Means', text: 'Both use distance, but KNN is supervised (predicts labels from neighbours) while K-Means is unsupervised (finds clusters without labels).' },
        ],
        keyPoints: [
          'Lazy learner: no training phase; prediction = vote/average of K nearest neighbours.',
          'K controls bias–variance: small K overfits, large K underfits — cross-validate it.',
          'Scaling is mandatory — distances are meaningless on raw mixed scales.',
          'Slow at prediction on large data; useless in very high dimensions.',
          'Works for classification (vote) and regression (average).',
        ],
        formulas: [
          { name: 'Euclidean distance', formula: 'd(x, z) = sqrt(Σ(x_i − z_i)^2)' },
          { name: 'Manhattan distance', formula: 'd(x, z) = Σ|x_i − z_i|' },
        ],
        visual: 'knn',
        questionIds: ['q-m6-knn-1', 'q-m6-knn-2', 'q-m6-knn-3'],
        skills: ['Algorithms', 'Model Selection'],
      },
      {
        id: 'm6-decision-trees',
        moduleId: 'm6',
        title: 'Decision Trees',
        subtitle: 'If-else rules, learned from data',
        minutes: 22,
        simple:
          'A decision tree predicts by asking a series of yes/no questions about the features: "Is tenure under 6 months? Is monthly spend above ₹2,000?" Each question splits the data, and at the end of the path sits a prediction. Trees are the most readable model in ML — you can draw one on a whiteboard and explain it to anyone.',
        technical:
          'A decision tree recursively partitions the feature space by choosing, at each node, the split that most reduces impurity. For classification, impurity is measured by Gini (1 − Σ p_i²) or entropy (−Σ p_i log₂ p_i); the split is chosen to maximise information gain (the weighted impurity reduction). For regression, splits minimise variance (MSE). A node becomes a leaf when it is pure, hits max_depth, or has fewer than min_samples_split samples. Unpruned trees overfit badly — they memorise the training data. Control comes from max_depth, min_samples_leaf, min_samples_split, and cost-complexity pruning (ccp_alpha). Trees handle non-linear relationships and feature interactions naturally, need no scaling, and handle mixed feature types; but a single tree is high-variance (small data changes → very different trees) and biased toward features with many distinct values. Feature importance comes from the total impurity reduction each feature achieves across splits.',
        interview:
          'A decision tree splits the data by asking yes-or-no questions about features, choosing each split to maximise information gain — the reduction in impurity, measured by Gini or entropy. It is the most interpretable model I know, and it handles non-linearity and interactions without any feature engineering. The catch is overfitting: a deep tree memorises the training data. So I control it with max depth, minimum samples per leaf, and pruning. A single tree is also high-variance — small changes in the data can produce a very different tree — which is exactly why random forests exist.',
        analogy:
          'A decision tree is a game of Twenty Questions, or a doctor\'s diagnosis flowchart: "Fever? Yes. Cough? No. Then check for..." Each answer narrows the possibilities until you reach a conclusion. The tree learns the best questions to ask, and in the best order, from the data.',
        realWorld:
          'A telecom churn tree learns rules the business can act on: "customers with tenure under 6 months AND more than 3 support tickets in the last month churn 68% of the time." That leaf becomes a retention campaign. But an unpruned tree grown on the same data has 400 leaves, including gems like "customers aged 41, from Thane, who joined on a Tuesday churn 100%" — memorised noise from 2 customers. Pruning to depth 4 keeps the real rules and drops the noise. Trees are also the engine inside random forests and gradient boosting — understanding them unlocks those too.',
        math: 'Gini impurity: G = 1 − Σ p_i^2. Entropy: H = −Σ p_i * log2(p_i). Information gain: IG = impurity(parent) − weighted avg impurity(children).',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree
from sklearn.metrics import classification_report
import matplotlib.pyplot as plt

df = pd.read_csv("customers.csv")
X = df[["tenure_months", "monthly_spend", "support_tickets", "contract_months"]]
y = df["churned"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

# Unpruned: memorises. Pruned: generalises. Compare them.
for name, tree in [
    ("unpruned", DecisionTreeClassifier(random_state=42)),
    ("pruned", DecisionTreeClassifier(max_depth=4, min_samples_leaf=30, random_state=42)),
]:
    tree.fit(X_train, y_train)
    print(f"{name:9s} train={tree.score(X_train, y_train):.3f}  test={tree.score(X_test, y_test):.3f}")

# The pruned tree, as readable rules
pruned = DecisionTreeClassifier(max_depth=4, min_samples_leaf=30, random_state=42).fit(X_train, y_train)
print(export_text(pruned, feature_names=list(X.columns)))
print(classification_report(y_test, pruned.predict(X_test)))

plt.figure(figsize=(14, 8))
plot_tree(pruned, feature_names=list(X.columns), class_names=["stays", "churns"],
          filled=True, rounded=True, fontsize=9)
plt.show()`,
          explanation:
            'The train/test comparison shows overfitting directly: the unpruned tree scores near-perfect on train and worse on test. export_text turns the pruned tree into plain if-else rules you can paste into a report — this readability is the tree\'s superpower. min_samples_leaf=30 stops the tree from making leaves out of a handful of customers.',
        },
        mistakes: [
          'Growing an unpruned tree and trusting its training accuracy.',
          'Forgetting that a single tree is unstable — retraining on slightly different data can give a very different tree.',
          'Using a tree on data with a strong linear relationship and expecting it to extrapolate. Trees cannot predict beyond the range of training targets.',
          'Reading feature importance as causal. Importance measures predictive usefulness in this tree, not real-world causation.',
          'Letting a high-cardinality feature (like customer_id) into the tree — it will split on it meaninglessly.',
        ],
        whenToUse: [
          'You need a model stakeholders can read and audit.',
          'Non-linear relationships and interactions, without feature engineering.',
          'Mixed numeric/categorical data, missing values tolerated.',
        ],
        whenNotToUse: [
          'You need the highest accuracy — ensembles (forests, boosting) beat single trees.',
          'The relationship is smooth and linear — a tree approximates it with crude steps.',
          'Extrapolation beyond the training range is needed.',
        ],
        comparison: [
          { label: 'vs Logistic regression', text: 'Trees capture non-linearity and interactions automatically; logistic regression needs feature engineering for that but extrapolates and gives calibrated probabilities.' },
          { label: 'vs Random forest', text: 'A forest averages many trees to kill variance; a single tree is readable but unstable. Readability vs accuracy.' },
          { label: 'vs KNN', text: 'Trees learn explicit rules and predict fast; KNN stores all data and is slow at prediction, but needs no training.' },
        ],
        keyPoints: [
          'Trees split by maximising information gain (Gini or entropy reduction).',
          'Most interpretable model: readable as if-else rules.',
          'No scaling needed; handles non-linearity and interactions naturally.',
          'Unpruned trees overfit — control with max_depth, min_samples_leaf, pruning.',
          'Single trees are high-variance; ensembles fix that.',
          'Trees cannot extrapolate beyond the training target range.',
        ],
        formulas: [
          { name: 'Gini impurity', formula: 'G = 1 − Σ p_i^2' },
          { name: 'Entropy', formula: 'H = −Σ p_i * log2(p_i)' },
          { name: 'Information gain', formula: 'IG = impurity(parent) − Σ (n_child / n_parent) * impurity(child)' },
        ],
        visual: 'decision-tree',
        questionIds: ['q-m6-decision-trees-1', 'q-m6-decision-trees-2', 'q-m6-decision-trees-3'],
        skills: ['Algorithms', 'Model Selection'],
      },
      {
        id: 'm6-random-forest',
        moduleId: 'm6',
        title: 'Random Forest',
        subtitle: 'Many noisy trees, one wise vote',
        minutes: 20,
        simple:
          'A random forest grows hundreds of decision trees, each trained on a random sample of the data and allowed to consider only a random subset of features at each split — then averages their predictions (or takes a majority vote). Each tree is noisy and overfits on its own, but their errors cancel out in the average. The result is accurate, robust, and one of the best "first serious model" choices in ML.',
        technical:
          'Random forest is bagging (bootstrap aggregating) plus feature randomness. Each of n_estimators trees is trained on a bootstrap sample (n rows drawn with replacement — about 63% unique rows per tree) and, at each split, considers only a random subset of features (max_features, typically sqrt(p) for classification, p/3 for regression). The randomness decorrelates the trees, so averaging reduces variance without increasing bias much. Out-of-bag (OOB) samples — the ~37% of rows not in a tree\'s bootstrap sample — give a free validation estimate (oob_score=True) without a separate split. Feature importance is computed from mean impurity decrease across trees, though permutation importance is more reliable. Key hyperparameters: n_estimators (more is better, with diminishing returns; 200–500 is typical), max_depth, min_samples_leaf, max_features. Forests handle non-linearity, interactions and mixed types, need no scaling, and resist overfitting far better than single trees — but they are slower, use more memory, are harder to interpret, and cannot extrapolate.',
        interview:
          'A random forest is an ensemble of decision trees. Each tree is trained on a bootstrap sample of the data, and at each split it only considers a random subset of features. That randomness makes the trees different from each other, so when I average their predictions, the individual errors cancel out and variance drops sharply. I get a free validation estimate from the out-of-bag samples — the rows each tree never saw. It is my default strong model for tabular data: accurate, robust to overfitting, needs no scaling. The trade-off is that it is slower and harder to interpret than a single tree.',
        analogy:
          'A random forest is a panel of judges instead of one judge. Each judge reads a random subset of the case files and focuses on random aspects. Any single judge might be biased or miss something — but the panel\'s majority vote is far more reliable than any individual verdict. The random subsets are the key: if every judge read the same files the same way, they would all make the same mistake.',
        realWorld:
          'A bank\'s fraud team replaced a single decision tree with a random forest of 300 trees. The single tree\'s accuracy swung wildly when retrained on new months of data; the forest was stable month after month, and its out-of-bag score matched the test score closely, so the team trusted it. The forest also surfaced feature importance: transaction velocity and device changes mattered most, which shaped the team\'s monitoring dashboards. The cost: scoring 10 lakh transactions a day takes minutes instead of seconds, and explaining a single declined transaction now needs SHAP rather than a simple rule path.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.inspection import permutation_importance

df = pd.read_csv("customers.csv")
X = df[["tenure_months", "monthly_spend", "support_tickets", "contract_months",
        "days_since_login", "plan_changes"]]
y = df["churned"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

forest = RandomForestClassifier(
    n_estimators=300, max_depth=None, min_samples_leaf=2,
    max_features="sqrt", oob_score=True, n_jobs=-1, random_state=42)
forest.fit(X_train, y_train)

print("OOB score (free validation):", round(forest.oob_score_, 3))
print("test score:", round(forest.score(X_test, y_test), 3))
print(classification_report(y_test, forest.predict(X_test)))

# Permutation importance: shuffle each feature, measure the damage.
# More trustworthy than the built-in impurity importance.
perm = permutation_importance(forest, X_test, y_test, n_repeats=10, random_state=42)
for feat, imp in sorted(zip(X.columns, perm.importances_mean),
                        key=lambda t: -t[1]):
    print(f"{feat:20s} importance = {imp:.3f}")`,
          explanation:
            'Notice the OOB score: a validation estimate that cost nothing — no split needed. n_jobs=-1 uses all CPU cores since trees train independently. Permutation importance is the honest version of feature importance: it measures how much the score drops when a feature\'s values are shuffled, so it is not biased toward high-cardinality features like impurity importance is.',
        },
        mistakes: [
          'Using the default n_estimators=100 without checking whether more trees help. More trees almost never hurt (just slower).',
          'Trusting impurity-based feature importance blindly — it favours high-cardinality features. Use permutation importance.',
          'Expecting a random forest to extrapolate. Like all trees, it cannot predict beyond the training target range.',
          'Forgetting that forests are slow and memory-hungry at prediction time — a problem for real-time scoring.',
          'Tuning max_depth and min_samples_leaf aggressively. Forests are fairly robust to these; n_estimators and max_features matter more.',
        ],
        whenToUse: [
          'Tabular data where you want strong accuracy with minimal tuning.',
          'When you need feature importance and robustness to overfitting.',
          'As a reliable baseline before trying gradient boosting.',
        ],
        whenNotToUse: [
          'Real-time scoring with strict latency or memory limits.',
          'When you need a fully explainable model (use a single tree or logistic regression).',
          'Very high-dimensional sparse data (text) — linear models or boosting usually do better.',
        ],
        comparison: [
          { label: 'vs Single decision tree', text: 'Forest averages many decorrelated trees: much lower variance, much higher accuracy, much less interpretable.' },
          { label: 'vs Gradient boosting', text: 'Boosting usually wins on accuracy but is more prone to overfitting and needs more tuning; forests are more forgiving and parallelise trivially.' },
          { label: 'vs Logistic regression', text: 'Forest captures non-linearity and interactions automatically; logistic regression is interpretable and extrapolates.' },
        ],
        keyPoints: [
          'Bagging + feature randomness: many decorrelated trees, averaged.',
          'Averaging cancels individual trees\' errors → big variance reduction.',
          'Out-of-bag samples give a free validation score.',
          'No scaling needed; robust to overfitting; handles mixed types.',
          'Use permutation importance, not impurity importance.',
          'Cannot extrapolate; slower and heavier than single models.',
        ],
        questionIds: ['q-m6-random-forest-1', 'q-m6-random-forest-2', 'q-m6-random-forest-3'],
        skills: ['Algorithms', 'Model Selection'],
      },
      {
        id: 'm6-boosting',
        moduleId: 'm6',
        title: 'Gradient Boosting, XGBoost & LightGBM',
        subtitle: 'Trees that learn from each other\'s mistakes — the tabular-data champion',
        minutes: 22,
        simple:
          'Boosting builds trees one after another, where each new tree focuses on the mistakes of all the trees before it. The first tree makes rough predictions; the second tree predicts the errors (residuals) of the first; the third fixes what is still wrong — and so on. XGBoost and LightGBM are fast, highly-tuned versions of this idea, and they win most tabular-data competitions and power a huge share of production models.',
        technical:
          'Gradient boosting fits an additive model F(x) = Σ γ_m·h_m(x): at each stage m, a new weak learner h_m (usually a shallow tree) is fitted to the negative gradient of the loss with respect to the current predictions — for squared error, that gradient is just the residual. A learning rate (shrinkage, typically 0.01–0.3) scales each tree\'s contribution; smaller rates need more trees but generalise better. Key hyperparameters: n_estimators, learning_rate, max_depth (typically 3–8), subsample (row sampling), colsample_bytree (feature sampling), and regularisation (reg_lambda L2, reg_alpha L1 in XGBoost). XGBoost adds second-order gradients (Hessian), sparsity-aware splits, and built-in regularisation; LightGBM uses histogram-based splits and leaf-wise growth, making it faster on large data; CatBoost handles categorical features natively. Boosting usually beats random forests on accuracy but overfits more easily — early stopping on a validation set is the standard control. All three handle missing values natively.',
        interview:
          'Gradient boosting builds trees sequentially, and each new tree is fitted to the residuals — the errors — of everything built so far. A learning rate shrinks each tree\'s contribution so the model improves gradually instead of overfitting in one jump. XGBoost and LightGBM are optimised implementations: XGBoost uses second-order gradients and built-in regularisation, LightGBM is faster on large data with histogram-based splits. Boosting usually gives the best accuracy on tabular data, but it overfits more easily than a random forest, so I use early stopping on a validation set and tune the learning rate and tree depth carefully.',
        analogy:
          'Boosting is like a team of editors revising a draft. The first editor fixes the obvious errors. The second editor only looks at what is still wrong. The third fixes the remaining issues. Each editor is weak alone — they only fix a little — but the sequence produces a polished document. The learning rate is how much of each editor\'s changes you accept: accept everything and the draft swings wildly; accept a little at a time and it converges smoothly.',
        realWorld:
          'A lender\'s credit-risk model moved from logistic regression (AUC 0.76) to random forest (0.81) to XGBoost (0.84). The gain came from boosting\'s ability to capture interactions — like "high loan amount is only risky when income is low" — that the linear model missed. But the team also learned the cost: without early stopping, the XGBoost model kept improving on training data while validation AUC fell after 400 trees. They set early stopping at 50 rounds, tuned the learning rate to 0.05, and shipped a model that beat the forest while staying stable month to month.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
from xgboost import XGBClassifier
# LightGBM: from lightgbm import LGBMClassifier  (same API shape)

df = pd.read_csv("loans.csv")
X = df[["income", "credit_score", "loan_amount", "existing_loans", "tenure_months"]]
y = df["defaulted"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
# A validation slice for early stopping
X_tr, X_val, y_tr, y_val = train_test_split(
    X_train, y_train, test_size=0.2, random_state=42, stratify=y_train)

model = XGBClassifier(
    n_estimators=1000, learning_rate=0.05, max_depth=4,
    subsample=0.8, colsample_bytree=0.8,
    reg_lambda=1.0, eval_metric="logloss",
    early_stopping_rounds=50, random_state=42)
model.fit(X_tr, y_tr, eval_set=[(X_val, y_val)], verbose=False)

print("best iteration:", model.best_iteration)
print("test ROC-AUC:", round(roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]), 3))`,
          explanation:
            'Early stopping is the key habit: n_estimators=1000 is a ceiling, not a target — training halts when validation log-loss stops improving for 50 rounds, and best_iteration tells you where. subsample and colsample_bytree add randomness that fights overfitting, and reg_lambda is Ridge-style regularisation on the leaf weights.',
        },
        mistakes: [
          'Training hundreds of trees without early stopping and overfitting silently.',
          'Setting a high learning rate with many trees — fast to overfit. Low rate + more trees + early stopping is the standard recipe.',
          'Tuning XGBoost on the test set. Use a validation split or cross-validation.',
          'Forgetting that boosting is sequential — it cannot parallelise across trees the way a forest can, so training is slower.',
          'Using boosting when the data is tiny or noisy — a simpler model often generalises better.',
        ],
        whenToUse: [
          'Tabular data where accuracy matters most — usually the strongest off-the-shelf model.',
          'Kaggle-style competitions and production scoring on structured data.',
          'When you can afford tuning time and a validation set for early stopping.',
        ],
        whenNotToUse: [
          'Tiny datasets — boosting will memorise them.',
          'When full interpretability is required (use logistic regression or a shallow tree).',
          'Unstructured data (images, raw text) — neural networks dominate there.',
        ],
        comparison: [
          { label: 'vs Random forest', text: 'Boosting builds trees sequentially to fix errors (reduces bias); forests build them independently and average (reduces variance). Boosting usually wins on accuracy, forests are more forgiving.' },
          { label: 'XGBoost vs LightGBM', text: 'LightGBM is usually faster on large data (histogram splits, leaf-wise growth); XGBoost is the battle-tested default. Accuracy is usually close.' },
          { label: 'vs Logistic regression', text: 'Boosting captures non-linearity and interactions automatically; logistic regression is interpretable and extrapolates.' },
        ],
        keyPoints: [
          'Boosting = sequential trees, each fitted to the previous errors (residuals).',
          'Learning rate shrinks each tree\'s contribution — low rate + more trees + early stopping.',
          'XGBoost: second-order gradients, built-in regularisation. LightGBM: faster on large data.',
          'Usually the best accuracy on tabular data — but overfits without early stopping.',
          'Handles missing values natively; no scaling needed.',
        ],
        questionIds: ['q-m6-boosting-1', 'q-m6-boosting-2', 'q-m6-boosting-3'],
        skills: ['Algorithms', 'Model Selection'],
      },
      {
        id: 'm6-svm-nb',
        moduleId: 'm6',
        title: 'SVM & Naive Bayes',
        subtitle: 'Maximum-margin boundaries and probability with a bold assumption',
        minutes: 18,
        simple:
          'A Support Vector Machine finds the boundary between classes that has the widest possible margin — the largest gap to the nearest points on each side. With a kernel, it can bend that boundary around curved patterns. Naive Bayes classifies by applying Bayes\' theorem with a bold simplification: it assumes the features are independent of each other given the class. The assumption is usually wrong, but the classifier is fast, simple, and surprisingly good — especially for text.',
        technical:
          'SVM: finds the hyperplane w·x + b = 0 that maximises the margin 2/||w|| between classes, subject to most points being correctly classified; the C parameter trades margin width against misclassification tolerance (small C = wider margin, more errors allowed; large C = strict, overfits). Support vectors are the points nearest the boundary — only they determine it. The kernel trick (RBF/gaussian kernel most common) maps data into a higher-dimensional space where a linear boundary works, without computing the mapping explicitly; gamma controls the RBF kernel\'s reach. SVMs need scaled features, are slow on large data, and do not natively output probabilities (Platt scaling adds them). Naive Bayes: P(y|x) ∝ P(y)·Π P(x_i|y) — the independence assumption makes training a matter of counting. Variants: GaussianNB (continuous features), MultinomialNB (counts — text), BernoulliNB (binary features). Laplace smoothing handles unseen feature values. Naive Bayes trains in one pass, works well with little data, and is a classic spam-filter baseline.',
        interview:
          'An SVM finds the decision boundary with the maximum margin between the classes — the widest gap to the nearest points, which are called support vectors. The C parameter controls the trade-off between a wide margin and allowing misclassifications, and the kernel trick lets it handle non-linear boundaries, usually with the RBF kernel. Naive Bayes is very different: it applies Bayes\' theorem assuming the features are independent given the class. That assumption is almost always wrong, but the model is fast, needs little data, and works very well for text classification like spam filtering. I would pick SVM for small, clean, high-dimensional problems and Naive Bayes as a fast baseline, especially for text.',
        analogy:
          'An SVM is like building the widest possible road between two neighbourhoods — the margin is the road, and the support vectors are the houses closest to it. Only those closest houses decide where the road goes. Naive Bayes is like a doctor who assumes every symptom is independent evidence: fever suggests flu, cough suggests flu, and the doctor multiplies the evidence together — even though fever and cough often come together.',
        realWorld:
          'A news app classifies articles into topics with Multinomial Naive Bayes over word counts: it trains in seconds on a lakh of articles and is accurate enough to route content. An SVM with an RBF kernel powers a small medical-image classifier where the dataset is only a few thousand images but each has hundreds of features — the margin-based approach generalises well from little data. But neither is the pick for a 50-lakh-row churn model: the SVM would be too slow, and Naive Bayes\' independence assumption is badly wrong for correlated customer features.',
        math: 'SVM margin: maximise 2 / ||w|| subject to y_i(w·x_i + b) >= 1. RBF kernel: K(x, z) = exp(−γ * ||x − z||^2). Naive Bayes: P(y|x) ∝ P(y) * Π P(x_i|y).',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import classification_report

df = pd.read_csv("customers.csv")
X = df[["age", "monthly_spend", "tenure_months", "support_tickets"]]
y = df["churned"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

# SVM: scaling is REQUIRED (it is distance/margin based)
svm = Pipeline([
    ("scale", StandardScaler()),
    ("svc", SVC(kernel="rbf", C=1.0, gamma="scale", probability=True)),
])
svm.fit(X_train, y_train)
print("SVM:"); print(classification_report(y_test, svm.predict(X_test)))

# Naive Bayes: no scaling needed, trains in one pass
nb = GaussianNB().fit(X_train, y_train)
print("Naive Bayes:"); print(classification_report(y_test, nb.predict(X_test)))

# Text classification is Naive Bayes' home turf:
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
texts = ["free money now", "meeting at 3pm tomorrow", "win a free prize", "quarterly report attached"]
labels = [1, 0, 1, 0]  # 1 = spam
vec = CountVectorizer()
spam_clf = MultinomialNB().fit(vec.fit_transform(texts), labels)
print("spam check:", spam_clf.predict(vec.transform(["free prize waiting"]))[0])`,
          explanation:
            'The SVM pipeline scales first — margin methods are meaningless on raw scales. probability=True adds calibrated probabilities via cross-validation (it costs training time). The spam example shows Naive Bayes\' natural habitat: word counts in, fast classification out.',
        },
        mistakes: [
          'Using an SVM without scaling — the margin is dominated by the largest-scale feature.',
          'Using an SVM on very large data and waiting forever. SVMs scale poorly (roughly O(n²) to O(n³)).',
          'Treating Naive Bayes\' independence assumption as a fatal flaw. It is often wrong yet harmless for ranking and classification.',
          'Forgetting Laplace smoothing: an unseen word with zero probability zeroes the whole product in Naive Bayes.',
          'Tuning C and gamma by gut feel. They interact strongly — use a grid search.',
        ],
        whenToUse: [
          'SVM: small-to-medium, high-dimensional, clean data (images, text embeddings) where margin matters.',
          'Naive Bayes: text classification, spam filtering, fast baselines, very little data.',
        ],
        whenNotToUse: [
          'SVM: large datasets, or when you need probabilities or interpretability out of the box.',
          'Naive Bayes: strongly correlated features where the independence assumption badly distorts probabilities.',
        ],
        comparison: [
          { label: 'SVM vs Logistic regression', text: 'Both find linear boundaries (without kernels); SVM maximises the margin, logistic regression maximises likelihood and gives probabilities naturally.' },
          { label: 'Naive Bayes vs Logistic regression', text: 'Naive Bayes trains in one counting pass and works with tiny data; logistic regression usually wins on accuracy when data is plentiful.' },
          { label: 'SVM vs KNN', text: 'Both are distance-sensitive and need scaling; SVM learns a compact boundary (only support vectors matter), KNN stores everything.' },
        ],
        keyPoints: [
          'SVM maximises the margin; support vectors are the points nearest the boundary.',
          'C trades margin width vs misclassifications; RBF kernel handles non-linearity.',
          'Naive Bayes: Bayes\' theorem + feature independence assumption.',
          'Both need care: SVM needs scaling and is slow on big data; NB needs smoothing.',
          'Naive Bayes is the classic fast baseline for text classification.',
        ],
        formulas: [
          { name: 'SVM margin', formula: 'maximise 2 / ||w||, subject to y_i(w·x_i + b) >= 1' },
          { name: 'RBF kernel', formula: 'K(x, z) = exp(−γ * ||x − z||^2)' },
          { name: 'Naive Bayes', formula: 'P(y|x) ∝ P(y) * Π P(x_i|y)' },
        ],
        questionIds: ['q-m6-svm-nb-1', 'q-m6-svm-nb-2', 'q-m6-svm-nb-3'],
        skills: ['Algorithms', 'Model Selection'],
      },
    ],
  },

  // ─── Module 7 — Model Evaluation ─────────────────────────────────────────
  {
    id: 'm7',
    number: 7,
    title: 'Model Evaluation',
    shortTitle: 'Evaluation',
    description:
      'How to tell whether a model is actually good: the confusion matrix, precision, recall and F1, ROC curves and AUC, and — most importantly — how to choose the metric that matches the business problem instead of the one that looks biggest.',
    icon: 'table',
    skills: ['Evaluation'],
    lessons: [
      {
        id: 'm7-classification-metrics',
        moduleId: 'm7',
        title: 'Precision, Recall, F1 & the Confusion Matrix',
        subtitle: 'Accuracy lies; the confusion matrix tells the truth',
        minutes: 22,
        simple:
          'A confusion matrix counts four outcomes: true positives (correctly flagged), false positives (wrongly flagged), false negatives (missed), and true negatives (correctly cleared). Precision asks: of everything we flagged, how much was real? Recall asks: of everything real, how much did we catch? F1 is the balanced blend of the two. Accuracy — the fraction of all predictions that were right — is dangerously misleading when classes are imbalanced.',
        technical:
          'From the confusion matrix: TP, FP, FN, TN. Precision = TP / (TP + FP) — the fraction of positive predictions that were correct. Recall (sensitivity, true positive rate) = TP / (TP + FN) — the fraction of actual positives caught. F1 = 2·(Precision·Recall) / (Precision + Recall), the harmonic mean — it punishes a model that is good at one and terrible at the other. Accuracy = (TP + TN) / total. Specificity = TN / (TN + FP). In imbalanced data, accuracy is dominated by the majority class: a fraud model that predicts "never fraud" scores 99.9% accuracy and catches nothing. Precision and recall trade off against each other as the classification threshold moves: lowering the threshold raises recall and lowers precision. For multi-class problems, metrics are averaged — macro (unweighted mean across classes), weighted (by class support), or micro (global counts). sklearn\'s classification_report gives all of these per class.',
        interview:
          'I start from the confusion matrix: true positives, false positives, false negatives, true negatives. Precision is the fraction of my positive predictions that were actually correct — it answers "when I flag something, how often am I right?" Recall is the fraction of real positives I caught — "of all the actual cases, how many did I find?" F1 is the harmonic mean of the two, useful when I need a balance. Accuracy is misleading on imbalanced data — a model that always predicts "no fraud" is 99.9 percent accurate and completely useless. Which metric I optimise depends on the cost: in fraud detection I want high recall because a missed fraud is expensive; in a retention campaign I want high precision because each outreach costs money.',
        analogy:
          'Precision and recall are like a fishing net. Precision: of everything in your net, how much is actually fish? (A net full of boots has low precision.) Recall: of all the fish in the lake, how many did your net catch? A fine-meshed net catches everything including boots — high recall, low precision. A net with huge holes catches only the biggest fish — high precision, low recall. F1 asks whether the net is good at both.',
        realWorld:
          'A bank\'s fraud model flags 1,000 transactions a day, of which 200 are real fraud (precision 20%) — but it catches 200 of the 250 real frauds (recall 80%). The team accepts low precision because each missed fraud costs far more than a false alarm, which just triggers a quick SMS check. In contrast, a loan-approval model optimises precision: approving a defaulter is expensive, so the team wants every approval to be safe, even if it means rejecting some good applicants (lower recall). A churn-retention campaign optimises precision too: each retention call costs money, so the team only calls customers the model is confident about.',
        math: 'Precision = TP / (TP + FP). Recall = TP / (TP + FN). F1 = 2 * (Precision * Recall) / (Precision + Recall). Accuracy = (TP + TN) / (TP + TN + FP + FN). Specificity = TN / (TN + FP).',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (confusion_matrix, classification_report,
                             precision_score, recall_score, f1_score,
                             ConfusionMatrixDisplay)
import matplotlib.pyplot as plt

df = pd.read_csv("transactions.csv")
X = df[["amount", "hour", "velocity_1h", "device_age_days"]]
y = df["is_fraud"]  # only ~0.5% fraud — heavily imbalanced
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

model = LogisticRegression(max_iter=1000, class_weight="balanced").fit(X_train, y_train)
pred = model.predict(X_test)

# The "always predict not-fraud" baseline: accuracy looks amazing, recall is 0
print("dumb baseline accuracy:", (y_test == 0).mean().round(4))

print(classification_report(y_test, pred, target_names=["legit", "fraud"]))
print("precision:", round(precision_score(y_test, pred), 3))
print("recall:   ", round(recall_score(y_test, pred), 3))
print("F1:       ", round(f1_score(y_test, pred), 3))

# Visual: the confusion matrix itself
ConfusionMatrixDisplay.from_predictions(y_test, pred, display_labels=["legit", "fraud"])
plt.title("Confusion matrix — fraud detection")
plt.show()

# Threshold tuning: lower the threshold, recall rises, precision falls
proba = model.predict_proba(X_test)[:, 1]
for t in [0.3, 0.5, 0.7]:
    p = (proba >= t).astype(int)
    print(f"threshold {t}: precision={precision_score(y_test, p):.3f}  "
          f"recall={recall_score(y_test, p):.3f}")`,
          explanation:
            'The dumb baseline is the wake-up call: 99.5% accuracy for a model that catches zero fraud. classification_report shows precision/recall/F1 per class — always read the minority class row. The threshold loop shows the trade-off in action: you choose the operating point, the model just ranks.',
        },
        mistakes: [
          'Reporting accuracy on imbalanced data. It is the most common evaluation mistake in ML.',
          'Optimising F1 when the business clearly cares more about one side — use the metric that matches the cost.',
          'Reading only the overall numbers in classification_report and missing that the minority class has terrible recall.',
          'Forgetting that precision and recall are threshold-dependent — they describe one operating point, not the model.',
          'Comparing precision across models evaluated at different thresholds.',
        ],
        whenToUse: [
          'Precision when false positives are expensive (retention calls, loan approvals, medical follow-ups).',
          'Recall when false negatives are expensive (fraud, disease screening, churn rescue).',
          'F1 when you need a single balanced number and both error types matter.',
        ],
        comparison: [
          { label: 'Precision vs Recall', text: 'Precision: "when I flag it, am I right?" Recall: "of the real cases, how many did I find?" They trade off as the threshold moves.' },
          { label: 'F1 vs Accuracy', text: 'F1 balances precision and recall and ignores true negatives; accuracy counts all correct predictions and is dominated by the majority class.' },
          { label: 'Macro vs Weighted average', text: 'Macro averages classes equally (rare classes count as much as common ones); weighted averages by class size. Macro exposes weak minority-class performance.' },
        ],
        keyPoints: [
          'Confusion matrix: TP, FP, FN, TN — everything else is derived from these.',
          'Precision = TP/(TP+FP). Recall = TP/(TP+FN). F1 = harmonic mean of the two.',
          'Accuracy is misleading on imbalanced data — a "predict never" model can score 99%.',
          'Precision and recall trade off as the threshold moves.',
          'Choose the metric by business cost, not by which number looks biggest.',
        ],
        formulas: [
          { name: 'Precision', formula: 'Precision = TP / (TP + FP)' },
          { name: 'Recall', formula: 'Recall = TP / (TP + FN)' },
          { name: 'F1 score', formula: 'F1 = 2 * (Precision * Recall) / (Precision + Recall)' },
          { name: 'Accuracy', formula: 'Accuracy = (TP + TN) / (TP + TN + FP + FN)' },
          { name: 'Specificity', formula: 'Specificity = TN / (TN + FP)' },
        ],
        visual: 'confusion-matrix',
        questionIds: ['q-m7-classification-metrics-1', 'q-m7-classification-metrics-2', 'q-m7-classification-metrics-3'],
        skills: ['Evaluation'],
      },
      {
        id: 'm7-roc-auc',
        moduleId: 'm7',
        title: 'ROC Curves & AUC',
        subtitle: 'Judging the ranking, not just one threshold',
        minutes: 20,
        simple:
          'A ROC curve shows a classifier\'s trade-off between catching positives and raising false alarms, across every possible threshold. The x-axis is the false positive rate; the y-axis is the true positive rate (recall). AUC — the area under that curve — is a single number from 0.5 (random guessing) to 1.0 (perfect): it measures how well the model ranks positives above negatives, regardless of threshold.',
        technical:
          'The ROC curve plots TPR (recall) against FPR (1 − specificity) as the decision threshold sweeps from 1 down to 0. AUC is the area under this curve; equivalently, it is the probability that a randomly chosen positive example is ranked above a randomly chosen negative one. AUC = 0.5 means no discrimination; AUC = 1.0 means perfect separation; below 0.5 means the model is worse than random (invert its predictions). AUC is threshold-independent, which makes it excellent for comparing models — but it can be misleading on heavily imbalanced data, where a huge number of true negatives keeps FPR low even while precision is terrible. For imbalanced problems, the Precision–Recall curve and average precision (AP) are more informative, because they ignore true negatives entirely. In sklearn: roc_curve, roc_auc_score, average_precision_score, PrecisionRecallDisplay. A good workflow reports both ROC-AUC and PR-AUC for imbalanced problems.',
        interview:
          'The ROC curve plots the true positive rate against the false positive rate across all thresholds, and AUC is the area under it. I interpret AUC as the probability that the model ranks a random positive above a random negative — 0.5 is random, 1.0 is perfect. It is threshold-independent, which makes it great for comparing models. But on heavily imbalanced data like fraud, I also look at the precision–recall curve, because ROC can look good even when precision is poor — there are so many true negatives that the false positive rate stays low.',
        analogy:
          'ROC-AUC is like judging a talent scout, not by one yes/no decision, but by their whole ranked list: if you pick a random future star and a random flop from their list, how often is the star ranked higher? A perfect scout ranks every star above every flop (AUC 1.0). A scout who ranks randomly gets 0.5. The threshold — where you draw the "hire" line — is a separate business decision.',
        realWorld:
          'Two churn models both score 0.82 accuracy, but Model A has ROC-AUC 0.91 and Model B has 0.78. Model A ranks churners much better — the retention team can take its top 10% riskiest customers and find most of the real churners there. But on a fraud dataset with 0.1% fraud, a model with ROC-AUC 0.95 still has precision of only 8% at the operating threshold: the ROC curve hides the problem because millions of true negatives keep the false positive rate tiny. The team switches to the precision–recall curve, where the weakness is obvious, and reports average precision alongside AUC.',
        math: 'TPR (recall) = TP / (TP + FN). FPR = FP / (FP + TN) = 1 − specificity. AUC = P(score(positive) > score(negative)) for random positive/negative pairs.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (roc_curve, roc_auc_score, average_precision_score,
                             RocCurveDisplay, PrecisionRecallDisplay)
import matplotlib.pyplot as plt

df = pd.read_csv("transactions.csv")
X = df[["amount", "hour", "velocity_1h", "device_age_days"]]
y = df["is_fraud"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

models = {
    "logistic": LogisticRegression(max_iter=1000, class_weight="balanced"),
    "forest": RandomForestClassifier(n_estimators=200, n_jobs=-1, random_state=42),
}
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
for name, m in models.items():
    m.fit(X_train, y_train)
    proba = m.predict_proba(X_test)[:, 1]
    print(f"{name:9s} ROC-AUC={roc_auc_score(y_test, proba):.3f}  "
          f"avg precision={average_precision_score(y_test, proba):.3f}")
    RocCurveDisplay.from_predictions(y_test, proba, name=name, ax=axes[0])
    PrecisionRecallDisplay.from_predictions(y_test, proba, name=name, ax=axes[1])
axes[0].set_title("ROC curve (threshold-free ranking)")
axes[1].set_title("Precision-Recall curve (better for imbalanced data)")
plt.tight_layout(); plt.show()`,
          explanation:
            'Two models, two curves, one lesson: ROC-AUC compares ranking quality, while the precision–recall curve shows what happens to precision when positives are rare. On imbalanced data, always look at both — a model can have a great ROC curve and a poor PR curve.',
        },
        mistakes: [
          'Reporting ROC-AUC alone on heavily imbalanced data — it hides terrible precision.',
          'Thinking AUC 0.9 means "90% accurate". AUC is a ranking probability, not accuracy.',
          'Comparing AUCs of models evaluated on different test sets.',
          'Forgetting that AUC is threshold-independent — you still need to pick an operating threshold for production.',
          'Using ROC-AUC for multi-class problems without specifying the averaging (one-vs-rest).',
        ],
        whenToUse: [
          'Comparing classifiers\' ranking quality independent of threshold.',
          'Balanced or moderately imbalanced classification.',
          'When the business will choose the threshold later (e.g. take the top 5% riskiest).',
        ],
        whenNotToUse: [
          'Heavily imbalanced data without also reporting PR-AUC / average precision.',
          'When the business needs a single operating point — then precision/recall at that threshold matter more.',
        ],
        comparison: [
          { label: 'ROC-AUC vs PR-AUC', text: 'ROC uses FPR (needs true negatives); PR uses precision (ignores true negatives). On imbalanced data, PR-AUC is more honest.' },
          { label: 'AUC vs Accuracy', text: 'AUC measures ranking across all thresholds; accuracy measures one threshold\'s hit rate and is dominated by the majority class.' },
          { label: 'AUC vs F1', text: 'F1 is a single-threshold balance of precision and recall; AUC summarises all thresholds. Use AUC to compare models, F1 to describe an operating point.' },
        ],
        keyPoints: [
          'ROC plots TPR vs FPR across all thresholds; AUC is the area under it.',
          'AUC = P(a random positive is ranked above a random negative). 0.5 = random, 1.0 = perfect.',
          'AUC is threshold-independent — great for comparing models.',
          'On imbalanced data, ROC can flatter a model: also report PR-AUC.',
          'You still need to choose a production threshold after comparing AUCs.',
        ],
        formulas: [
          { name: 'True positive rate', formula: 'TPR = TP / (TP + FN)' },
          { name: 'False positive rate', formula: 'FPR = FP / (FP + TN)' },
          { name: 'AUC interpretation', formula: 'AUC = P(score(pos) > score(neg))' },
        ],
        visual: 'roc',
        questionIds: ['q-m7-roc-auc-1', 'q-m7-roc-auc-2', 'q-m7-roc-auc-3'],
        skills: ['Evaluation'],
      },
      {
        id: 'm7-metric-selection',
        moduleId: 'm7',
        title: 'Choosing Metrics for the Business Problem',
        subtitle: 'The right metric is a business decision, not a maths default',
        minutes: 14,
        simple:
          'Every metric encodes a judgement about which mistake matters. Accuracy says all mistakes are equal. Precision says false alarms are expensive. Recall says missed cases are expensive. RMSE says big errors matter more than small ones. MAE says all errors matter equally. Choosing a metric means asking the business: what does each kind of error cost, in rupees, time, or trust?',
        technical:
          'Metric selection maps business costs to mathematics. Classification: accuracy (balanced classes, equal costs), precision (costly false positives), recall (costly false negatives), F1/F-beta (weighted balance — F2 weights recall twice as much as precision), ROC-AUC (ranking quality, threshold-free), PR-AUC (imbalanced ranking). Regression: MAE (robust, in original units, equal weight per error), RMSE (penalises large errors quadratically — use when big misses are disproportionately bad), MAPE (percentage errors — intuitive but breaks near zero and is asymmetric), R² (variance explained — useful for communication, weak for model selection). Beyond metrics: define a business KPI (revenue saved, fraud losses prevented, retention cost) and translate model performance into it — "this model catches 80% of churners, worth roughly ₹X per month in retained revenue" beats "F1 = 0.71" in any stakeholder meeting. Also track the metric on slices (by segment, region, time) — a good global score can hide a failing segment.',
        interview:
          'I choose the metric from the business cost of each error, not from habit. For fraud, a missed fraud is far more expensive than a false alarm, so I optimise recall and watch precision–recall curves. For a retention campaign, each outreach costs money, so precision matters more. For regression, I use MAE when I want a typical error in rupees, and RMSE when large errors are disproportionately bad. And I always translate the metric into business terms — how much fraud loss prevented, how much revenue retained — because that is what stakeholders decide on.',
        analogy:
          'Choosing a metric is like choosing a scoreboard for a game. If you score a football match by "most passes", teams will pass sideways forever. The metric shapes behaviour — so pick the one that rewards what the business actually wants. Accuracy on a fraud problem is a scoreboard that rewards doing nothing.',
        realWorld:
          'A telecom retention team first optimised accuracy and got 91% — by predicting almost nobody churns. Useless. They switched to recall at a fixed precision floor: "catch as many churners as possible while keeping at least 40% of our calls to real churners", because each call costs ₹150 and each saved customer is worth ₹4,000 a year. The model\'s value was then reported as expected retained revenue per month, not as F1. In a demand-forecasting project, the team chose RMSE over MAE because a single huge stockout costs more than many small over-stocks — the metric matched the warehouse\'s real pain.',
        mistakes: [
          'Defaulting to accuracy for every classification problem.',
          'Optimising a metric the business does not care about, then wondering why nobody uses the model.',
          'Using MAPE on data with near-zero actuals — it explodes or is undefined.',
          'Reporting a single global metric and missing that the model fails on one segment (e.g. rural customers).',
          'Chasing a metric improvement that is statistically meaningless — a 0.001 AUC gain on a small test set is noise.',
        ],
        keyPoints: [
          'Every metric encodes a judgement about which error costs more.',
          'Accuracy = equal costs. Precision = false alarms cost. Recall = misses cost.',
          'MAE = typical error in units. RMSE = big errors punished more.',
          'Translate metrics into business value: rupees saved, losses prevented.',
          'Check metrics on slices — global scores hide segment failures.',
        ],
        comparison: [
          { label: 'MAE vs RMSE', text: 'MAE is robust and in original units; RMSE penalises large errors quadratically. Use RMSE when big misses are disproportionately costly.' },
          { label: 'F1 vs F-beta', text: 'F1 weights precision and recall equally; F2 weights recall twice as much, F0.5 weights precision twice as much — pick the beta that matches the cost ratio.' },
          { label: 'Metric vs Business KPI', text: 'The metric guides model selection; the business KPI (revenue retained, fraud loss prevented) justifies the project. Report both.' },
        ],
        questionIds: ['q-m7-metric-selection-1', 'q-m7-metric-selection-2', 'q-m7-metric-selection-3'],
        skills: ['Evaluation', 'Problem Solving'],
      },
    ],
  },

  // ─── Module 8 — Validation & Model Selection ─────────────────────────────
  {
    id: 'm8',
    number: 8,
    title: 'Validation & Model Selection',
    shortTitle: 'Validation',
    description:
      'Trustworthy evaluation: cross-validation for honest scores on small data, systematic hyperparameter tuning instead of guesswork, and baselines — the simple models every serious model must beat before it earns its place.',
    icon: 'sliders',
    skills: ['Model Selection', 'Evaluation'],
    lessons: [
      {
        id: 'm8-cross-validation',
        moduleId: 'm8',
        title: 'Cross-Validation',
        subtitle: 'Every row gets a turn as the test set',
        minutes: 20,
        simple:
          'Cross-validation splits the data into K folds, trains on K−1 folds and tests on the remaining one, then rotates so every fold is the test set once. You get K scores instead of one, so you can see both the average performance and how much it varies. It is the standard way to evaluate a model honestly when you cannot afford a large separate test set — and the standard way to choose hyperparameters.',
        technical:
          'In K-fold cross-validation, the data is partitioned into K equal folds (typically 5 or 10). For each fold i, the model trains on the other K−1 folds and is evaluated on fold i. The mean score estimates generalisation; the standard deviation estimates its stability. StratifiedKFold preserves the class ratio in each fold — essential for imbalanced classification. Variants: Leave-One-Out (K = n, expensive but nearly unbiased), GroupKFold (groups like customers stay intact across folds), TimeSeriesSplit (expanding window, no shuffling — validation always follows training in time), RepeatedKFold (repeats the split with different shuffles for tighter estimates). Critical rule: all preprocessing must happen inside each fold — use a Pipeline, or the preprocessing fitted on the full data leaks into every fold. Nested CV (an outer loop for evaluation, an inner loop for tuning) is the rigorous way to report a tuned model\'s performance; tuning on the same CV you report from is optimistically biased.',
        interview:
          'Cross-validation splits the data into K folds, trains on K minus one and tests on the held-out fold, rotating until every fold has been the test set. I get K scores, so I know both the average performance and how stable it is. I use stratified folds for classification so each fold keeps the class balance. The key discipline is that all preprocessing happens inside each fold — I use a Pipeline for that — otherwise the scores are optimistically biased. For time-series data I use TimeSeriesSplit, because random folds would leak the future into training.',
        analogy:
          'A single train-test split is like judging a cricketer from one innings — they might have had a lucky day. Cross-validation is judging them across a whole season: every innings counts, and you see both the average and the consistency. A player who averages 50 with scores of 45–55 is more trustworthy than one who averages 50 with scores of 0 and 100.',
        realWorld:
          'A churn model scored 0.86 on a single test split — but 5-fold cross-validation gave scores of 0.78, 0.81, 0.85, 0.88 and 0.91. The mean was 0.85, but the spread warned the team the model was unstable: its performance depended heavily on which customers landed in the test fold. They collected more data and simplified the model, and the spread narrowed to 0.83–0.87. In a time-series sales model, the team caught a subtler error: random K-fold CV scored 0.92, but TimeSeriesSplit scored 0.74 — the random folds had been leaking future months into training.',
        code: {
          code: `import pandas as pd
import numpy as np
from sklearn.model_selection import (cross_val_score, StratifiedKFold,
                                     TimeSeriesSplit, GroupKFold)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

df = pd.read_csv("customers.csv")
X = df[["age", "monthly_spend", "tenure_months", "support_tickets"]]
y = df["churned"]

# The Pipeline is what makes CV honest: scaling is refit inside every fold
pipe = Pipeline([
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])

# Stratified 5-fold: each fold keeps the churn ratio
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc")
print("fold AUCs:", scores.round(3))
print(f"mean AUC = {scores.mean():.3f}  (+/- {scores.std():.3f})")

# Time-ordered data: expanding window, no shuffling
tscv = TimeSeriesSplit(n_splits=5)
ts_scores = cross_val_score(pipe, X, y, cv=tscv, scoring="roc_auc")
print("time-series CV AUCs:", ts_scores.round(3))

# Grouped data (same customer, many rows): keep each customer in one fold
gkf = GroupKFold(n_splits=5)
g_scores = cross_val_score(pipe, X, y, cv=gkf, groups=df["customer_id"],
                           scoring="roc_auc")
print("group CV AUCs:", g_scores.round(3))`,
          explanation:
            'Three splitters for three situations — stratified for classification, time-series for ordered data, group for repeated entities. The mean tells you expected performance; the standard deviation tells you how much to trust it. And the Pipeline is doing quiet, essential work: without it, the scaler would be fitted on the full data and every fold score would be slightly optimistic.',
        },
        mistakes: [
          'Preprocessing before cross-validation instead of inside a Pipeline — leakage into every fold.',
          'Using plain KFold on imbalanced classification — some folds can end up with almost no minority-class rows.',
          'Using random folds on time-series data — future leaks into training.',
          'Tuning hyperparameters on the same CV scores you report. The reported score is then optimistically biased; use nested CV for an honest number.',
          'Reporting only the mean CV score and ignoring the spread. A mean of 0.85 with a std of 0.08 is a different story from a std of 0.01.',
        ],
        whenToUse: [
          'Always, for model evaluation and hyperparameter tuning on small-to-medium data.',
          'StratifiedKFold for classification, especially imbalanced.',
          'TimeSeriesSplit for time-ordered data; GroupKFold for grouped rows.',
        ],
        whenNotToUse: [
          'Very large datasets where a single holdout is stable enough and CV is too slow.',
          'When the deployment distribution is specifically "the future" — a chronological holdout is more honest than random folds.',
        ],
        comparison: [
          { label: 'CV vs Single split', text: 'CV uses all data for both training and testing (across folds) and reports stability; a single split is faster but noisier and wastes data.' },
          { label: 'Stratified vs Plain KFold', text: 'Stratified preserves class ratios per fold; plain KFold can produce folds missing the minority class entirely.' },
          { label: 'Nested vs Flat CV', text: 'Flat CV tunes and evaluates on the same folds (optimistic); nested CV has an inner loop for tuning and an outer loop for honest evaluation.' },
        ],
        keyPoints: [
          'K-fold CV: train on K−1 folds, test on the held-out one, rotate.',
          'Report mean and standard deviation — stability matters as much as the average.',
          'Preprocessing must happen inside each fold (use a Pipeline).',
          'Stratified folds for classification; time-based splits for time data; group folds for grouped rows.',
          'Tuning on the CV you report from is biased — nested CV is the rigorous fix.',
        ],
        questionIds: ['q-m8-cross-validation-1', 'q-m8-cross-validation-2', 'q-m8-cross-validation-3'],
        skills: ['Model Selection', 'Evaluation'],
      },
      {
        id: 'm8-hyperparameter-tuning',
        moduleId: 'm8',
        title: 'Grid Search, Random Search & Tuning',
        subtitle: 'Systematic search beats gut feel — and random often beats grid',
        minutes: 18,
        simple:
          'Hyperparameters are the settings you choose before training: tree depth, K in KNN, the learning rate, the regularisation strength. Tuning means searching for the combination that scores best on cross-validation. Grid search tries every combination in a list you define. Random search samples combinations at random — and usually finds equally good settings much faster, because most hyperparameters barely matter and a few matter a lot.',
        technical:
          'GridSearchCV exhaustively evaluates every combination in a parameter grid, scoring each with cross-validation — thorough but exponential in the number of parameters. RandomizedSearchCV samples n_iter combinations from distributions you specify, which explores more distinct values of the important parameters for the same budget — Bergstra & Bengio (2012) showed it is usually more efficient than grid search. Both refit the best model on the full training data (refit=True) and expose best_params_ and cv_results_ for analysis. Modern alternatives: Bayesian optimisation (Optuna, scikit-optimize) builds a probabilistic model of the score surface and samples where improvement is most likely — usually the best use of a large tuning budget. Practical rules: tune on cross-validation, never on the test set; tune the few parameters that matter most first (learning rate and depth for boosting, C and gamma for SVM, alpha for regularisation); use log-spaced values for scale parameters like C and alpha; and remember that tuning has diminishing returns — a 0.002 gain is usually noise.',
        interview:
          'I tune hyperparameters with cross-validation, never on the test set. For a small search space I use grid search; for larger spaces I prefer random search, because it explores more distinct values of the parameters that actually matter for the same budget. For expensive models I use Bayesian optimisation with Optuna. I tune the high-impact parameters first — learning rate and depth for boosting, C for SVM — using log-spaced values for scale parameters like regularisation strength. And I stop when the gains are within noise; chasing the last thousandth of AUC is overfitting to the validation set.',
        analogy:
          'Tuning is like finding the best coffee recipe. Grid search tries every combination of grind, temperature and dose on a fixed list — thorough, slow. Random search picks random recipes — and because only two of the five variables really matter, random sampling tries many more values of those two. Bayesian optimisation is the experienced barista who learns from each cup and narrows in on the good region.',
        realWorld:
          'A team tuning XGBoost ran a grid search over 5 values each of learning rate, depth, subsample and colsample — 625 combinations × 5 folds = 3,125 model fits, taking a day. Random search with 60 sampled combinations found the same optimum in under two hours. The team then switched to Optuna for the final polish and gained another 0.004 AUC — small, but worth it on a model scoring millions of transactions. The lesson they documented: tune the learning rate first (it interacts with everything), then depth, then the sampling parameters.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from scipy.stats import randint, uniform

df = pd.read_csv("customers.csv")
X = df[["age", "monthly_spend", "tenure_months", "support_tickets"]]
y = df["churned"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

# Grid search: exhaustive, small space
grid = GridSearchCV(
    RandomForestClassifier(random_state=42, n_jobs=-1),
    param_grid={"n_estimators": [200, 400], "max_depth": [None, 8, 16],
                "min_samples_leaf": [1, 5]},
    cv=5, scoring="roc_auc")
grid.fit(X_train, y_train)
print("grid best:", grid.best_params_, "CV AUC:", round(grid.best_score_, 3))

# Random search: samples from distributions — better for large spaces
random = RandomizedSearchCV(
    RandomForestClassifier(random_state=42, n_jobs=-1),
    param_distributions={
        "n_estimators": randint(100, 600),
        "max_depth": [None, *range(4, 25)],
        "min_samples_leaf": randint(1, 10),
        "max_features": uniform(0.3, 0.7),
    },
    n_iter=30, cv=5, scoring="roc_auc", random_state=42)
random.fit(X_train, y_train)
print("random best:", random.best_params_, "CV AUC:", round(random.best_score_, 3))

# Final check on the untouched test set — only once
print("test AUC:", round(random.score(X_test, y_test), 3))`,
          explanation:
            'Note the discipline: tuning happens on X_train via cross-validation, and the test set is touched exactly once at the end. RandomizedSearchCV samples from distributions (randint, uniform), so it tries many distinct values of each parameter — the reason it usually beats a coarse grid for the same budget.',
        },
        mistakes: [
          'Tuning on the test set. The test score then reflects the tuning, not the model.',
          'Grid-searching a huge space exhaustively and waiting days. Random search or Bayesian optimisation is the right tool for large spaces.',
          'Tuning every parameter at once. Tune the high-impact ones first; most parameters barely move the score.',
          'Using linearly-spaced values for scale parameters like C or alpha. Use log spacing (0.001, 0.01, 0.1, 1, 10).',
          'Treating a tiny CV improvement as real. Differences smaller than the CV standard deviation are noise.',
        ],
        whenToUse: [
          'Grid search: small, discrete search spaces (a handful of combinations).',
          'Random search: larger spaces, or when you are unsure which parameters matter.',
          'Bayesian optimisation (Optuna): expensive models and large tuning budgets.',
        ],
        comparison: [
          { label: 'Grid vs Random', text: 'Grid is exhaustive but exponential; random samples more distinct values of the important parameters for the same budget and usually finds equal optima faster.' },
          { label: 'Random vs Bayesian', text: 'Bayesian optimisation learns from past trials and focuses the search; random search is simpler and embarrassingly parallel.' },
        ],
        keyPoints: [
          'Hyperparameters are set before training; tune them by cross-validation.',
          'Grid search is exhaustive; random search is usually more efficient.',
          'Bayesian optimisation (Optuna) is best for expensive models.',
          'Tune high-impact parameters first; use log-spaced values for scale parameters.',
          'Never tune on the test set; ignore gains smaller than the CV noise.',
        ],
        questionIds: ['q-m8-hyperparameter-tuning-1', 'q-m8-hyperparameter-tuning-2', 'q-m8-hyperparameter-tuning-3'],
        skills: ['Model Selection', 'Evaluation'],
      },
      {
        id: 'm8-model-comparison',
        moduleId: 'm8',
        title: 'Baselines & Model Comparison',
        subtitle: 'A model is only good relative to something simpler',
        minutes: 14,
        simple:
          'A baseline is the simplest model that could solve the problem: predict the majority class, predict the mean, or a plain logistic regression. Every serious model must beat the baseline by a meaningful margin, or it is not worth its complexity. Comparing models fairly means evaluating them on the same folds, with the same metric, and checking whether the difference is bigger than the noise.',
        technical:
          'Baselines come in layers: (1) trivial — majority class / mean (DummyClassifier/DummyRegressor); (2) simple interpretable — logistic/linear regression; (3) strong default — random forest. A model earns its complexity only by beating the layer below it by a margin that matters to the business. Fair comparison requires identical evaluation: same CV splits (same random_state), same metric, same preprocessing inside pipelines. Compare mean scores with their standard deviations; a difference smaller than the CV std is not evidence. For a rigorous comparison, use a paired test on per-fold scores (e.g. a paired t-test or Wilcoxon) — though with 5 folds the power is low, so treat small differences as ties. Also compare on dimensions beyond accuracy: training/prediction time, interpretability, robustness, and maintenance cost. The best model is the simplest one that meets the business bar.',
        interview:
          'I always start with baselines: a dummy model that predicts the majority class or the mean, then logistic or linear regression, then a random forest. A complex model has to beat those by a margin that matters before it is worth the complexity. I compare models on the same cross-validation folds with the same metric, and I check whether the difference is bigger than the cross-validation noise — a 0.002 AUC gap on five folds is not a real win. And I compare on more than accuracy: training time, prediction latency, interpretability, and maintenance cost all matter.',
        analogy:
          'Baselines are the "control group" of modelling. A new medicine is only approved if it beats a placebo — not if it merely works. A fancy model is only worth deploying if it beats the simple alternative by enough to justify its cost. Otherwise you are paying for complexity and getting nothing.',
        realWorld:
          'A retailer\'s demand-forecasting team built an XGBoost model with RMSE ₹1.2 lakh. Impressive — until the baseline (predict last month\'s sales for each store) scored ₹1.25 lakh. The complex model bought almost nothing, but cost a retraining pipeline and monitoring. The team shipped the simple baseline plus a seasonal adjustment instead, and spent the saved effort on better features. In another project, a churn model beat logistic regression by 0.03 AUC — a real, repeatable gain worth ₹40 lakh a year in retained revenue — so the forest shipped. The baseline is what makes the decision possible.',
        code: {
          code: `import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("customers.csv")
X = df[["age", "monthly_spend", "tenure_months", "support_tickets"]]
y = df["churned"]
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)  # SAME folds for all

models = {
    "dummy (majority)": DummyClassifier(strategy="most_frequent"),
    "logistic": Pipeline([("s", StandardScaler()),
                          ("m", LogisticRegression(max_iter=1000))]),
    "random forest": RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42),
}
results = {}
for name, m in models.items():
    scores = cross_val_score(m, X, y, cv=cv, scoring="roc_auc")
    results[name] = scores
    print(f"{name:18s} AUC = {scores.mean():.3f} (+/- {scores.std():.3f})")

# Is the forest really better than logistic? Paired comparison on the same folds.
diff = results["random forest"] - results["logistic"]
print(f"forest - logistic per fold: {diff.round(3)}")
print(f"mean difference: {diff.mean():.3f} — real only if clearly above the noise")`,
          explanation:
            'The same cv object for every model is the fairness guarantee: identical folds, identical metric. The per-fold differences are more informative than the means alone — if the forest beats logistic on all five folds, that is a consistent win; if it wins on three and loses on two, it is a tie.',
        },
        mistakes: [
          'Skipping baselines and presenting a complex model\'s score in a vacuum.',
          'Comparing models evaluated on different splits or different metrics.',
          'Declaring a winner from a difference smaller than the CV noise.',
          'Comparing only accuracy and ignoring latency, interpretability and maintenance.',
          'Letting a complex model win on the test set by a hair and shipping it — a tie should go to the simpler model.',
        ],
        keyPoints: [
          'Baselines: dummy → simple interpretable → strong default (random forest).',
          'A model must beat the layer below it by a meaningful margin.',
          'Compare on identical folds, identical metric, identical preprocessing.',
          'A difference smaller than CV noise is not a win.',
          'In a tie, ship the simpler model.',
        ],
        questionIds: ['q-m8-model-comparison-1', 'q-m8-model-comparison-2', 'q-m8-model-comparison-3'],
        skills: ['Model Selection', 'Evaluation'],
      },
    ],
  },

  // ─── Module 9 — Feature Engineering ──────────────────────────────────────
  {
    id: 'm9',
    number: 9,
    title: 'Feature Engineering',
    shortTitle: 'Feature Engineering',
    description:
      'The highest-leverage skill in applied ML: creating features that carry signal. Transforms and binning for numbers, smart handling of categories and dates, and selecting the features that earn their place — then knowing when to reduce dimensions.',
    icon: 'sparkles',
    skills: ['Feature Engineering'],
    lessons: [
      {
        id: 'm9-numerical-features',
        moduleId: 'm9',
        title: 'Numerical Features: Transforms & Binning',
        subtitle: 'Reshaping numbers so models can use them',
        minutes: 16,
        simple:
          'Raw numbers are not always model-ready. Skewed distributions (like income) compress most values into a small range — a log transform spreads them out. Ratios and differences often carry more signal than raw values: "spend per visit" beats "total spend" for comparing customers. Binning turns a continuous number into bands ("0–6 months", "6–12 months") when the business thinks in bands, or when the relationship is non-linear.',
        technical:
          'Common transforms: log (log1p for data containing zeros) for right-skewed positive data — it stabilises variance and linearises multiplicative relationships; square root for milder skew; Box-Cox/Yeo-Johnson (PowerTransformer) for automatic skew correction. Ratios and differences encode domain knowledge: debt-to-income ratio, spend per order, days since last activity. Binning (pd.cut for equal-width, pd.qcut for equal-frequency) converts continuous features into ordinal bands — useful for non-linear effects and for models that prefer categories, but it discards information and creates arbitrary boundaries, so prefer it sparingly. Interaction features (x_1 × x_2) let linear models capture "this matters only when that is high". Polynomial features are a special case. Always create features from training data only in the sense that any fitted quantities (bin edges, transform parameters) come from the training fold — inside a Pipeline or FunctionTransformer where possible.',
        interview:
          'For numerical features I start by checking skew — income and spend are almost always right-skewed, so I use a log transform, log1p if there are zeros. Then I create domain features: ratios like debt-to-income, differences like spend per visit, and recency features like days since last order. Binning is useful when the business thinks in bands or the effect is non-linear, but I use it sparingly because it throws away information. And any fitted quantities — bin edges, transform parameters — come from the training data only.',
        analogy:
          'Transforms are like adjusting a photograph: a log transform is brightening the shadows so you can see detail in the dark areas. Binning is like sorting photos into albums by year — easier to browse, but you lose the exact dates. Ratios are like judging a cricketer by average, not total runs — the rate is fairer than the raw total.',
        realWorld:
          'A credit model uses raw income — but the relationship between income and default is not linear in rupees; it is linear in log-rupees, because the difference between ₹20,000 and ₹40,000 a month matters far more than between ₹2 lakh and ₹2.2 lakh. Log-transforming income improves the model immediately. A churn model gains its single most predictive feature from a ratio: support tickets per month of tenure, which separates genuinely unhappy customers from long-tenure customers who simply had more time to raise tickets. An e-commerce team bins "days since last order" into 0–30, 31–90, 90+ because the retention team runs different campaigns for each band.',
        code: {
          code: `import pandas as pd
import numpy as np
from sklearn.preprocessing import PowerTransformer

df = pd.read_csv("customers.csv")

# 1. Log transform for right-skewed money columns (log1p handles zeros safely)
df["log_spend"] = np.log1p(df["monthly_spend"])
print("skew before:", round(df["monthly_spend"].skew(), 2),
      "after:", round(df["log_spend"].skew(), 2))

# 2. Ratio / rate features — often the strongest signals
df["spend_per_order"] = df["total_spend"] / df["order_count"].replace(0, np.nan)
df["tickets_per_month"] = df["support_tickets"] / df["tenure_months"].replace(0, np.nan)

# 3. Recency: days since last activity (a classic churn feature)
df["last_order"] = pd.to_datetime(df["last_order"])
df["days_since_order"] = (pd.Timestamp("2026-01-01") - df["last_order"]).dt.days

# 4. Binning: equal-frequency bands (each band has the same number of customers)
df["tenure_band"] = pd.qcut(df["tenure_months"], q=4,
                            labels=["new", "growing", "established", "veteran"])

# 5. Automatic skew correction (Yeo-Johnson) — fit on train only in real use
pt = PowerTransformer(method="yeo-johnson")
df["spend_yj"] = pt.fit_transform(df[["monthly_spend"]])
print(df[["log_spend", "spend_per_order", "tickets_per_month",
          "days_since_order", "tenure_band"]].head())`,
          explanation:
            'The log transform visibly cuts skew; the ratio features encode domain knowledge a raw column cannot; qcut gives balanced bands (cut would give equal-width bands, which can be empty at the extremes). PowerTransformer automates skew correction but must be fitted on training data only — inside a pipeline in real work.',
        },
        mistakes: [
          'Log-transforming data that contains zeros or negatives without log1p or a shift — log(0) is undefined.',
          'Binning a continuous feature and throwing away the original. Keep both when in doubt.',
          'Creating ratio features with a denominator that can be zero — guard with .replace(0, np.nan) or a small epsilon.',
          'Engineering features from the full dataset (e.g. global bin edges) before splitting — leakage.',
          'Adding dozens of transforms blindly. Each new feature is a chance to overfit; keep features purposeful.',
        ],
        keyPoints: [
          'Log (log1p) fixes right skew; Yeo-Johnson automates it.',
          'Ratios, rates and recency features often beat raw columns.',
          'Binning helps when effects are non-linear or the business thinks in bands.',
          'Interaction features let linear models capture "only when" effects.',
          'Fit all transform parameters on training data only.',
        ],
        questionIds: ['q-m9-numerical-features-1', 'q-m9-numerical-features-2', 'q-m9-numerical-features-3'],
        skills: ['Feature Engineering'],
      },
      {
        id: 'm9-categorical-datetime',
        moduleId: 'm9',
        title: 'Categorical & Date Features',
        subtitle: 'Squeezing signal from categories and calendars',
        minutes: 16,
        simple:
          'Categories carry signal beyond their name: how frequent a category is, how it behaves historically, and how it combines with other features. Dates are even richer: from one timestamp you can extract the hour, the day of week, whether it is a weekend or a festival, and how long ago it was. The art is turning "Mumbai" and "2026-01-15 14:30" into numbers a model can learn from.',
        technical:
          'Categorical features beyond one-hot: frequency encoding (replace a category with its count or share — captures "how common is this"), target encoding (replace with the mean target per category — powerful, must be CV-safe), and grouping rare categories into "Other" (categories with < N occurrences are noise and explode one-hot width). Interaction features between categories (city × plan type) can capture segment-specific behaviour. Date features: extract components (year, month, day, hour, dayofweek, is_weekend, quarter) with the .dt accessor; compute elapsed time (days since signup, tenure); capture cyclicality with sine/cosine encoding — hour 23 and hour 0 are adjacent, but the numbers 23 and 0 are far apart, so encode hour as sin(2π·hour/24) and cos(2π·hour/24). Event flags (festive season, payday, sale period) encode domain knowledge. Beware: extracting the year from a date can leak time trends, and target encoding dates (e.g. "default rate by signup month") must respect the time split.',
        interview:
          'For categories I go beyond one-hot: frequency encoding captures how common a category is, and target encoding captures how it behaved historically — though I compute that inside cross-validation folds to avoid leakage. I group rare categories into Other so they do not add noise. For dates, I extract components like hour and day of week, compute elapsed features like days since signup, and encode cyclical features like hour with sine and cosine, because hour 23 and hour 0 are neighbours even though the numbers are far apart. I also add domain flags like festive season when the business has them.',
        analogy:
          'A raw date is a locked diary: "2026-01-15 14:30" looks like one number, but inside it are the hour, the weekday, the season, and how long ago it was. Feature engineering is unlocking the diary and pulling out the pages that matter. Cyclical encoding is remembering that a clock is round — 11pm and 1am are two hours apart, not ten.',
        realWorld:
          'A food-delivery demand model extracts hour, day-of-week and is_weekend from the timestamp, adds sine/cosine encodings for the hour (so 11pm and 1am sit close together), and flags festival days — Diwali week behaves nothing like a normal week. A churn model groups 400 cities into frequency bands and adds "city default rate" via target encoding, computed on past data only. An e-commerce team finds that "orders in the last 7 days" and "days since last order" together beat every demographic feature — recency is the strongest churn signal they have.',
        code: {
          code: `import pandas as pd
import numpy as np

df = pd.read_csv("orders.csv", parse_dates=["order_time", "signup_date"])

# --- Date components ---
df["hour"] = df["order_time"].dt.hour
df["dow"] = df["order_time"].dt.dayofweek        # Monday=0
df["is_weekend"] = (df["dow"] >= 5).astype(int)
df["month"] = df["order_time"].dt.month

# --- Cyclical encoding: hour is a circle, not a line ---
df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)
# hour 23 and hour 0 are now neighbours in (sin, cos) space

# --- Elapsed / tenure features ---
df["days_since_signup"] = (df["order_time"] - df["signup_date"]).dt.days

# --- Domain event flags ---
festivals = pd.to_datetime(["2025-10-20", "2025-10-21", "2025-11-01"])  # example dates
df["is_festival"] = df["order_time"].dt.normalize().isin(festivals).astype(int)

# --- Categorical: group rare cities into "Other" ---
counts = df["city"].value_counts()
rare = counts[counts < 50].index
df["city_grouped"] = df["city"].replace(rare, "Other")

# --- Frequency encoding: how common is this category? ---
df["city_freq"] = df["city"].map(df["city"].value_counts(normalize=True))
print(df[["hour_sin", "hour_cos", "is_weekend", "days_since_signup",
          "city_grouped", "city_freq"]].head())`,
          explanation:
            'Sine/cosine encoding is the subtle one: it turns the hour into a point on a circle, so the model sees 23:00 and 00:00 as adjacent. Grouping rare categories prevents one-hot explosion, and frequency encoding turns "how common" into a number. The festival flag is domain knowledge no algorithm would discover on its own.',
        },
        mistakes: [
          'Feeding raw hour (0–23) to a model as if it were linear — 23 and 0 look maximally different to the model.',
          'One-hot encoding a 400-value category without grouping rare values first.',
          'Target-encoding on the full dataset — leakage. Compute it within CV folds.',
          'Creating date features that use future information (e.g. "days until churn" — unknowable at prediction time).',
          'Extracting the year as a numeric feature in a short time window — it mostly encodes the trend, not a stable pattern.',
        ],
        keyPoints: [
          'Dates unpack into hour, weekday, weekend, month, tenure, and event flags.',
          'Cyclical features (hour, month) need sine/cosine encoding.',
          'Group rare categories into "Other" before encoding.',
          'Frequency and target encoding compress high-cardinality categories.',
          'Never build a date feature from information unavailable at prediction time.',
        ],
        formulas: [
          { name: 'Cyclical encoding', formula: 'x_sin = sin(2π * x / period), x_cos = cos(2π * x / period)' },
        ],
        questionIds: ['q-m9-categorical-datetime-1', 'q-m9-categorical-datetime-2', 'q-m9-categorical-datetime-3'],
        skills: ['Feature Engineering'],
      },
      {
        id: 'm9-feature-selection',
        moduleId: 'm9',
        title: 'Feature Selection & Dimensionality',
        subtitle: 'Fewer, better features beat more, noisier ones',
        minutes: 16,
        simple:
          'Feature selection is choosing which columns the model actually gets to use. Irrelevant or redundant features add noise, slow training, and invite overfitting — the curse of dimensionality means that as features pile up, the data gets sparser and distances lose meaning. The goal is the smallest set of features that carries the signal.',
        technical:
          'Three families: (1) Filter methods — rank features by a statistic independent of the model: correlation with the target, mutual information, chi-squared for categoricals, or variance (drop near-zero-variance features). Fast, model-agnostic, but ignores interactions. (2) Wrapper methods — search subsets by model performance: forward selection (add the best feature one at a time), backward elimination (drop the worst), recursive feature elimination / RFE (train, drop the least important, repeat). Accurate but expensive. (3) Embedded methods — selection happens during training: Lasso zeroes coefficients, tree models give importance scores, and SelectFromModel wraps them. Rules of thumb: drop features with > 90% missing or near-zero variance; drop one of any pair correlated above ~0.9; remove IDs and other non-predictive columns; beware of leakage features (suspiciously predictive). Dimensionality reduction (PCA, covered in Module 10) is the alternative when you want to compress rather than select. Always select features inside the cross-validation loop — selecting on the full dataset before CV leaks information and inflates scores.',
        interview:
          'I select features in three ways. Filter methods rank features by a statistic like correlation or mutual information — fast and model-agnostic. Wrapper methods like recursive feature elimination search subsets by actual model performance — slower but more accurate. And embedded methods like Lasso do selection during training by zeroing coefficients. In practice I start with the cheap wins: drop near-zero-variance features, drop one of any pair correlated above 0.9, and remove IDs. And I always do selection inside cross-validation, because selecting on the full dataset leaks information.',
        analogy:
          'Feature selection is packing a bag for a trek. Every extra item adds weight and slows you down; the skill is carrying only what you will actually use. Filter methods are checking the weather forecast before packing; wrapper methods are trial hikes with different loads; embedded methods are a smart backpack that drops what you never touch.',
        realWorld:
          'A churn model started with 180 features — every column the data warehouse had. Training took 40 minutes and the model overfit. Correlation filtering dropped 60 near-duplicates, variance filtering dropped 25 constants, and RFE with a random forest cut the rest to 32. The smaller model trained in 3 minutes, scored slightly better on the test set, and — crucially — the business could finally understand which 32 signals drove churn. The team also caught a leakage feature in the process: "cancellation_reason" was filled only for churners, which is why the original model had looked so accurate.',
        code: {
          code: `import pandas as pd
import numpy as np
from sklearn.feature_selection import (VarianceThreshold, SelectKBest,
                                       mutual_info_classif, RFE)
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LassoCV

df = pd.read_csv("customers.csv")
X = df.drop(columns=["customer_id", "churned"])  # IDs are never features
y = df["churned"]
X = pd.get_dummies(X, drop_first=True)

# 1. Drop near-constant features
vt = VarianceThreshold(threshold=0.01)
X_v = vt.fit_transform(X)
print("after variance filter:", X_v.shape[1], "of", X.shape[1])

# 2. Drop one of each highly-correlated pair
corr = pd.DataFrame(X_v).corr().abs()
upper = corr.where(np.triu(np.ones(corr.shape), k=1).astype(bool))
to_drop = [c for c in upper.columns if any(upper[c] > 0.9)]
print("dropping", len(to_drop), "redundant features (corr > 0.9)")

# 3. Filter: top-k by mutual information (captures non-linear links too)
kb = SelectKBest(mutual_info_classif, k=15)
X_k = kb.fit_transform(X_v, y)
print("top features by mutual information:",
      list(pd.DataFrame(X_v).columns[kb.get_support()]))

# 4. Embedded: Lasso zeroes the weak coefficients
lasso = LassoCV(cv=5, max_iter=5000).fit(X_v, y)
print("Lasso kept", int((lasso.coef_ != 0).sum()), "features")

# 5. Wrapper: RFE with a forest — accurate, but the most expensive
rfe = RFE(RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42),
          n_features_to_select=10)
rfe.fit(X_v, y)
print("RFE top 10:", list(pd.DataFrame(X_v).columns[rfe.support_]))`,
          explanation:
            'The pipeline goes from cheap to expensive: variance and correlation filters first (nearly free), then mutual information, then Lasso, then RFE. In real work, steps 1–3 run inside each CV fold via a Pipeline — the code above shows the logic on the full data for clarity, but selecting on the full dataset before evaluation inflates scores.',
        },
        mistakes: [
          'Selecting features on the full dataset before cross-validation — selection leakage, inflated scores.',
          'Dropping a feature just because its individual correlation with the target is low. It may matter in combination with others.',
          'Keeping ID columns, row numbers or other non-predictive identifiers as features.',
          'Using RFE with an expensive model on hundreds of features — it retrains the model at every step.',
          'Treating feature selection as one-and-done. The right set changes as data and the business change.',
        ],
        whenToUse: [
          'Filter methods: quick first pass, or when you need a model-agnostic ranking.',
          'Wrapper (RFE): when accuracy matters most and you can afford the compute.',
          'Embedded (Lasso, tree importance): when you want selection integrated with fitting.',
        ],
        comparison: [
          { label: 'Filter vs Wrapper vs Embedded', text: 'Filters are fast and ignore the model; wrappers use the model but are slow; embedded methods select during training — a middle ground.' },
          { label: 'Selection vs PCA', text: 'Selection keeps original, interpretable features; PCA creates new compressed features that are harder to explain but capture combined signal.' },
        ],
        keyPoints: [
          'More features is not better — noise, overfitting and the curse of dimensionality.',
          'Filters (correlation, mutual information) are fast; wrappers (RFE) are accurate; embedded (Lasso) is integrated.',
          'Drop near-zero-variance features, IDs, and one of each highly-correlated pair.',
          'A low individual correlation does not mean a feature is useless in combination.',
          'Select features inside CV folds, never on the full dataset first.',
        ],
        questionIds: ['q-m9-feature-selection-1', 'q-m9-feature-selection-2', 'q-m9-feature-selection-3'],
        skills: ['Feature Engineering', 'Model Selection'],
      },
    ],
  },

  // ─── Module 10 — Unsupervised Learning ───────────────────────────────────
  {
    id: 'm10',
    number: 10,
    title: 'Unsupervised Learning',
    shortTitle: 'Unsupervised',
    description:
      'Learning without labels: K-Means clustering for customer segmentation, PCA for compressing high-dimensional data into its essential directions, and anomaly detection plus DBSCAN for finding the unusual — including fraud.',
    icon: 'network',
    skills: ['Algorithms'],
    lessons: [
      {
        id: 'm10-kmeans',
        moduleId: 'm10',
        title: 'K-Means Clustering',
        subtitle: 'Finding natural groups when nobody labelled them',
        minutes: 20,
        simple:
          'K-Means groups data into K clusters by repeatedly doing two steps: assign every point to its nearest cluster centre (centroid), then move each centroid to the average of its points. Repeat until the centres stop moving. You choose K in advance; the algorithm finds the grouping that minimises the total distance from points to their centres. It is the standard tool for customer segmentation.',
        technical:
          'K-Means minimises the within-cluster sum of squares (inertia): Σ over clusters of Σ over points of ||x − μ_k||². The Lloyd\'s algorithm loop — assign, update — converges to a local minimum, so results depend on the initialisation: k-means++ seeds centres spread apart and is the default in sklearn (n_init=10 restarts, keep the best). Choosing K: the elbow method (plot inertia vs K, look for the bend), the silhouette score (mean (b − a) / max(a, b), where a is mean distance within the cluster and b is mean distance to the nearest other cluster; ranges −1 to +1, higher is better), and — most importantly — business usefulness. Assumptions: clusters are roughly spherical and similar-sized; K-Means struggles with elongated, differently-sized or non-convex clusters and is sensitive to outliers (they drag centroids). Features must be scaled — distance is the whole algorithm. Complexity is O(n·K·d·iterations), fast enough for large data. Always run with multiple random states and check stability: if the clusters change completely between runs, they are not real.',
        interview:
          'K-Means partitions data into K clusters by alternating two steps: assign each point to the nearest centroid, then recompute each centroid as the mean of its points, until they stop moving. It minimises the within-cluster sum of squared distances. I choose K with the elbow method and the silhouette score, but the real test is whether the clusters are useful and stable — I check that different random seeds give similar groupings. I always scale features, since the algorithm is entirely distance-based. Its weaknesses are that it assumes spherical, similar-sized clusters and is sensitive to outliers, so for oddly-shaped clusters I would use DBSCAN instead.',
        analogy:
          'K-Means is like a teacher grouping students for projects: pick K group leaders, let every student join the leader they sit nearest to, then move each leader to the middle of their group — and repeat until nobody wants to switch groups. The elbow method is deciding how many groups you need: too few and the groups are a mess; too many and you gain nothing by splitting further.',
        realWorld:
          'An e-commerce company clusters customers on recency, frequency and monetary value (RFM) with K-Means, K=4. The clusters turn out to be recognisable business segments: "Champions" (recent, frequent, high spend), "At-risk big spenders" (high spend, not recent), "New explorers" (recent, low spend) and "Dormant" (nothing recent). Each segment gets a different campaign — and the marketing team finally has segments based on behaviour, not gut feel. The team validates K=4 with the silhouette score and by checking that the segments stay stable month to month.',
        math: 'Objective (inertia): minimise Σ_k Σ_{x in C_k} ||x − μ_k||^2. Centroid update: μ_k = mean of points in cluster k. Silhouette: s = (b − a) / max(a, b), where a = mean intra-cluster distance, b = mean distance to nearest other cluster.',
        code: {
          code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

df = pd.read_csv("customers.csv")
X = df[["recency_days", "frequency", "monetary"]].copy()
X_scaled = StandardScaler().fit_transform(X)  # REQUIRED: K-Means is distance-based

# Elbow + silhouette: choose K with evidence, not a guess
inertias, silhouettes = [], []
for k in range(2, 11):
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(X_scaled)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X_scaled, km.labels_))
    print(f"K={k:2d}  inertia={km.inertia_:9.0f}  silhouette={silhouettes[-1]:.3f}")

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(range(2, 11), inertias, marker="o")
axes[0].set_title("Elbow method: look for the bend")
axes[0].set_xlabel("K"); axes[0].set_ylabel("Inertia")
axes[1].plot(range(2, 11), silhouettes, marker="o")
axes[1].set_title("Silhouette score: higher is better")
axes[1].set_xlabel("K"); axes[1].set_ylabel("Silhouette")
plt.tight_layout(); plt.show()

# Fit the chosen K and profile the clusters — the business deliverable
best_k = int(np.argmax(silhouettes)) + 2
km = KMeans(n_clusters=best_k, n_init=10, random_state=42).fit(X_scaled)
df["segment"] = km.labels_
print(df.groupby("segment")[["recency_days", "frequency", "monetary"]].mean().round(1))`,
          explanation:
            'The elbow and silhouette curves usually agree on a sensible K — when they disagree, trust the silhouette score and business sense. The final groupby is the deliverable: a profile of each segment in original units, which is what the marketing team actually uses. Scaling is mandatory here; without it, monetary (in rupees) would dominate every distance.',
        },
        mistakes: [
          'Forgetting to scale features — the largest-scale feature dominates the clusters.',
          'Picking K by gut feel instead of elbow/silhouette plus business sense.',
          'Running K-Means once with one random state. It converges to local minima; use n_init=10 and check stability.',
          'Treating cluster labels as ground truth. Clusters are discovered structure, not facts — validate them.',
          'Using K-Means on non-spherical or very differently-sized clusters and wondering why the result is wrong.',
        ],
        whenToUse: [
          'Customer segmentation, market segmentation, grouping similar items.',
          'Large data where speed matters; roughly spherical, similar-sized groups.',
          'As a preprocessing step (e.g. cluster features for a supervised model).',
        ],
        whenNotToUse: [
          'Non-convex, elongated or very uneven clusters — use DBSCAN or hierarchical clustering.',
          'Data with heavy outliers — they drag centroids badly.',
          'When the number of clusters is genuinely unknown and unstable across runs.',
        ],
        comparison: [
          { label: 'vs DBSCAN', text: 'DBSCAN finds arbitrarily-shaped clusters and flags outliers, without needing K — but struggles when density varies across clusters.' },
          { label: 'vs Hierarchical clustering', text: 'Hierarchical gives a dendrogram (clusters at every granularity) and needs no K, but is O(n²) and slow on large data.' },
          { label: 'vs KNN', text: 'Both use distance, but KNN is supervised (predicts labels); K-Means is unsupervised (discovers groups).' },
        ],
        keyPoints: [
          'K-Means alternates: assign points to the nearest centroid, then move centroids to the mean.',
          'It minimises within-cluster sum of squares (inertia).',
          'Choose K with the elbow method, silhouette score, and business usefulness.',
          'Scaling is mandatory; k-means++ initialisation + n_init restarts fight local minima.',
          'Assumes spherical, similar-sized clusters; sensitive to outliers.',
          'Validate clusters: stability across seeds and a business-readable profile.',
        ],
        formulas: [
          { name: 'K-Means objective (inertia)', formula: 'minimise Σ_k Σ_{x in C_k} ||x − μ_k||^2' },
          { name: 'Silhouette score', formula: 's = (b − a) / max(a, b)' },
        ],
        visual: 'kmeans',
        questionIds: ['q-m10-kmeans-1', 'q-m10-kmeans-2', 'q-m10-kmeans-3'],
        skills: ['Algorithms'],
      },
      {
        id: 'm10-pca',
        moduleId: 'm10',
        title: 'PCA: Dimensionality Reduction',
        subtitle: 'Compressing many features into a few that carry the signal',
        minutes: 20,
        simple:
          'Principal Component Analysis finds new axes — combinations of your original features — along which the data varies the most. The first principal component is the direction of maximum variance, the second is the next-best direction at right angles to the first, and so on. By keeping only the first few components, you compress hundreds of features into a handful that still capture most of the information.',
        technical:
          'PCA is an orthogonal linear transformation: given a centred data matrix X, it finds the eigenvectors of the covariance matrix X^T X (equivalently, the SVD of X). Each eigenvector is a principal component (a direction); its eigenvalue is the variance along that direction. Components are ordered by explained variance ratio, and the cumulative sum tells you how many components capture, say, 95% of the variance. In sklearn: PCA(n_components=0.95) keeps enough components for 95% variance; fit on training data only, transform both sets. PCA requires scaled features — otherwise the largest-variance feature dominates the first component by construction. Use cases: visualisation (2D/3D plots of high-dimensional data), denoising, compression before a slow model, and fighting the curse of dimensionality. Limitations: components are linear combinations, so they are hard to interpret; PCA is unsupervised, so it can discard low-variance directions that are actually predictive; and it only captures linear structure (kernel PCA or UMAP handle non-linear structure).',
        interview:
          'PCA finds new axes that are combinations of the original features, ordered by how much variance they capture. The first principal component is the direction of maximum variance in the data. I keep enough components to explain most of the variance — usually 90 to 95 percent — and drop the rest. I use it for visualisation, for compressing high-dimensional data before a slow model, and for denoising. I always scale features first, because PCA is variance-based and an unscaled feature would dominate. The main limitation is interpretability: components are mixtures of features, and PCA can discard low-variance directions that actually predict the target.',
        analogy:
          'PCA is like photographing a 3D object: a good photo angle captures most of what the object is, even though you flattened a dimension. The first principal component is the best photo angle; the second is the next-best angle from a different side. Keeping two or three components is like keeping two or three photos — enough to recognise the object, far less data than the full 3D scan.',
        realWorld:
          'A bank has 200 features per customer — transaction aggregates, bureau fields, app behaviour. A KNN model on 200 dimensions is useless (curse of dimensionality), so the team runs PCA: the first 12 components capture 92% of the variance, and KNN on those 12 works well. A genomics team visualises 20,000-gene data in 2D with PCA and immediately sees that samples cluster by tissue type — a pattern invisible in the raw table. But a fraud team learns PCA\'s limit the hard way: the low-variance components they dropped contained the rare fraud signal, so they use PCA for exploration and keep the original features for the model.',
        math: 'Covariance eigendecomposition: X^T X v = λ v. Principal components are the eigenvectors v, ordered by eigenvalue λ (variance). Explained variance ratio of component i: λ_i / Σ λ_j.',
        code: {
          code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

df = pd.read_csv("customers.csv")
X = df.drop(columns=["customer_id", "churned"])
X_scaled = StandardScaler().fit_transform(X)  # REQUIRED: PCA is variance-based

# How many components capture 95% of the variance?
pca = PCA(n_components=0.95).fit(X_scaled)
print(f"{pca.n_components_} components capture 95% of variance "
      f"(from {X.shape[1]} features)")

# Scree plot: the classic "how many components" view
full = PCA().fit(X_scaled)
cumvar = np.cumsum(full.explained_variance_ratio_)
plt.plot(range(1, len(cumvar) + 1), cumvar, marker="o")
plt.axhline(0.95, color="red", linestyle="--", label="95% variance")
plt.xlabel("Number of components"); plt.ylabel("Cumulative explained variance")
plt.title("Scree plot"); plt.legend(); plt.show()

# 2D visualisation of high-dimensional data
pca2 = PCA(n_components=2).fit(X_scaled)
proj = pca2.transform(X_scaled)
plt.scatter(proj[:, 0], proj[:, 1], c=df["churned"], alpha=0.4, cmap="coolwarm")
plt.xlabel("PC1"); plt.ylabel("PC2")
plt.title("Customers in PCA space, coloured by churn")
plt.show()

# What does PC1 actually mean? Look at the loadings.
loadings = pd.Series(pca2.components_[0], index=X.columns).sort_values(key=abs, ascending=False)
print("PC1 loadings (top 5):"); print(loadings.head())`,
          explanation:
            'The scree plot answers "how many components?" — look for where the curve flattens. The 2D scatter is PCA\'s most common use: seeing structure in high-dimensional data. The loadings translate a component back into original features — if PC1 loads heavily on spend and frequency, it is roughly a "customer value" axis. That is how you make PCA interpretable.',
        },
        mistakes: [
          'Running PCA without scaling — the highest-variance raw feature becomes PC1 by construction.',
          'Fitting PCA on the full dataset before splitting — the components leak test information.',
          'Assuming the top components are the most predictive. PCA is unsupervised; low-variance directions can carry the target signal.',
          'Using PCA when you need interpretable features. Components are mixtures — feature selection keeps original columns.',
          'Keeping too few components and discarding real signal, or too many and gaining nothing.',
        ],
        whenToUse: [
          'Visualising high-dimensional data in 2D/3D.',
          'Compressing features before a distance-based or slow model.',
          'Denoising: dropping low-variance components that are mostly noise.',
        ],
        whenNotToUse: [
          'When feature interpretability matters — use feature selection instead.',
          'When the predictive signal lives in low-variance directions.',
          'For non-linear structure — use kernel PCA, t-SNE or UMAP instead.',
        ],
        comparison: [
          { label: 'vs Feature selection', text: 'PCA creates new compressed features (uninterpretable mixtures); selection keeps a subset of original features (interpretable).' },
          { label: 'vs t-SNE / UMAP', text: 't-SNE and UMAP capture non-linear structure and are better for visualisation, but they are stochastic, slower, and cannot transform new data the same way (t-SNE has no transform).' },
          { label: 'vs Autoencoders', text: 'Autoencoders learn non-linear compression with neural nets; PCA is the linear, fast, closed-form version.' },
        ],
        keyPoints: [
          'PCA finds orthogonal directions of maximum variance (eigenvectors of the covariance matrix).',
          'Keep enough components for ~90–95% explained variance; use the scree plot.',
          'Scaling is mandatory — PCA is variance-based.',
          'Fit on train only; transform both train and test.',
          'Great for visualisation and compression; weak on interpretability and non-linear structure.',
          'Low-variance components can still carry predictive signal — PCA is unsupervised.',
        ],
        formulas: [
          { name: 'PCA eigendecomposition', formula: 'X^T X v = λ v (v = component, λ = variance)' },
          { name: 'Explained variance ratio', formula: 'λ_i / Σ λ_j' },
        ],
        visual: 'pca',
        questionIds: ['q-m10-pca-1', 'q-m10-pca-2', 'q-m10-pca-3'],
        skills: ['Algorithms'],
      },
      {
        id: 'm10-anomaly',
        moduleId: 'm10',
        title: 'Anomaly Detection & DBSCAN',
        subtitle: 'Finding the rare, the strange, and the fraudulent',
        minutes: 18,
        simple:
          'Anomaly detection finds the points that do not fit the pattern — the transactions, readings or customers that are wildly different from the rest. Sometimes that is a data error; sometimes it is fraud, a failing machine, or a new opportunity. DBSCAN is a clustering algorithm that finds groups of any shape and labels the points that fit nowhere as noise — which makes it a natural anomaly detector.',
        technical:
          'Anomaly detection approaches: (1) statistical — z-scores or IQR bounds on individual features (simple, univariate); (2) Isolation Forest — randomly partitions the data; anomalies are isolated in few splits, so their average path length is short (fast, works on high-dimensional data, contamination parameter sets the expected anomaly rate); (3) One-Class SVM — learns a boundary around the normal data; (4) autoencoders — reconstruction error is high for anomalies; (5) DBSCAN as a detector — points labelled −1 (noise) are anomalies. DBSCAN (Density-Based Spatial Clustering of Applications with Noise) groups points that are densely packed: a point is a core point if it has at least min_samples neighbours within distance eps; clusters grow from core points; points reachable from no core point are noise. Unlike K-Means, DBSCAN needs no K, finds arbitrarily-shaped clusters, and explicitly labels outliers — but it struggles when clusters have very different densities, and eps/min_samples need tuning (the k-distance graph helps choose eps). Evaluation is hard without labels: use precision/recall if some labels exist, or business review of flagged cases.',
        interview:
          'For anomaly detection I usually start with Isolation Forest — it isolates anomalies by random partitioning, and anomalies get isolated in very few splits, so it is fast and works on high-dimensional data. I set the contamination parameter to the expected anomaly rate. DBSCAN is another approach I like: it clusters dense regions and labels sparse points as noise, so it finds oddly-shaped clusters and flags outliers in one step, without needing K in advance. The hard part is evaluation — without labels I review flagged cases with the business, and if I have some labels I measure precision and recall.',
        analogy:
          'Isolation Forest is like a game of "guess the odd one out": you keep splitting a crowd randomly by one trait at a time. A normal person takes many splits to isolate; the one person wearing a clown costume gets isolated in two splits. DBSCAN is like finding crowds in a city square: dense groups are clusters, and the lone person standing far from everyone is noise.',
        realWorld:
          'A payments company runs Isolation Forest on transaction features — amount, velocity, device age, location change — with contamination set to 0.5%. The flagged transactions go to a review queue; analysts confirm about 30% as real fraud, and the confirmed cases become labels for a supervised model later. A factory uses DBSCAN on sensor readings: normal operation forms dense clusters, and the noise points turn out to be early signs of bearing failure — caught days before the machine would have broken down. A bank uses z-score rules as a first line (any transaction over 5 standard deviations from a customer\'s own mean) and Isolation Forest as the second.',
        code: {
          code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("transactions.csv")
X = df[["amount", "velocity_1h", "device_age_days", "hour"]].copy()
X_scaled = StandardScaler().fit_transform(X)

# --- Isolation Forest: -1 = anomaly, 1 = normal ---
iso = IsolationForest(contamination=0.01, random_state=42)  # expect ~1% anomalies
df["iso_anomaly"] = iso.fit_predict(X_scaled)
print("Isolation Forest flagged:", int((df["iso_anomaly"] == -1).sum()), "transactions")
print(df[df["iso_anomaly"] == -1][["amount", "velocity_1h"]].describe().round(1))

# --- DBSCAN: clusters of any shape; label -1 = noise (anomaly) ---
db = DBSCAN(eps=0.8, min_samples=10).fit(X_scaled)
df["dbscan_label"] = db.labels_
n_clusters = len(set(db.labels_)) - (1 if -1 in db.labels_ else 0)
print(f"DBSCAN found {n_clusters} clusters and "
      f"{int((db.labels_ == -1).sum())} noise points")

# Visual: anomalies stand out
plt.scatter(X_scaled[:, 0], X_scaled[:, 1],
            c=(df["iso_anomaly"] == -1), cmap="coolwarm", alpha=0.5, s=10)
plt.xlabel("amount (scaled)"); plt.ylabel("velocity_1h (scaled)")
plt.title("Isolation Forest anomalies (red)")
plt.show()`,
          explanation:
            'contamination is your prior belief about how much fraud exists — set it from business knowledge, not a guess. DBSCAN\'s eps is the key tuning knob: too small and everything is noise, too large and everything is one cluster (use a k-distance plot to choose it). Both methods need scaling, and both need human review of the flagged cases — an anomaly is a lead, not a verdict.',
        },
        mistakes: [
          'Treating every anomaly as fraud. Anomalies are candidates for review, not convictions.',
          'Using DBSCAN with default eps and getting one giant cluster or all noise — eps needs tuning.',
          'Forgetting to scale features for DBSCAN and Isolation Forest (distances matter).',
          'Setting contamination blindly. It should reflect the business\'s best estimate of the true anomaly rate.',
          'Evaluating anomaly detection with accuracy. With 0.1% anomalies, accuracy is meaningless — use precision/recall on labelled cases, or business review.',
        ],
        whenToUse: [
          'Isolation Forest: fast, high-dimensional anomaly detection with a rough anomaly-rate estimate.',
          'DBSCAN: clusters of unknown shape/count, with explicit outlier labelling.',
          'Statistical (z-score/IQR): simple univariate checks and first-line rules.',
        ],
        whenNotToUse: [
          'DBSCAN when clusters have very different densities — one eps cannot fit all.',
          'Anomaly detection when you have plenty of labels — supervised classification will beat it.',
        ],
        comparison: [
          { label: 'Isolation Forest vs One-Class SVM', text: 'Isolation Forest is faster and scales better; One-Class SVM can draw tighter boundaries on small, clean data.' },
          { label: 'DBSCAN vs K-Means', text: 'DBSCAN needs no K, finds any shape, and labels outliers; K-Means is faster, needs K, and assumes spherical clusters.' },
          { label: 'Anomaly detection vs Classification', text: 'Anomaly detection needs no labels and finds the unknown; classification needs labelled examples of each class and is more accurate when they exist.' },
        ],
        keyPoints: [
          'Anomalies are leads for review, not verdicts.',
          'Isolation Forest: anomalies isolate in few random splits; set contamination from business knowledge.',
          'DBSCAN: dense regions are clusters, sparse points are noise; needs no K.',
          'Tune eps for DBSCAN (k-distance graph); scale features for both.',
          'Evaluate with precision/recall on labelled cases, or business review — never accuracy.',
        ],
        questionIds: ['q-m10-anomaly-1', 'q-m10-anomaly-2', 'q-m10-anomaly-3'],
        skills: ['Algorithms'],
      },
    ],
  },

  // ─── Module 11 — Explainable ML ──────────────────────────────────────────
  {
    id: 'm11',
    number: 11,
    title: 'Explainable ML',
    shortTitle: 'Explainable ML',
    description:
      'Models that nobody understands do not get deployed — or trusted. This module covers feature importance (and its pitfalls), permutation importance, and SHAP: the standard for explaining individual predictions to business stakeholders and regulators.',
    icon: 'book',
    skills: ['Explainability'],
    lessons: [
      {
        id: 'm11-feature-importance',
        moduleId: 'm11',
        title: 'Feature Importance & Permutation Importance',
        subtitle: 'Which features actually drive the model — and how to measure it honestly',
        minutes: 16,
        simple:
          'Feature importance ranks the features by how much they contribute to the model\'s predictions. Tree models compute it from how much each feature reduces impurity across all splits. Permutation importance measures it differently: shuffle one feature\'s values and see how much the score drops — if the model gets much worse, the feature mattered. Permutation importance is slower but more honest, because it is measured on held-out data and is not biased toward high-cardinality features.',
        technical:
          'Impurity-based importance (mean decrease in impurity, MDI): for each feature, sum the impurity reduction it achieves across all splits in all trees, weighted by the number of samples passing through. It is fast and built into tree models (feature_importances_), but biased: it favours high-cardinality and continuous features, it is computed on training data (so it reflects overfit splits), and correlated features split the credit arbitrarily. Permutation importance (sklearn.inspection.permutation_importance): shuffle one feature in a validation set, measure the score drop, repeat. It is model-agnostic, measured on held-out data, and unbiased toward cardinality — but correlated features mask each other (shuffling one of two correlated features barely hurts, because the other carries the same signal). Practical guidance: report permutation importance on a validation set with n_repeats=10+; treat correlated groups together; never read importance as causation — importance says the model uses the feature, not that the feature causes the outcome. For linear models, standardised coefficients are the analogous importance measure.',
        interview:
          'I measure feature importance two ways. Tree models give impurity-based importance, which is fast but biased toward high-cardinality features and computed on training data. I prefer permutation importance: I shuffle one feature in the validation set and measure how much the score drops — if it drops a lot, the feature mattered. It is model-agnostic and more honest. But I always remember two caveats: correlated features mask each other, and importance is not causation — it tells me what the model uses, not what causes the outcome.',
        analogy:
          'Impurity importance is like judging employees by how often they speak in meetings — the loud ones look important. Permutation importance is like seeing what happens when someone is on leave: if the team struggles without them, they mattered. The leave test is slower but far more honest — though if two people do the same job, either one\'s absence is covered by the other.',
        realWorld:
          'A churn model\'s impurity importance ranked "customer_id hash" highly — a meaningless artefact of its high cardinality. Permutation importance on the validation set told the true story: days since last login, support tickets per month, and tenure dominated, while the ID feature scored zero. The team dropped the ID column and the model improved. In a credit model, two income measures split the importance between them; the team reported them as a group ("income measures, combined") rather than claiming one mattered more than the other.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
import matplotlib.pyplot as plt

df = pd.read_csv("customers.csv")
X = df[["tenure_months", "monthly_spend", "support_tickets", "days_since_login",
        "contract_months", "plan_changes"]]
y = df["churned"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

forest = RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42)
forest.fit(X_train, y_train)

# 1. Impurity-based: fast, biased, training-data based
mdi = pd.Series(forest.feature_importances_, index=X.columns).sort_values(ascending=False)
print("impurity importance:"); print(mdi.round(3))

# 2. Permutation: honest, validation-based, model-agnostic
perm = permutation_importance(forest, X_test, y_test, n_repeats=20, random_state=42)
perm_s = pd.Series(perm.importances_mean, index=X.columns).sort_values(ascending=False)
print("\\npermutation importance (mean score drop):"); print(perm_s.round(3))

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
mdi.plot.bar(ax=axes[0], title="Impurity-based (MDI)")
perm_s.plot.bar(ax=axes[1], title="Permutation (validation set)")
plt.tight_layout(); plt.show()`,
          explanation:
            'Run this and the two rankings will often disagree — that disagreement is the lesson. MDI rewards features the tree split on often (including noisy ones); permutation importance rewards features the model actually needs on unseen data. When presenting to stakeholders, show the permutation ranking.',
        },
        mistakes: [
          'Presenting impurity importance as the truth without checking permutation importance.',
          'Reading importance as causation. "The model uses tenure" does not mean "tenure causes churn".',
          'Reporting importance for one of two correlated features and concluding the other is useless.',
          'Computing permutation importance on the training set — it should be on held-out data.',
          'Using a single shuffle (n_repeats=1). Shuffling is random; repeat 10–20 times and average.',
        ],
        comparison: [
          { label: 'MDI vs Permutation', text: 'MDI is fast, training-based, biased to high-cardinality features. Permutation is slower, validation-based, model-agnostic, and unbiased — but correlated features mask each other.' },
          { label: 'Importance vs SHAP', text: 'Importance is global (which features matter overall). SHAP also gives local explanations (why this customer was flagged).' },
          { label: 'Importance vs Coefficients', text: 'For linear models, standardised coefficients play the same role — with sign and magnitude, which importance lacks.' },
        ],
        keyPoints: [
          'Impurity importance is fast but biased; permutation importance is honest but slower.',
          'Measure permutation importance on held-out data, with repeats.',
          'Correlated features split or mask importance — report groups together.',
          'Importance is not causation.',
          'For linear models, use standardised coefficients instead.',
        ],
        questionIds: ['q-m11-feature-importance-1', 'q-m11-feature-importance-2', 'q-m11-feature-importance-3'],
        skills: ['Explainability'],
      },
      {
        id: 'm11-shap',
        moduleId: 'm11',
        title: 'SHAP & Explaining Models to Business',
        subtitle: 'Why this customer, why this prediction — in plain language',
        minutes: 18,
        simple:
          'SHAP explains a single prediction by fairly dividing the credit (or blame) among the features. It comes from game theory: each feature is a player, the prediction is the payout, and the Shapley value is each player\'s fair share. For one customer, SHAP can say "the model predicted churn mainly because they have not logged in for 45 days (+0.25) and raised 4 tickets (+0.12), partly offset by their 3-year tenure (−0.08)". That is an explanation a business person can act on.',
        technical:
          'SHAP (SHapley Additive exPlanations) assigns each feature a value φ_i such that the prediction equals the base value (the average prediction) plus the sum of all φ_i — the additive property. Shapley values come from cooperative game theory and satisfy fairness axioms: efficiency (the contributions sum to the prediction minus base), symmetry, dummy (a feature that never changes the prediction gets zero), and additivity. In practice: TreeExplainer for tree ensembles (exact, fast), KernelExplainer as a model-agnostic fallback (slow), and LinearExplainer for linear models. Visualisations: waterfall plots for one prediction, beeswarm summary plots for global patterns (which features push predictions up or down, and for whom), and dependence plots for feature effects. SHAP values are not causal — they explain the model, not the world. Correlated features split credit, and explanations depend on the background dataset used. For business communication: lead with the top 2–3 drivers in plain language, give the direction and rough size, and never present SHAP as proof that changing a feature will change the outcome.',
        interview:
          'SHAP explains individual predictions using Shapley values from game theory. It fairly divides the difference between a prediction and the average prediction among the features, so I can say exactly why the model flagged one customer: this feature pushed the score up by this much, that feature pushed it down. I use the TreeExplainer for tree models, which is fast and exact, and I show waterfall plots for individual cases and beeswarm plots for global patterns. The caveats I keep in mind: SHAP explains the model, not the real world — it is not causal — and correlated features split the credit between them.',
        analogy:
          'SHAP is like splitting a restaurant bill fairly among friends who shared dishes. Each person\'s fair share depends on what they actually ate, not just that they were at the table. The Shapley value is the mathematically fair way to do that split — and SHAP applies the same fairness idea to features sharing credit for a prediction.',
        realWorld:
          'A bank declines a loan application, and the applicant asks why. The credit team pulls up the SHAP waterfall: the biggest push toward decline was the applicant\'s high existing debt (+0.18), followed by short employment history (+0.09); their good credit score pulled the other way (−0.06). The officer can now explain the decision in plain language and tell the applicant what would change it. A churn team uses the SHAP summary plot to discover that "days since login" drives churn predictions far more than demographics — so the retention campaign targets behaviour, not age groups.',
        code: {
          code: `import pandas as pd
import shap
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import matplotlib.pyplot as plt

df = pd.read_csv("customers.csv")
X = df[["tenure_months", "monthly_spend", "support_tickets", "days_since_login",
        "contract_months", "plan_changes"]]
y = df["churned"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

forest = RandomForestClassifier(n_estimators=200, n_jobs=-1, random_state=42)
forest.fit(X_train, y_train)

# TreeExplainer is exact and fast for tree models
explainer = shap.TreeExplainer(forest)
shap_values = explainer.shap_values(X_test)

# 1. Global view: which features push predictions, and in which direction?
shap.summary_plot(shap_values[1], X_test, show=False)
plt.title("SHAP summary — churn model")
plt.tight_layout(); plt.show()

# 2. One customer, explained: the waterfall
idx = 0  # first test customer
print("customer features:"); print(X_test.iloc[idx])
print("predicted churn probability:",
      round(forest.predict_proba(X_test.iloc[[idx]])[0, 1], 3))
shap.waterfall_plot(
    shap.Explanation(values=shap_values[1][idx],
                     base_values=explainer.expected_value[1],
                     data=X_test.iloc[idx].values,
                     feature_names=list(X.columns)),
    show=False)
plt.tight_layout(); plt.show()`,
          explanation:
            'The summary plot is the global story: each dot is one customer, red means the feature value was high, and position shows whether it pushed the prediction toward churn (right) or away (left). The waterfall is the individual story: start at the average prediction, add each feature\'s push, and you arrive at this customer\'s prediction. Together they answer "why" at both levels.',
        },
        mistakes: [
          'Presenting SHAP values as causal. "SHAP says tenure reduces churn" means the model uses tenure that way, not that tenure causes retention.',
          'Explaining a model with KernelExplainer on a large dataset and waiting hours — use TreeExplainer for trees.',
          'Showing a SHAP plot to stakeholders without translating it into plain language and the top 2–3 drivers.',
          'Ignoring the background dataset: SHAP values are relative to it, so a weird background gives weird explanations.',
          'Explaining a bad model. If the model is wrong, the explanation is a polished version of a wrong answer.',
        ],
        whenToUse: [
          'Explaining individual high-stakes predictions (loan declines, fraud flags).',
          'Global model audits: which features drive predictions overall.',
          'Regulated domains where decisions must be explainable.',
        ],
        comparison: [
          { label: 'SHAP vs LIME', text: 'LIME builds a local surrogate model around one prediction — fast and flexible, but approximate and sometimes unstable. SHAP is grounded in game theory with consistency guarantees.' },
          { label: 'SHAP vs Permutation importance', text: 'Permutation importance is global only; SHAP gives both global patterns and per-prediction explanations.' },
          { label: 'SHAP vs Coefficients', text: 'Coefficients explain linear models globally; SHAP explains any model locally, including non-linear ones.' },
        ],
        keyPoints: [
          'SHAP fairly divides a prediction among features (Shapley values).',
          'Prediction = base value + sum of SHAP values (additive property).',
          'Waterfall plots explain one prediction; summary plots show global patterns.',
          'TreeExplainer is exact and fast for tree models.',
          'SHAP explains the model, not the world — it is not causal.',
          'Lead business explanations with the top 2–3 drivers in plain language.',
        ],
        questionIds: ['q-m11-shap-1', 'q-m11-shap-2', 'q-m11-shap-3'],
        skills: ['Explainability'],
      },
    ],
  },

  // ─── Module 12 — End-to-End ML Workflow ──────────────────────────────────
  {
    id: 'm12',
    number: 12,
    title: 'End-to-End ML Workflow',
    shortTitle: 'End-to-End',
    description:
      'Putting it all together: the full workflow from a vague business problem to a validated model, and the lifecycle that keeps it useful afterwards — framing, data, modelling, evaluation, and handover.',
    icon: 'flask',
    skills: ['Problem Solving', 'Deployment'],
    lessons: [
      {
        id: 'm12-end-to-end',
        moduleId: 'm12',
        title: 'The End-to-End ML Workflow',
        subtitle: 'From business problem to validated model, in order',
        minutes: 20,
        simple:
          'A real ML project follows a sequence: frame the business problem and define the target; get and explore the data; clean and engineer features; split the data; train baselines, then stronger models; evaluate with the right metric; explain the model; and hand it over with documentation. The order matters — skipping the framing step is how teams build accurate models that solve the wrong problem.',
        technical:
          'The standard workflow (CRISP-DM style): (1) Business understanding — define the decision the model will support, the target variable, the prediction point in time ("what do we know when we must predict?"), and the success metric in business terms. (2) Data understanding — profile sources, check quality, verify the target is available and correctly labelled. (3) Data preparation — cleaning, feature engineering, encoding, scaling, all inside pipelines. (4) Modelling — baselines first (dummy, logistic/linear), then stronger models (forest, boosting), with cross-validation throughout. (5) Evaluation — the chosen metric on a held-out set, error analysis (which cases fail?), slice analysis (which segments fail?), and a business-value estimate. (6) Deployment & handover — a reproducible pipeline, documentation of assumptions and decisions, and a monitoring plan. Two habits run through all of it: version your data and code (so results are reproducible), and keep a decision log (why this target, why this metric, why this threshold). Most project failures happen in step 1, not step 4.',
        interview:
          'My workflow starts with framing: what decision will this model support, what exactly is the target, and what will we know at prediction time. Then I explore and profile the data, clean and engineer features inside pipelines, and split the data before any modelling. I train baselines first — a dummy model, then logistic regression — and only then move to stronger models, evaluating everything with cross-validation and the metric that matches the business cost. Finally I do error analysis, check performance on slices, and hand over with documentation and a monitoring plan. Most failures I have seen come from skipping the framing step, not from picking the wrong algorithm.',
        analogy:
          'Building a model without the workflow is like cooking without a recipe: you might get lucky, but you cannot repeat it, explain it, or fix it when it goes wrong. The workflow is the recipe — and the framing step is deciding what dish you are even cooking before you turn on the stove.',
        realWorld:
          'A telecom team was asked to "predict churn". In framing, they discovered the real need: identify customers likely to churn in the next 30 days so the retention team can call them this week. That defined the target (churn within 30 days), the prediction point (every Monday morning), and the metric (precision at the top 500 riskiest — the team can make 500 calls a week). Without framing, the team might have built a model predicting churn "eventually", which the retention team could not act on. The project succeeded because the workflow forced the business question first.',
        code: {
          code: `import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.dummy import DummyClassifier
from sklearn.metrics import classification_report, roc_auc_score

# 1. Frame: predict churn in the next 30 days; metric = ROC-AUC + precision@500
df = pd.read_csv("customers.csv")
X = df.drop(columns=["customer_id", "churned_30d"])
y = df["churned_30d"]

# 2. Split FIRST
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

# 3. One pipeline: impute, encode, scale, model — fitted on train only
num = ["age", "monthly_spend", "tenure_months", "support_tickets"]
cat = ["plan_type", "city"]
preprocess = ColumnTransformer([
    ("num", Pipeline([("imp", SimpleImputer(strategy="median")),
                      ("sc", StandardScaler())]), num),
    ("cat", Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                      ("oh", OneHotEncoder(handle_unknown="ignore"))]), cat),
])

# 4. Baselines first, then the real model
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for name, model in [
    ("dummy", DummyClassifier(strategy="most_frequent")),
    ("forest", Pipeline([("prep", preprocess),
                         ("m", RandomForestClassifier(n_estimators=300, n_jobs=-1,
                                                      random_state=42))])),
]:
    scores = cross_val_score(model, X_train, y_train, cv=cv, scoring="roc_auc")
    print(f"{name:8s} CV AUC = {scores.mean():.3f} (+/- {scores.std():.3f})")

# 5. Evaluate once on the held-out test set + business metric
model = Pipeline([("prep", preprocess),
                  ("m", RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42))])
model.fit(X_train, y_train)
proba = model.predict_proba(X_test)[:, 1]
print("test AUC:", round(roc_auc_score(y_test, proba), 3))
print(classification_report(y_test, model.predict(X_test)))
# Business metric: precision among the 500 riskiest (the retention team's capacity)
top500 = proba.argsort()[::-1][:500]
print("precision@500:", round(y_test.iloc[top500].mean(), 3))`,
          explanation:
            'This is the whole course in one script: frame the problem, split first, build one pipeline that handles numeric and categorical columns differently, start with a dummy baseline, cross-validate, and finish with a business metric (precision among the 500 customers the team can actually call). Copy this structure for every project — it is the skeleton of professional ML work.',
        },
        mistakes: [
          'Starting with modelling before framing the business problem and the prediction point.',
          'Skipping baselines — you cannot tell whether a complex model earns its keep.',
          'Doing EDA and feature engineering on the full dataset, then splitting — leakage.',
          'Evaluating only with a global metric and never doing error or slice analysis.',
          'Handing over a notebook with no documentation of decisions, assumptions or the monitoring plan.',
        ],
        keyPoints: [
          'Frame first: decision, target, prediction point, business metric.',
          'Split before any preprocessing; keep everything in pipelines.',
          'Baselines first (dummy → simple → strong), then compare honestly.',
          'Evaluate with the business metric plus error and slice analysis.',
          'Hand over with documentation and a monitoring plan.',
          'Most failures come from framing, not from algorithm choice.',
        ],
        questionIds: ['q-m12-end-to-end-1', 'q-m12-end-to-end-2', 'q-m12-end-to-end-3'],
        skills: ['Problem Solving', 'Deployment'],
      },
      {
        id: 'm12-ml-lifecycle',
        moduleId: 'm12',
        title: 'From Business Problem to Monitored Model',
        subtitle: 'The lifecycle: what happens before, during and after the model',
        minutes: 16,
        simple:
          'A model is not a one-time deliverable; it is a living system. The lifecycle runs: define the problem, build the data, train and validate, deploy, monitor, and retrain when the world changes. Most of a model\'s life is spent in the last two stages — monitoring and retraining — which is why the best teams spend as much effort there as on the original build.',
        technical:
          'The ML lifecycle (MLOps view): (1) Problem definition and scoping with stakeholders, including the decision the model supports and the cost of errors. (2) Data acquisition and labelling — often the longest phase; label quality bounds model quality. (3) Experimentation — notebooks, baselines, feature ideas, tracked with experiment tracking (MLflow, Weights & Biases) so runs are comparable and reproducible. (4) Validation — offline metrics plus business review, fairness/slice checks, and a shadow or A/B test where possible. (5) Deployment — the model behind an API or a batch job, with input validation and fallback behaviour. (6) Monitoring — input drift, prediction drift, performance decay, and business KPIs; alerts when thresholds breach. (7) Retraining — on a schedule, on drift detection, or on performance decay, with the new model validated against the old before swapping. Governance runs across all of it: who owns the model, what data it may use, how decisions are explained, and how it is retired. A model without an owner and a monitoring plan is a liability, not an asset.',
        interview:
          'I think of a model as a living system, not a one-time deliverable. The lifecycle is: define the problem with stakeholders, get and label the data, experiment with baselines and track every run, validate offline and ideally with a shadow test, deploy behind an API or batch job, and then monitor — input drift, prediction drift, and actual performance — with a retraining plan for when the world changes. Most of a model\'s life is monitoring and retraining, so I treat those as part of the build, not an afterthought. And every model needs an owner and a retirement plan.',
        analogy:
          'Shipping a model without monitoring is like launching a ship with no crew: it might sail fine for a while, but nobody is watching for leaks, storms, or a changed coastline. The lifecycle is the crew: someone steering, someone watching the instruments, and a plan for when the weather turns.',
        realWorld:
          'A bank\'s loan model was validated at AUC 0.84 and deployed. Eighteen months later, a new lending product changed the applicant mix, input drift alerts fired, and the monitored AUC on recent loans had fallen to 0.76. Because the team had a retraining pipeline and a champion–challenger setup, they validated a retrained model offline, shadow-tested it for two weeks, and swapped it in with no downtime. A rival team with no monitoring discovered their model\'s decay only when default losses spiked — six months too late.',
        mistakes: [
          'Treating deployment as the finish line. It is the halfway point.',
          'Not tracking experiments — then nobody can reproduce the winning model or explain why it won.',
          'Deploying without a fallback. If the model fails, what does the system do?',
          'Retraining on autopilot without validating the new model against the old one.',
          'No model owner. When nobody owns it, nobody notices when it decays.',
        ],
        keyPoints: [
          'The lifecycle: define → data → experiment → validate → deploy → monitor → retrain.',
          'Track experiments (MLflow/W&B) so runs are reproducible and comparable.',
          'Validate new models against the old (champion–challenger) before swapping.',
          'Monitor drift, performance and business KPIs — with alerts.',
          'Every model needs an owner, a fallback, and a retirement plan.',
        ],
        questionIds: ['q-m12-ml-lifecycle-1', 'q-m12-ml-lifecycle-2', 'q-m12-ml-lifecycle-3'],
        skills: ['Problem Solving', 'Deployment'],
      },
    ],
  },

  // ─── Module 13 — Deployment Concepts ─────────────────────────────────────
  {
    id: 'm13',
    number: 13,
    title: 'Deployment Concepts',
    shortTitle: 'Deployment',
    description:
      'Getting a model out of the notebook and into the business: saving and serving predictions, batch vs real-time, and the monitoring that keeps a deployed model honest as the world changes around it.',
    icon: 'rocket',
    skills: ['Deployment'],
    lessons: [
      {
        id: 'm13-serving',
        moduleId: 'm13',
        title: 'Saving Models & Serving Predictions',
        subtitle: 'From notebook to production: pickle, APIs, and batch scoring',
        minutes: 16,
        simple:
          'A trained model is just an object in memory — to use it later, you save it to a file (with joblib or pickle), along with its preprocessing pipeline. Serving means making predictions available to the business: either in real time through an API (a loan application gets a score in milliseconds) or in batch (all customers are scored overnight). The saved artifact must include the whole pipeline — scaler, encoder, model — or production predictions will silently differ from training.',
        technical:
          'Serialisation: joblib.dump / pickle for sklearn objects; save the entire Pipeline, not just the estimator, so preprocessing is identical in training and production. Version the artifact with the code and data versions that produced it. Serving patterns: (1) Real-time API — the model behind an HTTP endpoint (FastAPI/Flask), scored per request, with latency budgets (typically < 100–500 ms) and input validation; (2) Batch scoring — a scheduled job scores a table of rows (nightly churn scores) and writes results to a database or dashboard; (3) Embedded — the model shipped inside an app or edge device. Key concerns: input validation (reject or handle missing/out-of-range values), the training–serving skew (any difference between training-time and serving-time preprocessing), latency and throughput, fallback behaviour when the model errors, and reproducibility (same inputs → same outputs). Containerisation (Docker) and model registries (MLflow) are the standard tooling for repeatable serving.',
        interview:
          'To deploy a model I save the entire pipeline — preprocessing plus estimator — with joblib, so production applies exactly the same transformations as training. Then I choose the serving pattern: a real-time API with FastAPI when predictions are needed per request, like loan scoring, or a batch job when scores can be computed overnight, like weekly churn scores. I validate inputs at the API, plan a fallback for when the model errors, and I watch for training–serving skew — any difference between how data was prepared in training versus production, which is a classic source of silent failures.',
        analogy:
          'Saving a model is like freezing a cooked meal: you preserve the finished dish so it can be reheated later. But you must freeze the whole meal — the model plus its preprocessing — not just the main course. Serving is the restaurant: real-time API is à la carte (cooked to order), batch scoring is the buffet prepared in advance. Training–serving skew is reheating with a different recipe and wondering why it tastes wrong.',
        realWorld:
          'A bank serves its loan-default model through an API: when an application arrives, the API validates the inputs, runs the saved pipeline, and returns a default probability in under 200 ms. The same bank scores churn in batch every Monday: a scheduled job loads the customer table, scores all 20 lakh customers, and writes the top 500 riskiest to the retention team\'s dashboard. Both use the same saved pipeline artifact, versioned in MLflow. When a new model version is ready, it is deployed as a challenger alongside the champion, and only promoted after two weeks of shadow comparison.',
        code: {
          code: `import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# --- Train and SAVE the whole pipeline (preprocessing + model) ---
df = pd.read_csv("loans.csv")
X = df[["income", "credit_score", "loan_amount"]]
y = df["defaulted"]
model = Pipeline([
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
]).fit(X, y)
joblib.dump(model, "loan_default_v1.joblib")  # version the file!
print("saved loan_default_v1.joblib")

# --- LOAD it in a fresh process (as production would) and predict ---
loaded = joblib.load("loan_default_v1.joblib")
new_applicant = pd.DataFrame(
    [{"income": 65000, "credit_score": 720, "loan_amount": 400000}])
print("default probability:",
      round(loaded.predict_proba(new_applicant)[0, 1], 3))

# --- A minimal FastAPI service around the same artifact ---
# Save this as app.py and run: uvicorn app:app --reload
from fastapi import FastAPI
from pydantic import BaseModel

class Application(BaseModel):
    income: float
    credit_score: int
    loan_amount: float

app = FastAPI()
svc_model = joblib.load("loan_default_v1.joblib")

@app.post("/score")
def score(app_in: Application):
    row = pd.DataFrame([app_in.model_dump()])
    proba = svc_model.predict_proba(row)[0, 1]
    return {"default_probability": round(float(proba), 4)}`,
          explanation:
            'The critical habit: joblib.dump the Pipeline, not the bare estimator — the scaler travels with the model, so production preprocessing matches training exactly. The FastAPI snippet shows the real-time pattern: Pydantic validates inputs (a string where a number should be gets rejected before it reaches the model), and the endpoint returns a probability the business can act on.',
        },
        mistakes: [
          'Saving only the estimator and re-implementing preprocessing in production — the two will drift apart.',
          'Not versioning model artifacts. When v2 misbehaves, you need v1 to roll back to.',
          'No input validation at serving time — a missing or mistyped field crashes the API or, worse, produces a silent wrong score.',
          'Ignoring latency: a 500-tree forest might be too slow for a real-time endpoint.',
          'No fallback behaviour. If the model errors, the API should return a safe default or a clear error — not hang.',
        ],
        whenToUse: [
          'Real-time API: per-request decisions with latency needs (loan scoring, fraud checks).',
          'Batch scoring: periodic scores for a whole population (weekly churn, monthly risk).',
          'Embedded: on-device or offline scoring.',
        ],
        comparison: [
          { label: 'Real-time vs Batch', text: 'Real-time gives instant per-request scores but needs an always-on service; batch is simpler, cheaper, and easier to monitor, but scores go stale between runs.' },
          { label: 'joblib vs pickle', text: 'joblib is preferred for NumPy-heavy sklearn objects (faster, compressed); pickle is the general Python default. Both are Python-specific — for cross-language serving, use ONNX.' },
        ],
        keyPoints: [
          'Save the whole Pipeline (preprocessing + model), versioned.',
          'Real-time API for per-request scoring; batch jobs for periodic population scoring.',
          'Validate inputs at serving time; plan a fallback.',
          'Training–serving skew is a classic silent failure — keep preprocessing identical.',
          'Version artifacts so you can roll back.',
        ],
        questionIds: ['q-m13-serving-1', 'q-m13-serving-2', 'q-m13-serving-3'],
        skills: ['Deployment'],
      },
      {
        id: 'm13-monitoring',
        moduleId: 'm13',
        title: 'Monitoring, Drift & Retraining',
        subtitle: 'Models decay — monitoring is how you catch it before the business does',
        minutes: 16,
        simple:
          'The world changes after deployment: customer behaviour shifts, new products launch, the economy moves. When the incoming data stops looking like the training data, that is drift — and the model\'s predictions quietly get worse. Monitoring means tracking the inputs, the predictions, and (when labels arrive) the actual performance, and retraining when the numbers say the model is stale.',
        technical:
          'Drift types: (1) Data/covariate drift — the input distribution P(X) changes (e.g. a new product attracts younger customers); detected by comparing distributions (population stability index, PSI; Kolmogorov–Smirnov tests; simple mean/std tracking per feature). (2) Concept drift — the relationship P(y|X) itself changes (e.g. a recession changes what makes a borrower risky); detected only when labels arrive, via performance monitoring. (3) Prediction drift — the output distribution shifts, a useful early signal when labels are delayed. Monitoring stack: log inputs, predictions and (eventually) outcomes; track feature distributions, prediction distributions, and performance metrics on a schedule; alert on thresholds. Retraining strategies: scheduled (monthly/quarterly), triggered (drift or performance threshold breached), and continuous (automated pipelines). Always validate a retrained model against the current champion on recent data before promoting (champion–challenger), and keep the old artifact for rollback. Also monitor operational health: latency, error rates, and data-pipeline failures — a broken upstream feed looks like drift.',
        interview:
          'Models decay because the world changes. I monitor three things: input drift — whether the incoming data still looks like the training data, which I check with distribution comparisons like PSI; prediction drift — whether the output distribution has shifted; and actual performance once labels arrive. If drift or performance breaches a threshold, I retrain — but I always validate the new model against the current champion on recent data before promoting it, and I keep the old model for rollback. I also monitor operational health, because a broken data pipeline can look exactly like drift.',
        analogy:
          'Monitoring a model is like the dashboard of a car: the fuel gauge (input drift), the speedometer (prediction drift), and the engine warning light (performance decay). You do not wait for the car to break down on the highway — the dashboard tells you to service it first. Retraining is the service: new oil, same car, checked against the old parts before you drive off.',
        realWorld:
          'A credit-card fraud model ran well for a year, then PSI alerts fired on two features: transaction amounts and merchant categories had shifted after a festive-season campaign changed spending patterns. The team retrained on the last six months of data, validated the challenger against the champion on the most recent month, and promoted it — fraud catch rate recovered from 71% to 82%. In another case, a churn model\'s performance fell, but the cause was not drift at all: an upstream job had started writing nulls into a key feature. The monitoring caught it because input null rates were tracked alongside distributions.',
        code: {
          code: `import pandas as pd
import numpy as np

# --- Population Stability Index (PSI): the industry-standard drift metric ---
# PSI < 0.1: no real change. 0.1-0.25: moderate shift, watch it. > 0.25: major drift.
def psi(expected, actual, buckets=10):
    quantiles = np.unique(np.quantile(expected, np.linspace(0, 1, buckets + 1)))
    e_counts, _ = np.histogram(expected, bins=quantiles)
    a_counts, _ = np.histogram(actual, bins=quantiles)
    e_perc = np.clip(e_counts / len(expected), 1e-6, 1)
    a_perc = np.clip(a_counts / len(actual), 1e-6, 1)
    return float(np.sum((a_perc - e_perc) * np.log(a_perc / e_perc)))

train = pd.read_csv("customers_train.csv")
live = pd.read_csv("customers_live_last_week.csv")  # this week's incoming data

print("feature drift report (PSI):")
for col in ["age", "monthly_spend", "tenure_months", "support_tickets"]:
    value = psi(train[col].dropna(), live[col].dropna())
    flag = "OK" if value < 0.1 else ("WATCH" if value < 0.25 else "DRIFT!")
    print(f"  {col:18s} PSI={value:.3f}  {flag}")

# --- Prediction drift: compare score distributions train vs live ---
# (assumes a saved model; here we just show the comparison pattern)
# train_scores = model.predict_proba(train_X)[:, 1]
# live_scores = model.predict_proba(live_X)[:, 1]
# print("prediction PSI:", round(psi(train_scores, live_scores), 3))

# --- Also track the boring stuff: null rates and ranges ---
print("\\nlive null rates:"); print(live.isna().mean().round(3))`,
          explanation:
            'PSI is the metric risk teams actually use: it compares the live distribution against the training distribution bucket by bucket. The thresholds (0.1 / 0.25) are industry conventions, not laws — calibrate them to your problem. The null-rate check at the end catches the most common "drift" of all: a broken upstream pipeline.',
        },
        mistakes: [
          'Deploying a model with no monitoring at all — decay is discovered by the business, months late.',
          'Monitoring only performance. Labels arrive late (a loan default takes months); drift metrics give earlier warning.',
          'Retraining on autopilot without validating the challenger against the champion.',
          'Retraining on recent data only and forgetting older patterns — catastrophic forgetting of rare but important cases.',
          'Confusing a data-pipeline bug with drift. Check nulls and ranges before retraining.',
        ],
        keyPoints: [
          'Drift types: data drift (inputs change), concept drift (relationship changes), prediction drift (outputs change).',
          'PSI < 0.1 stable, 0.1–0.25 watch, > 0.25 major drift.',
          'Monitor inputs, predictions, performance — and operational health.',
          'Retrain on schedule or on trigger; validate challenger vs champion first.',
          'Keep the old model for rollback.',
        ],
        formulas: [
          { name: 'Population Stability Index', formula: 'PSI = Σ (actual% − expected%) * ln(actual% / expected%)' },
        ],
        questionIds: ['q-m13-monitoring-1', 'q-m13-monitoring-2', 'q-m13-monitoring-3'],
        skills: ['Deployment'],
      },
    ],
  },

  // ─── Module 14 — ML Projects ─────────────────────────────────────────────
  {
    id: 'm14',
    number: 14,
    title: 'ML Projects',
    shortTitle: 'ML Projects',
    description:
      'Turning knowledge into proof: the industry standard for an ML project — business framing, honest evaluation, explainability, and a deployed artifact — and how to present your projects in interviews so they land.',
    icon: 'graduation',
    skills: ['Problem Solving', 'Interview Readiness'],
    lessons: [
      {
        id: 'm14-project-standard',
        moduleId: 'm14',
        title: 'The Industry Project Standard',
        subtitle: 'What separates a portfolio project from a tutorial copy',
        minutes: 20,
        simple:
          'An industry-standard ML project starts from a business problem, not a dataset. It defines the target and the decision it supports, works through the full workflow — EDA, cleaning, features, baselines, tuned models, honest evaluation — and ends with something a stakeholder can use: a report, a dashboard, or a deployed model. The difference from a tutorial is the judgement: why this metric, why this threshold, what the model gets wrong, and what it is worth in business terms.',
        technical:
          'The standard has six parts. (1) Business framing: the decision, the target definition, the prediction point, the success metric and its business value. (2) Data: source and provenance, size, quality audit, leakage check (would each feature be known at prediction time?). (3) EDA: distributions, relationships, missingness, and at least one insight that changed a modelling decision. (4) Modelling: baselines first (dummy, logistic/linear), then stronger models, all cross-validated with preprocessing in pipelines; hyperparameters tuned on CV, not the test set. (5) Evaluation: the chosen metric on a held-out set, error analysis (which cases fail and why), slice analysis (performance by segment), and explainability (permutation importance or SHAP). (6) Delivery: a README that tells the story in one page, reproducible code (requirements, seeds, notebook or scripts), and ideally a deployed artifact (a Streamlit app or an API). Quality signals reviewers look for: honest numbers (no 99% accuracy claims without a leakage check), a clear statement of limitations, and business translation ("this model would save ~₹X per month"). Red flags: no baseline, no train/test split, metrics on training data, and unexplained 99% scores.',
        interview:
          'The standard I hold my projects to has six parts. First, business framing — what decision does this support, and what is the target. Second, data provenance and a leakage check on every feature. Third, EDA that actually changes a modelling decision. Fourth, baselines before complex models, all cross-validated with preprocessing in pipelines. Fifth, honest evaluation — the right metric on a held-out set, error analysis, and SHAP explanations. And sixth, delivery: a one-page README, reproducible code, and ideally a deployed app. I always state limitations and translate results into business value, because that is what separates a project from a tutorial.',
        analogy:
          'A tutorial project is a cooking-class dish: you followed the steps and it worked. An industry-standard project is running a small restaurant: you chose the menu for your customers, sourced the ingredients, priced the dishes, handled the complaints, and can explain why the numbers work. Recruiters are hiring restaurant owners, not cooking students.',
        realWorld:
          'Two candidates present churn projects. Candidate A: "I built a random forest with 94% accuracy." No baseline, no split discipline, no business context. Candidate B: "I framed churn as a 30-day prediction for the retention team, who can call 500 customers a week. My baseline was 0.71 AUC, logistic regression reached 0.78, XGBoost 0.83. Precision at the top 500 is 61%, which at the team\'s save rate is worth roughly ₹18 lakh a month. SHAP shows recency drives the predictions. Limitation: the data has no complaint-text field, which would probably add signal." Candidate B gets the interview — the numbers are lower, but the thinking is visible.',
        mistakes: [
          'Starting from a dataset instead of a business problem.',
          'No baseline — the model\'s score means nothing in a vacuum.',
          'Reporting training metrics or tuning on the test set.',
          'Hiding limitations. Stating them builds trust; hiding them destroys it when discovered.',
          'A README that only lists the tech stack. The story — problem, approach, result, value — is the README.',
          'No reproducibility: no requirements file, no seeds, no data provenance.',
        ],
        keyPoints: [
          'Start from the business problem and the decision, not the dataset.',
          'Six parts: framing, data, EDA, modelling, evaluation, delivery.',
          'Baselines first; cross-validate; tune on CV, never on test.',
          'Evaluate honestly: held-out metric, error analysis, slice analysis, SHAP.',
          'State limitations and translate results into business value.',
          'Deliver a one-page README, reproducible code, and ideally a deployed artifact.',
        ],
        questionIds: ['q-m14-project-standard-1', 'q-m14-project-standard-2', 'q-m14-project-standard-3'],
        skills: ['Problem Solving', 'Interview Readiness'],
      },
      {
        id: 'm14-portfolio',
        moduleId: 'm14',
        title: 'Presenting Projects & Interviewing on Them',
        subtitle: 'How to talk about your work so interviewers believe it',
        minutes: 18,
        simple:
          'In an interview, a project is a story with four beats: the problem and why it mattered, what you did and why (your decisions, not just your tools), the result in numbers and business terms, and what you would do differently. Interviewers probe for understanding: why this metric, why this model, what failed, what the limitations are. Honest answers about failures and trade-offs score far higher than polished claims.',
        technical:
          'The STAR-style structure for ML projects: Situation (the business problem, in one sentence), Task (what you were asked to deliver), Action (your decisions — target definition, features, baselines, model choice, metric choice — with reasons), Result (numbers plus business translation). Prepare three lengths: a 30-second pitch (problem, approach, result), a 1-minute version (adds one key decision), and a 3-minute deep dive (adds trade-offs and failures). Anticipate the tough follow-ups: "Why this metric and not accuracy?" (business cost of errors), "Why this model?" (baseline comparison), "What would you do with more data/time?" (specific next steps, not "more tuning"), "How do you know it is not leaking?" (feature audit, split discipline), "How would you deploy it?" (pipeline artifact, API or batch, monitoring). Portfolio curation: 3–5 projects beat 10 shallow ones; each should show a different skill (one classification, one regression, one unsupervised or end-to-end deployed project); GitHub repos need a README, clean notebooks, and no dead code. On LinkedIn, one post per project — the story, one chart, one lesson learned.',
        interview:
          'When I present a project, I tell it as a story: the business problem, the decisions I made and why, the result in numbers and business terms, and what I would do differently. I prepare three lengths — thirty seconds, one minute, and a deep dive — because different interviewers want different depths. I expect the tough follow-ups: why this metric, why this model, how I checked for leakage, what failed. I answer those honestly, because talking clearly about a failure shows more understanding than a polished success story.',
        analogy:
          'Presenting a project is like a chef describing a dish to a food critic: the critic does not want the recipe read aloud — they want to know why you chose those ingredients, what went wrong in the kitchen, and what you would change next time. The story of the decisions is the meal; the accuracy number is just the garnish.',
        realWorld:
          'In a real interview for a data analyst role, the interviewer asks about a churn project. The candidate who says "I used XGBoost and got 0.83 AUC" gets a follow-up: "Why XGBoost?" Silence. The candidate who says "I started with logistic regression at 0.78, tried a forest at 0.81, and XGBoost at 0.83 — but I would ship the logistic regression, because the 0.05 gain was not worth losing explainability for the retention team" gets the job. The second candidate showed judgement, not just tooling — and judgement is what the role actually requires.',
        mistakes: [
          'Reciting the tech stack instead of the decisions and trade-offs.',
          'Claiming a suspiciously high score without being able to explain the leakage check.',
          'Having no answer for "what failed" or "what would you do differently". Every real project has failures.',
          'Ten shallow projects instead of three deep ones.',
          'A GitHub repo with no README, dead code, and notebooks that do not run top to bottom.',
          'Memorising a script instead of understanding the project. Follow-up questions expose it instantly.',
        ],
        keyPoints: [
          'Structure: problem → decisions → result (numbers + business value) → what you would change.',
          'Prepare 30-second, 1-minute and 3-minute versions of each project.',
          'Expect follow-ups: why this metric, why this model, leakage check, deployment plan.',
          'Honest talk about failures and trade-offs beats polished claims.',
          '3–5 deep projects beat 10 shallow ones; each shows a different skill.',
          'GitHub: README, clean runnable code, no dead code.',
        ],
        questionIds: ['q-m14-portfolio-1', 'q-m14-portfolio-2', 'q-m14-portfolio-3'],
        skills: ['Problem Solving', 'Interview Readiness'],
      },
    ],
  },
];
