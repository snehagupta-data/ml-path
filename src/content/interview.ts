import type { InterviewQuestion } from '../types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ─── ML Fundamentals (8) ─────────────────────────────────────────────────
  {
    id: 'iq-mlfund-sup-vs-unsup-1',
    category: 'ML Fundamentals',
    question: 'What is the difference between supervised and unsupervised learning? Give a real example of each.',
    difficulty: 'Easy',
    rubricKeywords: ['labelled data', 'labels', 'predict', 'patterns', 'clustering', 'classification', 'regression', 'training data', 'target variable'],
    keyPoints: [
      'Supervised learning trains on labelled data with a known target variable',
      'Unsupervised learning finds patterns in unlabelled data without a target',
      'Classification and regression are supervised; clustering and dimensionality reduction are unsupervised',
      'Concrete examples: churn prediction is supervised, customer segmentation is unsupervised',
    ],
    commonGaps: [
      'Saying supervised means a human watches the training',
      'No concrete example for either type',
      'Forgetting that unsupervised learning has no target variable to predict',
      '!unsupervised learning predicts labels',
    ],
    modelAnswer:
      'Supervised learning trains on labelled data, where every row has a known target I want to predict — for example, predicting whether a customer will churn based on past churn labels. The model learns the mapping from features to the target, so it covers classification and regression. Unsupervised learning works on unlabelled data with no target: the model finds structure on its own, like clustering customers into segments based on buying behaviour. I choose supervised learning when I have reliable labels and a clear prediction goal, and unsupervised when I am exploring the data or there is no label to predict.',
    followUps: [
      'What is semi-supervised learning, and when would you use it?',
      'You have customer data but no churn labels — how would you still get value from it?',
      'Can you turn an unsupervised problem into a supervised one? How?',
    ],
  },
  {
    id: 'iq-mlfund-overfit-2',
    category: 'ML Fundamentals',
    question: 'What is overfitting, and how would you detect and prevent it?',
    difficulty: 'Easy',
    rubricKeywords: ['training accuracy', 'validation', 'generalization', 'memorizes', 'noise', 'regularization', 'cross-validation', 'pruning', 'more data', 'simpler model'],
    keyPoints: [
      'Overfitting means the model memorizes training data including noise instead of learning general patterns',
      'Detected by a large gap between training and validation performance',
      'Prevention includes cross-validation, regularization, simpler models, and more training data',
      'Tree-specific fixes include pruning and limiting depth',
    ],
    commonGaps: [
      'Defining it only as "high accuracy" without the train-validation gap',
      'No detection method named',
      'Forgetting that more data and regularization are the main fixes',
      '!overfitting means the model is too simple',
    ],
    modelAnswer:
      'Overfitting is when a model memorizes the training data, including its noise, instead of learning patterns that generalize. It looks great on training data but performs badly on unseen data. I detect it by comparing training and validation scores — a big gap means overfitting. To prevent it, I use cross-validation, regularization like L1 or L2 penalties, simpler models, and more training data when possible. For tree models I limit depth and prune. In my churn project, for example, an unpruned decision tree hit 99% on training but only 74% on validation, which told me it was overfitting.',
    followUps: [
      'Your validation score is much lower than training — walk me through exactly what you change first.',
      'How does regularization actually reduce overfitting, mathematically?',
      'When would you accept some overfitting?',
    ],
  },
  {
    id: 'iq-mlfund-bias-variance-3',
    category: 'ML Fundamentals',
    question: 'Explain the bias-variance tradeoff. How does it guide your model choices?',
    difficulty: 'Medium',
    rubricKeywords: ['bias', 'variance', 'underfitting', 'overfitting', 'complexity', 'generalization error', 'regularization', 'ensemble', 'training data'],
    keyPoints: [
      'Bias is error from wrong assumptions — a too-simple model underfits',
      'Variance is error from sensitivity to training data — a too-complex model overfits',
      'Total error is bias squared plus variance plus irreducible noise',
      'The tradeoff guides complexity choices: regularization and ensembles balance the two',
    ],
    commonGaps: [
      'Confusing bias with data bias or fairness bias',
      'Not linking bias to underfitting and variance to overfitting',
      'No mention of how the tradeoff changes a real modelling decision',
      '!low bias and low variance are both easy to get at once',
    ],
    modelAnswer:
      'Bias is the error from a model making wrong assumptions — a model that is too simple underfits because it cannot capture the real pattern. Variance is the error from a model being too sensitive to the specific training data — it overfits and swings wildly when the data changes. Total error is roughly bias squared plus variance plus irreducible noise. As I increase model complexity, bias falls but variance rises, so I am looking for the sweet spot. In practice this tradeoff is why I use regularization, cross-validation, and ensembles: bagging reduces variance, while boosting reduces bias.',
    followUps: [
      'Where does irreducible error come from, and can you ever reduce it?',
      'How do bagging and boosting relate to bias and variance differently?',
      'Your model has high bias — what are three concrete things you would try?',
    ],
  },
  {
    id: 'iq-mlfund-generalization-4',
    category: 'ML Fundamentals',
    question: 'How do you know your model generalizes to new data?',
    difficulty: 'Medium',
    rubricKeywords: ['holdout', 'test set', 'cross-validation', 'unseen data', 'validation', 'overfitting', 'distribution', 'performance gap', 'leakage'],
    keyPoints: [
      'Generalization is judged on data the model never saw during training or tuning',
      'A held-out test set and cross-validation give honest estimates',
      'Small train-validation gap plus stable scores across folds signals generalization',
      'Leakage and distribution shift can make generalization estimates misleading',
    ],
    commonGaps: [
      'Judging generalization from training accuracy alone',
      'Using the test set for tuning and then reporting it as unbiased',
      'Ignoring distribution shift between training and production data',
      '!high training accuracy proves the model generalizes',
    ],
    modelAnswer:
      'I never trust training performance — I judge generalization on data the model has never seen. I hold out a test set that I touch only once at the end, and I use cross-validation during development so the estimate is stable across different folds. If training and validation scores are close and the cross-validation scores do not vary much, the model is generalizing. I also check for leakage, because a leaked feature makes validation look great while the model fails in production. Finally, I watch for distribution shift: if new data looks different from training data, even a well-validated model can degrade.',
    followUps: [
      'Your cross-validation score is 92% but production accuracy is 78% — what do you investigate?',
      'What is the difference between a validation set and a test set, and why keep them separate?',
      'How would you check whether your production data has drifted from training data?',
    ],
  },
  {
    id: 'iq-mlfund-class-regress-5',
    category: 'ML Fundamentals',
    question: 'When would you frame a problem as classification versus regression? How do you decide?',
    difficulty: 'Easy',
    rubricKeywords: ['categorical', 'continuous', 'discrete', 'target variable', 'probability', 'threshold', 'classes', 'numeric prediction'],
    keyPoints: [
      'Classification predicts discrete categories; regression predicts continuous numbers',
      'The decision comes from the target variable and what the business needs',
      'Some problems can be framed either way, e.g. predicting churn probability vs churned or not',
      'Framing changes the models, metrics, and how the output is used',
    ],
    commonGaps: [
      'Saying classification is for small datasets and regression for large ones',
      'Not mentioning that the target type drives the choice',
      'No example of a problem that could be framed both ways',
      '!regression is only for linear relationships',
    ],
    modelAnswer:
      'It depends on the target variable and what the business actually needs. If the target is a category — will this customer churn, is this transaction fraud — that is classification. If the target is a continuous number — house price, next month sales — that is regression. Sometimes the same problem can be framed either way: for churn I could predict a churn probability with regression-style thinking, but usually I frame it as classification and use the predicted probability to rank customers. The framing matters because it decides the models I try, the metrics I report, and how the business acts on the output.',
    followUps: [
      'Your stakeholder wants a yes-or-no answer but also a confidence score — how do you deliver both?',
      'When would you convert a regression problem into classification, and what do you lose?',
      'How does the choice affect which evaluation metric you use?',
    ],
  },
  {
    id: 'iq-mlfund-train-test-6',
    category: 'ML Fundamentals',
    question: 'Why do we split data into training and test sets? What goes wrong if you skip it?',
    difficulty: 'Easy',
    rubricKeywords: ['unseen data', 'overfitting', 'honest estimate', 'generalization', 'test set', 'training set', 'evaluation', 'leakage'],
    keyPoints: [
      'The test set simulates unseen future data so performance estimates are honest',
      'Evaluating on training data hides overfitting and inflates scores',
      'The split must happen before preprocessing steps like scaling are fitted',
      'Stratification keeps class proportions the same in both sets for classification',
    ],
    commonGaps: [
      'Saying the split is just a convention with no real purpose',
      'Not explaining that training metrics are optimistically biased',
      'Forgetting that preprocessing fitted on all data leaks information',
      '!you can evaluate on the training set if the model is simple',
    ],
    modelAnswer:
      'We split so we can measure performance on data the model has never seen — that is the only honest estimate of how it will do in the real world. If I evaluate on the training data, the model has already memorized parts of it, so the score is inflated and overfitting stays hidden. I split before fitting any preprocessing, like scalers or imputers, because fitting them on the full data leaks information from the test set into training. For classification I use a stratified split so both sets keep the same class proportions, and I keep the test set untouched until final evaluation.',
    followUps: [
      'What split ratio would you use, and when would you change it?',
      'Why is a random split wrong for time-series data?',
      'What is stratification, and when does it matter most?',
    ],
  },
  {
    id: 'iq-mlfund-underfit-7',
    category: 'ML Fundamentals',
    question: 'Your model performs poorly on both training and test data. How do you diagnose and fix it?',
    difficulty: 'Medium',
    rubricKeywords: ['underfitting', 'high bias', 'training error', 'complexity', 'features', 'regularization', 'learning curve', 'model capacity'],
    keyPoints: [
      'Poor performance on both sets signals underfitting, or high bias',
      'Diagnose with learning curves and by comparing against a simple baseline',
      'Fixes include a more expressive model, better features, and less regularization',
      'Also check for data problems: wrong target, bad labels, or missing signal',
    ],
    commonGaps: [
      'Calling it overfitting when both scores are low',
      'Jumping to a complex model without checking the data first',
      'No diagnostic step — only listing fixes',
      '!adding more data fixes underfitting',
    ],
    modelAnswer:
      'Poor scores on both training and test data point to underfitting — the model is too simple to capture the pattern, which is high bias. First I diagnose: I check learning curves to confirm the training error itself is high, and I compare against a simple baseline to make sure the problem is even learnable. Then I fix it in order: add more informative features, try a more expressive model, and reduce regularization if it is constraining the model. I also sanity-check the data itself — a wrong target definition or noisy labels can look exactly like underfitting, and no model choice fixes that.',
    followUps: [
      'How do learning curves distinguish underfitting from overfitting?',
      'Your training error is high but you cannot add features — what now?',
      'How do you tell whether the problem is the model or the data?',
    ],
  },
  {
    id: 'iq-mlfund-when-not-ml-8',
    category: 'ML Fundamentals',
    question: 'When would you NOT use machine learning to solve a problem?',
    difficulty: 'Medium',
    rubricKeywords: ['rule-based', 'deterministic', 'heuristics', 'interpretability', 'data', 'cost', 'simple', 'labels', 'business rules'],
    keyPoints: [
      'Use rules when the logic is known, deterministic, and stable',
      'ML needs enough labelled data; without it, rules or heuristics win',
      'ML adds cost, complexity, and maintenance that must be justified',
      'High-stakes or regulated decisions may require transparent rule-based logic',
    ],
    commonGaps: [
      'Saying ML is always better if you have data',
      'No mention of maintenance cost or interpretability needs',
      'Forgetting that a simple lookup or formula can beat a model',
      '!machine learning should replace all business rules',
    ],
    modelAnswer:
      'I would not use ML when the logic is already known and deterministic — if a business rule or formula gives the exact answer, a model only adds error and maintenance cost. I also avoid ML when there is too little labelled data, because the model will just guess. Cost matters too: ML needs pipelines, monitoring, and retraining, so for a one-off or low-volume problem a heuristic is often the better business choice. Finally, in regulated or high-stakes settings where every decision must be explainable, transparent rules can beat a black-box model. ML earns its place when patterns are complex, data is plentiful, and the value outweighs the upkeep.',
    followUps: [
      'Give an example where a simple rule beat an ML model in practice.',
      'How would you convince a stakeholder who wants ML for everything?',
      'What would you do if the business insists on ML but you only have 200 labelled rows?',
    ],
  },
  // ─── Statistics (7) ──────────────────────────────────────────────────────
  {
    id: 'iq-stats-pvalue-1',
    category: 'Statistics',
    question: 'What is a p-value, and what does a p-value of 0.03 actually mean?',
    difficulty: 'Medium',
    rubricKeywords: ['null hypothesis', 'probability', 'observed data', 'significance level', '0.05', 'reject', 'statistical significance', 'evidence'],
    keyPoints: [
      'A p-value is the probability of seeing data this extreme if the null hypothesis were true',
      '0.03 means a 3% chance of such results under the null — below the common 0.05 threshold',
      'It is not the probability that the null hypothesis is true',
      'Statistical significance does not imply practical importance or a large effect',
    ],
    commonGaps: [
      'Saying the p-value is the probability the null hypothesis is true',
      'Treating 0.05 as a magic line instead of a convention',
      'Not mentioning effect size or practical significance',
      '!p-value is the probability the null hypothesis is true',
    ],
    modelAnswer:
      'A p-value is the probability of observing results at least this extreme if the null hypothesis were true. So a p-value of 0.03 means that, assuming there is actually no effect, I would see data like mine only 3% of the time. Since that is below the usual 0.05 significance level, I would reject the null and call the result statistically significant. But it does not mean there is a 97% chance the effect is real, and it says nothing about how big the effect is — a tiny effect can be significant with enough data. I always report the effect size alongside the p-value.',
    followUps: [
      'What is the difference between statistical significance and practical significance?',
      'If you run 20 tests at 0.05, how many false positives do you expect?',
      'What would you use instead of, or alongside, p-values?',
    ],
  },
  {
    id: 'iq-stats-correlation-2',
    category: 'Statistics',
    question: 'What is the difference between correlation and causation? How would you test for causation?',
    difficulty: 'Easy',
    rubricKeywords: ['correlation', 'causation', 'confounding', 'relationship', 'experiment', 'A/B test', 'randomized', 'third variable', 'spurious'],
    keyPoints: [
      'Correlation measures association; causation means one variable changes the other',
      'Confounding variables and reverse causation can create misleading correlations',
      'Randomized experiments and A/B tests are the gold standard for causation',
      'Observational data alone cannot prove causation',
    ],
    commonGaps: [
      'No example of a spurious correlation',
      'Not naming confounding variables',
      'Saying a strong correlation is enough to claim causation',
      '!correlation means causation',
    ],
    modelAnswer:
      'Correlation tells me two variables move together; causation means changing one actually changes the other. The classic trap is a confounder: ice cream sales and drownings correlate, but heat causes both. Reverse causation is another trap — maybe the outcome causes the supposed cause. To test causation properly I need an experiment, ideally a randomized A/B test, where I control who gets the treatment and compare outcomes. With purely observational data I can adjust for known confounders, but I can never fully prove causation — I can only build evidence for it.',
    followUps: [
      'You cannot run an experiment — what observational methods would you try?',
      'Give a business example where acting on a correlation would backfire.',
      'What is Simpson\'s paradox, and why should an analyst care?',
    ],
  },
  {
    id: 'iq-stats-mean-median-3',
    category: 'Statistics',
    question: 'When would you report the median instead of the mean? Give a business example.',
    difficulty: 'Easy',
    rubricKeywords: ['median', 'mean', 'skewed', 'outliers', 'robust', 'distribution', 'income', 'salary', 'average'],
    keyPoints: [
      'The mean is pulled by outliers and skew; the median is robust to both',
      'For right-skewed data like income or revenue, the median describes the typical case better',
      'Comparing mean and median reveals the direction of skew',
      'Report both, or the median with percentiles, for skewed business metrics',
    ],
    commonGaps: [
      'Saying the median is always better',
      'No business example like salary or order value',
      'Not explaining why skew moves the mean',
      '!the mean is always the best measure of average',
    ],
    modelAnswer:
      'I use the median when the data is skewed or has outliers, because the mean gets pulled toward the extreme values. Income is the classic example: a few very high earners push the average salary far above what a typical employee earns, while the median shows the middle person. The same applies to order values or revenue per customer, which are usually right-skewed. Comparing the mean and median also tells me about the skew — if the mean is well above the median, the distribution has a long right tail. In a report I usually give the median plus percentiles so stakeholders see the full picture.',
    followUps: [
      'What other summary statistics would you show alongside the median?',
      'How does skew affect a linear regression model?',
      'When is the mean actually the right choice?',
    ],
  },
  {
    id: 'iq-stats-normal-4',
    category: 'Statistics',
    question: 'What is the Central Limit Theorem, and why does it matter for analytics work?',
    difficulty: 'Medium',
    rubricKeywords: ['central limit theorem', 'sample mean', 'normal distribution', 'sample size', 'sampling distribution', 'independent', 'mean', 'standard error'],
    keyPoints: [
      'The sampling distribution of the mean approaches normal as sample size grows, regardless of the original distribution',
      'It justifies using normal-based confidence intervals and hypothesis tests',
      'Requires independent samples and a reasonably large sample size, often n above 30',
      'It applies to sample means, not to the raw data itself',
    ],
    commonGaps: [
      'Claiming the raw data becomes normal with more samples',
      'Forgetting the independence assumption',
      'Not connecting it to confidence intervals or testing',
      '!with enough data any distribution becomes normal',
    ],
    modelAnswer:
      'The Central Limit Theorem says that if I take many random samples and compute their means, the distribution of those sample means approaches a normal distribution as the sample size grows — no matter what shape the original data has. That is powerful because it lets me build confidence intervals and run hypothesis tests on averages using normal-based methods, even when the underlying data is skewed. It needs independent samples and a decent sample size, often quoted as above 30. The key point is that it is the distribution of sample means that becomes normal, not the raw data itself.',
    followUps: [
      'What happens to the standard error as sample size doubles?',
      'When does the Central Limit Theorem fail in practice?',
      'How would you explain sampling distributions to a non-technical stakeholder?',
    ],
  },
  {
    id: 'iq-stats-confidence-5',
    category: 'Statistics',
    question: 'What does a 95% confidence interval mean? What does it NOT mean?',
    difficulty: 'Medium',
    rubricKeywords: ['confidence interval', '95%', 'parameter', 'true value', 'repeated sampling', 'margin of error', 'estimate', 'uncertainty'],
    keyPoints: [
      'A 95% confidence interval means 95% of intervals from repeated sampling would contain the true parameter',
      'It does not mean there is a 95% probability the true value lies in this specific interval',
      'Wider intervals mean more uncertainty; larger samples narrow them',
      'It quantifies uncertainty around an estimate, not the range of the data',
    ],
    commonGaps: [
      'Saying there is a 95% chance the true value is inside this interval',
      'Confusing the interval with the range of the data',
      'Not mentioning how sample size affects width',
      '!95% confidence means 95% probability the true value is in the interval',
    ],
    modelAnswer:
      'A 95% confidence interval means that if I repeated the sampling process many times and built an interval each time, about 95% of those intervals would contain the true population parameter. It does not mean there is a 95% probability that this particular interval contains the true value — the true value is fixed, the interval is what varies. The width tells me about uncertainty: a wide interval means I do not know the parameter precisely, and collecting more data narrows it. I use confidence intervals to communicate uncertainty honestly instead of pretending a point estimate is exact.',
    followUps: [
      'How do confidence intervals relate to hypothesis tests?',
      'What factors make a confidence interval wider or narrower?',
      'How would you explain a confidence interval to a product manager?',
    ],
  },
  {
    id: 'iq-stats-type-errors-6',
    category: 'Statistics',
    question: 'Explain Type I and Type II errors. In a fraud detection model, which one is worse?',
    difficulty: 'Medium',
    rubricKeywords: ['type I', 'type II', 'false positive', 'false negative', 'null hypothesis', 'reject', 'power', 'significance', 'tradeoff'],
    keyPoints: [
      'Type I error is a false positive: rejecting a true null hypothesis',
      'Type II error is a false negative: failing to reject a false null',
      'The two trade off against each other at a fixed sample size',
      'In fraud detection, false negatives (missed fraud) usually cost more than false positives',
    ],
    commonGaps: [
      'Mixing up which error is false positive and which is false negative',
      'Not linking them to precision and recall in ML terms',
      'No business reasoning about which error costs more',
      '!type I and type II errors can both be reduced by lowering the threshold',
    ],
    modelAnswer:
      'A Type I error is a false positive — rejecting the null hypothesis when it is actually true, like flagging a legitimate transaction as fraud. A Type II error is a false negative — failing to reject a false null, like missing a real fraud case. At a fixed sample size they trade off: reducing one increases the other. In fraud detection, a Type II error is usually worse, because a missed fraud costs real money, while a false positive just triggers a review. That is why I would tune the model toward recall in that setting, accepting more false alarms to catch more fraud.',
    followUps: [
      'How do Type I and Type II errors map to precision and recall?',
      'How would you decide the cost tradeoff between the two errors?',
      'What is statistical power, and how do you increase it?',
    ],
  },
  {
    id: 'iq-stats-sampling-7',
    category: 'Statistics',
    question: 'What is sampling bias, and how can it ruin a model even if your code is perfect?',
    difficulty: 'Medium',
    rubricKeywords: ['sampling bias', 'representative', 'selection bias', 'population', 'random sample', 'stratified', 'generalization', 'training data'],
    keyPoints: [
      'Sampling bias means the sample systematically differs from the population it should represent',
      'A model trained on biased data learns patterns that do not hold for the real population',
      'Common causes include convenience sampling, survivorship bias, and non-response',
      'Mitigation includes random or stratified sampling and checking sample versus population distributions',
    ],
    commonGaps: [
      'Confusing sampling bias with a small sample size',
      'No example of how bias enters real data collection',
      'Not explaining that no modelling trick fixes unrepresentative data',
      '!more data automatically removes sampling bias',
    ],
    modelAnswer:
      'Sampling bias happens when the data I train on systematically differs from the population the model will serve — so the model learns patterns that are true for the sample but not for reality. A classic case is training a loan model only on approved applicants: the model never sees rejected profiles, so it cannot judge them. Survivorship bias and non-response do the same damage. No amount of tuning fixes this, because the information simply is not in the data. I prevent it with random or stratified sampling, and I always compare the sample distribution against the population on key variables before modelling.',
    followUps: [
      'How would you detect sampling bias in a dataset you inherited?',
      'What is survivorship bias? Give an example.',
      'Your training data is biased and you cannot collect more — what do you do?',
    ],
  },
  // ─── Python & Pandas (6) ─────────────────────────────────────────────────
  {
    id: 'iq-python-pandas-vs-sql-1',
    category: 'Python & Pandas',
    question: 'When would you use Pandas versus SQL for data work? How do you decide?',
    difficulty: 'Easy',
    rubricKeywords: ['pandas', 'SQL', 'database', 'in-memory', 'filtering', 'aggregation', 'joins', 'exploration', 'scale'],
    keyPoints: [
      'SQL is best for filtering, joining, and aggregating large data where it lives in the database',
      'Pandas is best for in-memory exploration, complex transformations, and modelling prep',
      'Push heavy work to SQL first, then bring a smaller result into Pandas',
      'Pandas struggles with data larger than memory; SQL handles it natively',
    ],
    commonGaps: [
      'Saying one tool is always better than the other',
      'Not mentioning that SQL runs in the database and Pandas in memory',
      'No workflow combining both tools',
      '!pandas can handle any dataset size',
    ],
    modelAnswer:
      'I use SQL when the data lives in a database and the work is filtering, joining, and aggregating — SQL does that where the data sits, without pulling everything into memory. I switch to Pandas for exploration, complex row-level transformations, and preparing data for a model, where Python gives me more flexibility. In practice I combine them: I write SQL to get a clean, aggregated extract, then load that into Pandas for analysis and modelling. The deciding factor is usually size and location — if the data is bigger than memory, SQL has to do the heavy lifting first.',
    followUps: [
      'Your Pandas operation is too slow on 10 million rows — what do you do?',
      'How would you do a window function equivalent in Pandas?',
      'When would you use Polars or Dask instead of Pandas?',
    ],
  },
  {
    id: 'iq-python-vectorization-2',
    category: 'Python & Pandas',
    question: 'What is vectorization, and why is it faster than looping over rows in Pandas?',
    difficulty: 'Medium',
    rubricKeywords: ['vectorization', 'numpy', 'loop', 'C', 'apply', 'broadcasting', 'performance', 'vectorized operations'],
    keyPoints: [
      'Vectorization applies an operation to a whole array at once instead of row by row',
      'It is faster because the loop runs in compiled C code inside NumPy, not interpreted Python',
      'Row-wise loops and apply with Python functions lose this speed advantage',
      'Examples include arithmetic on columns, np.where, and boolean masking',
    ],
    commonGaps: [
      'Saying vectorization is just a shorter way to write a loop',
      'Not explaining the C-level execution difference',
      'No concrete example of a vectorized operation',
      '!apply is vectorized',
    ],
    modelAnswer:
      'Vectorization means applying an operation to an entire array at once instead of looping row by row in Python. It is faster because the actual loop runs in compiled C code inside NumPy, while a Python for loop pays interpreter overhead on every single row — often a hundred times slower. So instead of iterating with iterrows or apply, I use native operations like df["price"] * 1.1, boolean masks, or np.where. Apply is still a Python-level loop, so it is only a small improvement. Whenever I catch myself writing a loop over a DataFrame, I look for the vectorized equivalent first.',
    followUps: [
      'How would you vectorize a conditional calculation on a column?',
      'When is apply actually acceptable?',
      'What is broadcasting in NumPy?',
    ],
  },
  {
    id: 'iq-python-groupby-3',
    category: 'Python & Pandas',
    question: 'Explain how groupby works in Pandas. How would you find the top 3 products by revenue in each region?',
    difficulty: 'Easy',
    rubricKeywords: ['groupby', 'split-apply-combine', 'aggregation', 'agg', 'transform', 'sort_values', 'head', 'group keys'],
    keyPoints: [
      'GroupBy follows split-apply-combine: split rows by keys, apply a function, combine results',
      'Use agg for multiple aggregations and transform to keep the original row count',
      'Top-N per group needs sorting within groups, e.g. groupby head after sort',
      'Grouping on NaN keys drops those rows by default',
    ],
    commonGaps: [
      'Describing groupby as just a filter',
      'Not knowing the difference between agg and transform',
      'Forgetting that NaN group keys are dropped by default',
      '!groupby sorts the data automatically',
    ],
    modelAnswer:
      'GroupBy follows a split-apply-combine pattern: Pandas splits the rows into groups based on the key columns, applies an aggregation to each group, and combines the results. For top 3 products by revenue in each region, I would group by region and product, sum revenue, sort descending within each region, and take the first three rows per group with groupby head. I use agg when I want several summaries at once, and transform when I need the result broadcast back to the original rows — for example, each row\'s share of its region total. One gotcha: rows with NaN in the group key are dropped silently by default.',
    followUps: [
      'What is the difference between agg, transform, and apply on a GroupBy object?',
      'How would you compute a running total within each group?',
      'Why is groupby on a large DataFrame slow, and how would you speed it up?',
    ],
  },
  {
    id: 'iq-python-merge-join-4',
    category: 'Python & Pandas',
    question: 'What is the difference between merge, join, and concat in Pandas? When does a merge silently duplicate rows?',
    difficulty: 'Medium',
    rubricKeywords: ['merge', 'join', 'concat', 'keys', 'index', 'inner', 'left', 'many-to-many', 'duplicates', 'validate'],
    keyPoints: [
      'Merge combines on columns, join combines on indexes, concat stacks along an axis',
      'Merge supports inner, left, right, and outer join types like SQL',
      'A many-to-many merge duplicates rows when keys repeat on both sides',
      'Use validate="one_to_one" or check row counts to catch unexpected duplication',
    ],
    commonGaps: [
      'Saying join and merge are identical',
      'Not knowing that many-to-many merges explode row counts',
      'No validation step after merging',
      '!a left merge never changes the row count',
    ],
    modelAnswer:
      'Merge combines DataFrames on shared columns, like a SQL join; join combines on indexes; concat stacks DataFrames vertically or side by side without matching keys. A merge silently duplicates rows when the key repeats on both sides — a many-to-many merge. For example, if a customer has three orders and two addresses, joining on customer ID produces six rows, and any revenue sum after that is wrong. I always check the row count before and after a merge, and I use the validate parameter, like validate="many_to_one", so Pandas raises an error instead of silently exploding the data.',
    followUps: [
      'How would you detect a many-to-many merge before it corrupts your analysis?',
      'What does the indicator parameter do in a merge?',
      'When would you use concat instead of merge?',
    ],
  },
  {
    id: 'iq-python-missing-5',
    category: 'Python & Pandas',
    question: 'How do you handle missing values in Pandas? How do you decide between dropping and imputing?',
    difficulty: 'Easy',
    rubricKeywords: ['missing values', 'NaN', 'dropna', 'fillna', 'impute', 'median', 'isna', 'missing at random', 'indicator'],
    keyPoints: [
      'First quantify missingness with isna().sum() and check whether it is random or patterned',
      'Drop rows only when missingness is small and random; dropping biased data creates bias',
      'Impute with median for skewed numerics, mode for categoricals, or a model-based approach',
      'Add a missingness indicator when the fact of being missing is itself informative',
    ],
    commonGaps: [
      'Always dropping missing rows without checking the pattern',
      'Imputing with the mean on skewed data',
      'Not checking whether missingness correlates with the target',
      '!filling missing values with zero is always safe',
    ],
    modelAnswer:
      'First I quantify it with isna().sum() and check the pattern — whether missingness is random or concentrated in certain groups, because that changes the fix. I only drop rows when the missing share is tiny and looks random; dropping biased missing data just moves the bias. Otherwise I impute: median for skewed numeric columns, mode for categorical ones, and sometimes a model-based imputation for important features. I also add a missingness indicator column when the fact that a value is missing is itself informative — like a missing income field in a loan application. And I always impute after the train-test split to avoid leakage.',
    followUps: [
      'What is the difference between MCAR, MAR, and MNAR missingness?',
      'Why is imputing before the train-test split a leakage problem?',
      'When would you use KNN or iterative imputation instead of the median?',
    ],
  },
  {
    id: 'iq-python-apply-6',
    category: 'Python & Pandas',
    question: 'Your Pandas code takes 10 minutes on a 5-million-row DataFrame. How do you make it faster?',
    difficulty: 'Medium',
    rubricKeywords: ['vectorization', 'apply', 'iterrows', 'categorical', 'dtype', 'chunking', 'parquet', 'numpy', 'profiling'],
    keyPoints: [
      'Profile first to find the actual bottleneck instead of guessing',
      'Replace row loops and apply with vectorized NumPy or Pandas operations',
      'Reduce memory with efficient dtypes, e.g. category for low-cardinality strings',
      'For data beyond memory, use chunking, Parquet, or a tool like Polars or Dask',
    ],
    commonGaps: [
      'Jumping to a bigger machine before optimizing the code',
      'Suggesting apply as the performance fix',
      'Not mentioning dtypes or memory at all',
      '!adding more RAM is the only way to speed up pandas',
    ],
    modelAnswer:
      'First I profile to find the real bottleneck instead of guessing. The usual culprit is a row-wise loop or apply with a Python function — I replace those with vectorized operations, which often gives a 10 to 100 times speedup. Next I cut memory: downcasting numeric dtypes and converting repeated strings to the category dtype can shrink a DataFrame dramatically, which also speeds up groupby. If the data still does not fit in memory, I read it in chunks or switch the file format to Parquet, which loads much faster than CSV. Only if the data is genuinely too big for one machine would I reach for Polars or Dask.',
    followUps: [
      'Why is reading a Parquet file faster than a CSV?',
      'What is the difference between category dtype and object dtype?',
      'How would you process a 50 GB file on a laptop with 8 GB of RAM?',
    ],
  },
  // ─── Preprocessing (6) ───────────────────────────────────────────────────
  {
    id: 'iq-preproc-scaling-1',
    category: 'Preprocessing',
    question: 'When do you need feature scaling, and what is the difference between StandardScaler and MinMaxScaler?',
    difficulty: 'Easy',
    rubricKeywords: ['scaling', 'StandardScaler', 'MinMaxScaler', 'standardization', 'normalization', 'gradient descent', 'distance', 'outliers', 'mean', 'standard deviation'],
    keyPoints: [
      'Scaling matters for distance-based and gradient-based models, not for tree models',
      'StandardScaler centers to mean zero and unit variance; MinMaxScaler compresses to a fixed range',
      'MinMaxScaler is sensitive to outliers; StandardScaler is less so but still affected',
      'Scalers must be fit on training data only, then applied to test data',
    ],
    commonGaps: [
      'Saying all models need scaling',
      'Not knowing which scaler is sensitive to outliers',
      'Fitting the scaler on the full dataset before splitting',
      '!tree models need feature scaling',
    ],
    modelAnswer:
      'Scaling matters for models that use distances or gradients — KNN, SVM, logistic regression, and neural networks — because a feature measured in thousands will dominate one measured in decimals. Tree models do not need it, since splits only care about ordering. StandardScaler subtracts the mean and divides by the standard deviation, giving zero mean and unit variance. MinMaxScaler compresses values into a fixed range, usually 0 to 1, but it is very sensitive to outliers because one extreme value squashes everything else. Whichever I use, I fit it on the training data only and transform the test data with the same parameters.',
    followUps: [
      'What scaler would you use if your data has heavy outliers?',
      'Why does scaling help gradient descent converge faster?',
      'Do you scale the target variable? When and why?',
    ],
  },
  {
    id: 'iq-preproc-encoding-2',
    category: 'Preprocessing',
    question: 'What is the difference between one-hot encoding and label encoding? When would each one hurt your model?',
    difficulty: 'Easy',
    rubricKeywords: ['one-hot encoding', 'label encoding', 'ordinal', 'nominal', 'dummy variables', 'cardinality', 'curse of dimensionality', 'tree'],
    keyPoints: [
      'One-hot creates a binary column per category; label encoding maps categories to integers',
      'Label encoding implies a false ordering, which misleads linear and distance-based models',
      'One-hot explodes dimensionality with high-cardinality features',
      'Label encoding is safe for ordinal categories and often fine for tree models',
    ],
    commonGaps: [
      'Saying one-hot is always better',
      'Not explaining the false-ordering problem of label encoding',
      'Ignoring high-cardinality blowup with one-hot',
      '!label encoding is fine for linear regression',
    ],
    modelAnswer:
      'One-hot encoding creates a separate binary column for each category, so no ordering is implied. Label encoding maps each category to an integer, which is compact but tells the model that category 2 is somehow between 1 and 3 — a false ordering that misleads linear and distance-based models. One-hot is the safer default for nominal categories, but it hurts when cardinality is high: a city column with 500 values becomes 500 sparse columns. Label encoding is fine for genuinely ordinal data like education level, and tree models usually handle it well because they split on thresholds rather than distances.',
    followUps: [
      'How would you encode a categorical feature with 10,000 unique values?',
      'What is target encoding, and what risk does it carry?',
      'What is the dummy variable trap?',
    ],
  },
  {
    id: 'iq-preproc-leakage-3',
    category: 'Preprocessing',
    question: 'What is data leakage, and how did you prevent it in your projects?',
    difficulty: 'Hard',
    rubricKeywords: ['data leakage', 'target leakage', 'train-test split', 'pipeline', 'future information', 'fit on training', 'validation', 'preprocessing'],
    keyPoints: [
      'Leakage is when information from outside the training set, especially the target or future, enters training',
      'Common causes include preprocessing before splitting, target-derived features, and duplicate rows across splits',
      'Prevention means splitting first, using pipelines, and checking features for target information',
      'Suspiciously high validation scores are the classic leakage symptom',
    ],
    commonGaps: [
      'Only defining leakage vaguely without a concrete example',
      'Not mentioning pipelines or split-first discipline',
      'Forgetting duplicate rows and time-based leakage',
      '!leakage only happens with the target variable',
    ],
    modelAnswer:
      'Data leakage is when information that would not be available at prediction time sneaks into training — most often the target itself, or future information. The classic cases are fitting a scaler or imputer on the full dataset before splitting, building a feature from the target, or having the same customer in both train and test sets. It makes validation scores look amazing while the model fails in production. I prevent it by splitting first and doing all preprocessing inside a scikit-learn Pipeline, so every step is fit on training data only. I also audit features for anything derived from the outcome, and I treat any suspiciously perfect score as a leakage warning, not a success.',
    followUps: [
      'Your validation AUC is 0.99 — walk me through how you would investigate leakage.',
      'How can time-series data leak even with a correct split?',
      'What is target leakage in a churn model specifically?',
    ],
  },
  {
    id: 'iq-preproc-outliers-4',
    category: 'Preprocessing',
    question: 'How do you detect and handle outliers? When should you keep them?',
    difficulty: 'Medium',
    rubricKeywords: ['outliers', 'IQR', 'z-score', 'boxplot', 'winsorize', 'clipping', 'robust', 'median', 'data entry error'],
    keyPoints: [
      'Detect outliers with boxplots, IQR rules, z-scores, or domain knowledge',
      'First check whether an outlier is an error or a real observation',
      'Options include removal, clipping or winsorizing, transformation, or robust models',
      'Keep outliers when they are genuine signal, e.g. fraud or high-value customers',
    ],
    commonGaps: [
      'Always deleting outliers without investigating them',
      'Using z-scores on heavily skewed data',
      'Not distinguishing errors from genuine extreme values',
      '!all outliers should be removed before modelling',
    ],
    modelAnswer:
      'I detect outliers with boxplots, the IQR rule, or z-scores, but the first step is always asking whether the value is an error or real. A negative age or a salary of ten billion is a data problem and I fix or remove it. A genuine extreme value — a fraud transaction, a whale customer — is signal, and deleting it would blind the model to exactly the cases that matter. For legitimate but extreme values I prefer clipping or winsorizing, or a log transform, over deletion. I also consider robust models: tree-based models and median-based statistics are far less sensitive to outliers than linear models.',
    followUps: [
      'Why is the IQR method often better than z-scores for skewed data?',
      'How do outliers affect linear regression versus a random forest?',
      'Your outlier is a real customer who spent 100x the average — what do you do?',
    ],
  },
  {
    id: 'iq-preproc-missing-5',
    category: 'Preprocessing',
    question: 'A column is 40% missing. How do you decide whether to drop it, impute it, or keep it as-is?',
    difficulty: 'Medium',
    rubricKeywords: ['missing', 'impute', 'drop', 'missingness', 'indicator', 'correlation', 'target', 'MCAR', 'MAR', 'MNAR'],
    keyPoints: [
      'Check whether missingness is random or patterned, and whether it correlates with the target',
      'A column whose missingness predicts the target carries signal worth keeping via an indicator',
      'Imputation quality degrades as the missing share grows; 40% is a judgment call',
      'Consider the column importance: a weak feature at 40% missing is usually dropped',
    ],
    commonGaps: [
      'Applying a fixed rule like "drop anything over 30% missing" with no analysis',
      'Not checking whether missingness itself predicts the target',
      'Imputing without considering that 40% imputed values dominate the column',
      '!imputation always recovers the lost information',
    ],
    modelAnswer:
      'At 40% missing I do not apply a blanket rule — I investigate first. I check whether the missingness is random or patterned, and critically whether being missing correlates with the target. In loan data, a missing income field often predicts default, so the missingness itself is signal and I would keep the column plus a missingness indicator. If the column is important and the missingness looks random, I might impute with the median or a model-based method. But if the feature is weakly predictive and 40% of it would be invented values, I drop it — imputation at that scale mostly adds noise dressed as data.',
    followUps: [
      'How would you test whether missingness correlates with the target?',
      'What is the difference between MCAR, MAR, and MNAR?',
      'When would you use iterative or KNN imputation?',
    ],
  },
  {
    id: 'iq-preproc-pipeline-6',
    category: 'Preprocessing',
    question: 'Why should preprocessing live inside a scikit-learn Pipeline instead of being done manually before modelling?',
    difficulty: 'Medium',
    rubricKeywords: ['pipeline', 'leakage', 'cross-validation', 'fit', 'transform', 'reproducible', 'ColumnTransformer', 'deployment'],
    keyPoints: [
      'A pipeline fits preprocessing on training folds only, preventing leakage during cross-validation',
      'Manual preprocessing before splitting leaks test information into training',
      'Pipelines make the workflow reproducible and deployable as a single object',
      'ColumnTransformer lets different preprocessing apply to numeric and categorical columns',
    ],
    commonGaps: [
      'Saying pipelines are only about cleaner code',
      'Not explaining the cross-validation leakage problem',
      'Forgetting that a pipeline can be saved and reused in production',
      '!preprocessing before cross-validation is fine if you split first',
    ],
    modelAnswer:
      'The main reason is leakage. If I scale or impute manually before cross-validation, those statistics are computed from data that includes the validation fold, so my scores are optimistically biased. Inside a Pipeline, every preprocessing step is fit only on the training folds and applied to the validation fold, which is the honest setup. Pipelines also make the work reproducible — the exact same steps run in training and in production — and I can save the whole pipeline as one object for deployment. With a ColumnTransformer I can apply different steps to numeric and categorical columns in the same pipeline, which keeps the code clean and the process safe.',
    followUps: [
      'What happens to your cross-validation score if you scale before splitting?',
      'How would you build a pipeline with different steps for numeric and categorical features?',
      'How does a pipeline help when you deploy the model?',
    ],
  },
  // ─── Regression (6) ──────────────────────────────────────────────────────
  {
    id: 'iq-regr-linear-assumptions-1',
    category: 'Regression',
    question: 'What are the key assumptions of linear regression, and what happens when they are violated?',
    difficulty: 'Medium',
    rubricKeywords: ['linearity', 'independence', 'homoscedasticity', 'normality', 'residuals', 'multicollinearity', 'assumptions', 'heteroscedasticity'],
    keyPoints: [
      'Linearity: the relationship between features and target is linear',
      'Independence of errors, constant variance (homoscedasticity), and roughly normal residuals',
      'No perfect multicollinearity between features',
      'Violations bias coefficients, distort p-values, or make predictions unreliable',
    ],
    commonGaps: [
      'Listing assumptions without saying how to check them',
      'Not mentioning residual plots as the main diagnostic',
      'Forgetting multicollinearity',
      '!linear regression works on any data as long as you have enough rows',
    ],
    modelAnswer:
      'Linear regression assumes the relationship is linear, the errors are independent, have constant variance — homoscedasticity — and are roughly normally distributed, plus no perfect multicollinearity between features. I check these mostly with residual plots: residuals against fitted values should show no pattern and even spread. When assumptions break, the consequences differ — non-linearity means the model misses the real pattern, heteroscedasticity makes standard errors and p-values unreliable, and multicollinearity makes individual coefficients unstable. Depending on the violation I might transform features, use robust standard errors, or switch to a model that does not need these assumptions.',
    followUps: [
      'Your residual plot shows a clear funnel shape — what does that mean and what do you do?',
      'How would you check for multicollinearity in practice?',
      'When would you transform the target variable with a log?',
    ],
  },
  {
    id: 'iq-regr-r2-2',
    category: 'Regression',
    question: 'What does R-squared tell you, and why can it be misleading?',
    difficulty: 'Easy',
    rubricKeywords: ['R-squared', 'variance explained', 'adjusted R-squared', 'overfitting', 'features', 'baseline', '1', '0'],
    keyPoints: [
      'R-squared is the fraction of target variance explained by the model',
      'It always increases when you add features, even useless ones',
      'Adjusted R-squared penalizes extra features and is better for comparing models',
      'A high R-squared does not mean the model is correct or useful',
    ],
    commonGaps: [
      'Saying R-squared measures accuracy',
      'Not knowing that adding features always raises R-squared',
      'Forgetting adjusted R-squared',
      '!a higher R-squared always means a better model',
    ],
    modelAnswer:
      'R-squared tells me what fraction of the variance in the target my model explains — 0.8 means about 80% of the variation is captured. But it is misleading in two ways: it always goes up when I add features, even random ones, so it rewards kitchen-sink models; and a high R-squared does not mean the model is right — it can hide a biased model or one that fails on new data. That is why I use adjusted R-squared when comparing models with different feature counts, and why I always pair R-squared with an error metric like RMSE on held-out data before trusting a model.',
    followUps: [
      'Can R-squared be negative? What would that mean?',
      'How do R-squared and RMSE complement each other?',
      'Would you compare R-squared across two different datasets?',
    ],
  },
  {
    id: 'iq-regr-ridge-lasso-3',
    category: 'Regression',
    question: 'What is the difference between Ridge and Lasso regression? When would you choose each?',
    difficulty: 'Medium',
    rubricKeywords: ['ridge', 'lasso', 'L1', 'L2', 'regularization', 'penalty', 'coefficients', 'feature selection', 'shrinkage', 'lambda'],
    keyPoints: [
      'Both add a penalty on coefficient size to reduce overfitting',
      'Ridge uses an L2 penalty that shrinks coefficients toward zero but keeps all features',
      'Lasso uses an L1 penalty that can shrink coefficients exactly to zero, doing feature selection',
      'Choose Lasso when you suspect many irrelevant features; Ridge when features are correlated',
    ],
    commonGaps: [
      'Mixing up which penalty is L1 and which is L2',
      'Not knowing Lasso performs feature selection',
      'Forgetting that features must be scaled before regularization',
      '!regularization increases model complexity',
    ],
    modelAnswer:
      'Both Ridge and Lasso add a penalty on the size of the coefficients to prevent overfitting. Ridge uses an L2 penalty, which shrinks all coefficients toward zero but never exactly to zero — it keeps every feature. Lasso uses an L1 penalty, which can shrink coefficients exactly to zero, so it performs feature selection automatically. I choose Lasso when I suspect many features are irrelevant and I want a sparse, interpretable model. I choose Ridge when features are correlated, because Lasso tends to arbitrarily pick one of a correlated pair while Ridge shares the weight. Either way, I scale the features first, or the penalty hits large-scale features unfairly.',
    followUps: [
      'What is Elastic Net, and when would you use it instead?',
      'How do you choose the regularization strength lambda?',
      'Why does L1 produce sparse solutions while L2 does not?',
    ],
  },
  {
    id: 'iq-regr-multicollinearity-4',
    category: 'Regression',
    question: 'What is multicollinearity, and how do you detect and handle it?',
    difficulty: 'Medium',
    rubricKeywords: ['multicollinearity', 'correlation', 'VIF', 'variance inflation factor', 'coefficients', 'unstable', 'redundant', 'drop'],
    keyPoints: [
      'Multicollinearity means features are highly correlated with each other',
      'It makes coefficient estimates unstable and hard to interpret, though predictions may still be fine',
      'Detect with a correlation matrix and VIF, where VIF above 5 or 10 is a warning',
      'Handle by dropping a redundant feature, combining features, or using Ridge regression',
    ],
    commonGaps: [
      'Saying multicollinearity ruins predictions',
      'Not naming VIF or a detection method',
      'Forgetting that interpretation, not prediction, is the main casualty',
      '!correlated features always hurt model accuracy',
    ],
    modelAnswer:
      'Multicollinearity is when two or more features are highly correlated with each other — like total spend and number of orders. It does not necessarily hurt predictions, but it makes the individual coefficients unstable and uninterpretable: small data changes can flip a coefficient sign, so I cannot trust statements like "each extra order adds X revenue". I detect it with a correlation matrix and the variance inflation factor — a VIF above 5 or 10 is a red flag. To handle it I drop one of the redundant features, combine them into a single feature, or use Ridge regression, which handles correlated features gracefully.',
    followUps: [
      'If multicollinearity does not hurt predictions, why should an analyst care?',
      'How is VIF calculated, and what threshold do you use?',
      'When would you keep both correlated features anyway?',
    ],
  },
  {
    id: 'iq-regr-residuals-5',
    category: 'Regression',
    question: 'How do you use residual plots to diagnose a regression model? What patterns do you look for?',
    difficulty: 'Medium',
    rubricKeywords: ['residuals', 'residual plot', 'pattern', 'funnel', 'homoscedasticity', 'non-linear', 'outliers', 'fitted values'],
    keyPoints: [
      'Residuals are actual minus predicted values; a good model shows random scatter around zero',
      'A curved pattern signals non-linearity the model missed',
      'A funnel shape signals heteroscedasticity, or non-constant variance',
      'Large isolated residuals flag outliers or influential points worth investigating',
    ],
    commonGaps: [
      'Not knowing what a residual is',
      'Only checking R-squared instead of looking at residuals',
      'Not linking plot patterns to specific problems',
      '!residuals should always be exactly zero',
    ],
    modelAnswer:
      'Residuals are the actual values minus the predicted values, and plotting them against the fitted values is my main diagnostic. A healthy model shows random scatter around zero with no pattern. A curved pattern means I missed non-linearity — the model needs a polynomial term or a different algorithm. A funnel shape means heteroscedasticity, where errors grow with the predicted value, which I might fix with a log transform of the target. Large isolated residuals point to outliers or influential rows worth investigating individually. I never trust a regression model on R-squared alone without looking at the residuals first.',
    followUps: [
      'Your residuals show a clear U-shape — what do you change?',
      'How would you handle heteroscedasticity in practice?',
      'What is the difference between an outlier and an influential point?',
    ],
  },
  {
    id: 'iq-regr-linear-vs-tree-6',
    category: 'Regression',
    question: 'When would you choose a linear regression over a tree-based regressor, and vice versa?',
    difficulty: 'Medium',
    rubricKeywords: ['linear regression', 'tree', 'interpretability', 'non-linear', 'interactions', 'extrapolation', 'coefficients', 'random forest', 'gradient boosting'],
    keyPoints: [
      'Linear regression wins when the relationship is roughly linear and interpretability matters',
      'Trees capture non-linear patterns and interactions automatically without feature engineering',
      'Linear models extrapolate beyond the training range; trees cannot predict outside it',
      'Trees handle mixed feature types and missing values more easily',
    ],
    commonGaps: [
      'Saying trees are always better because they are more powerful',
      'Not mentioning extrapolation as a linear model strength',
      'Forgetting interpretability as a real business requirement',
      '!tree models can extrapolate trends into the future',
    ],
    modelAnswer:
      'I choose linear regression when the relationship is roughly linear and I need interpretability — stakeholders can understand "each extra bedroom adds this much to the price" from a coefficient, and the model extrapolates sensibly beyond the training range. I choose tree-based regressors like random forests or gradient boosting when the relationship is non-linear or has interactions I do not want to hand-engineer, and when raw accuracy matters more than explanation. Trees also handle mixed feature types and missing values more gracefully. My habit is to build the linear model first as a baseline, then see whether a tree model earns its extra complexity with a clearly better validation score.',
    followUps: [
      'Why exactly can a tree model not extrapolate beyond the training data?',
      'How would you get interpretability out of a gradient boosting model?',
      'Your linear model and your tree model score the same — which do you ship?',
    ],
  },
  // ─── Classification (8) ──────────────────────────────────────────────────
  {
    id: 'iq-class-logreg-1',
    category: 'Classification',
    question: 'How does logistic regression work, and what does it actually output?',
    difficulty: 'Easy',
    rubricKeywords: ['logistic regression', 'sigmoid', 'probability', 'log odds', 'threshold', 'linear', 'coefficients', 'binary classification', 'decision boundary'],
    keyPoints: [
      'Logistic regression models the log-odds of the positive class as a linear function of features',
      'The sigmoid function converts the linear output into a probability between 0 and 1',
      'The output is a probability; a threshold, usually 0.5, converts it to a class label',
      'Coefficients show the direction and strength of each feature effect on the log-odds',
    ],
    commonGaps: [
      'Saying logistic regression outputs a class directly',
      'Confusing it with linear regression',
      'Not mentioning the sigmoid or the threshold',
      '!logistic regression is a regression algorithm',
    ],
    modelAnswer:
      'Despite the name, logistic regression is a classification algorithm. It models the log-odds of belonging to the positive class as a linear combination of the features, then passes that through the sigmoid function to produce a probability between 0 and 1. So the raw output is a probability, not a class — I apply a threshold, usually 0.5, to decide the final label, and I can move that threshold to trade precision against recall. The coefficients are interpretable: a positive coefficient means the feature increases the log-odds of the positive class. It is my default baseline for binary classification because it is fast, interpretable, and often surprisingly strong.',
    followUps: [
      'Why do we use the sigmoid function instead of predicting probabilities directly?',
      'How would you extend logistic regression to three or more classes?',
      'What happens to logistic regression if the classes are perfectly separable?',
    ],
  },
  {
    id: 'iq-class-logreg-vs-rf-2',
    category: 'Classification',
    question: 'Why would you use Logistic Regression instead of Random Forest?',
    difficulty: 'Medium',
    rubricKeywords: ['logistic regression', 'random forest', 'interpretability', 'linear', 'coefficients', 'small data', 'probabilities', 'calibration', 'baseline', 'overfitting'],
    keyPoints: [
      'Logistic regression is interpretable: coefficients explain each feature effect',
      'It works well on small datasets and when the decision boundary is roughly linear',
      'Its probabilities are usually well-calibrated compared to tree ensembles',
      'It is faster to train, easier to deploy, and a strong baseline before trying complex models',
    ],
    commonGaps: [
      'Saying random forest is always more accurate',
      'Not mentioning interpretability or calibration',
      'No scenario where logistic regression is the better business choice',
      '!logistic regression is outdated and never used in production',
    ],
    modelAnswer:
      'I would choose logistic regression when interpretability matters — its coefficients tell stakeholders exactly how each feature pushes the prediction, which a random forest cannot do directly. It also shines on small datasets, where a forest can overfit, and when the decision boundary is roughly linear, where the extra complexity buys nothing. Its predicted probabilities tend to be well-calibrated, which matters when the business acts on the probability itself, like ranking customers by churn risk. Finally, it trains fast and deploys easily. I always build it first as a baseline: if a random forest only beats it by a point, I ship the simpler model.',
    followUps: [
      'How would you check whether your logistic regression probabilities are calibrated?',
      'Your random forest beats logistic regression by 8 points — what do you do about interpretability?',
      'When would logistic regression fail badly where a forest succeeds?',
    ],
  },
  {
    id: 'iq-class-imbalance-3',
    category: 'Classification',
    question: 'What happens if your classes are imbalanced? How do you handle it?',
    difficulty: 'Medium',
    rubricKeywords: ['imbalanced', 'class imbalance', 'accuracy', 'precision', 'recall', 'resampling', 'SMOTE', 'class weights', 'stratified', 'minority class'],
    keyPoints: [
      'With imbalance, accuracy is misleading: predicting the majority class always can score high',
      'The model may ignore the minority class, which is often the important one',
      'Use precision, recall, F1, or PR-AUC instead of accuracy',
      'Fixes include class weights, resampling or SMOTE, threshold tuning, and stratified splits',
    ],
    commonGaps: [
      'Judging an imbalanced model by accuracy',
      'Resampling before the train-test split, which leaks duplicates',
      'Not mentioning class weights as the simplest fix',
      '!accuracy is fine for imbalanced data if it is above 90%',
    ],
    modelAnswer:
      'With imbalanced classes, accuracy becomes meaningless — if only 2% of customers churn, a model that predicts "nobody churns" scores 98% while being useless. The model also tends to ignore the minority class, which is usually the one the business cares about. So I switch metrics to precision, recall, F1, and PR-AUC, and I look at the confusion matrix directly. To fix it I start with class weights, which penalize mistakes on the minority class, then consider resampling or SMOTE — always applied after the split, never before, to avoid leaking duplicates into the test set. I also tune the decision threshold to hit the recall the business needs.',
    followUps: [
      'Why is resampling before the split a leakage problem?',
      'When would you prefer class weights over SMOTE?',
      'Your stakeholder only cares about accuracy — how do you convince them otherwise?',
    ],
  },
  {
    id: 'iq-class-precision-recall-4',
    category: 'Classification',
    question: 'Explain precision and recall. When would you optimize for one over the other?',
    difficulty: 'Easy',
    rubricKeywords: ['precision', 'recall', 'false positive', 'false negative', 'tradeoff', 'threshold', 'F1', 'confusion matrix'],
    keyPoints: [
      'Precision is the share of predicted positives that are truly positive',
      'Recall is the share of actual positives the model catches',
      'They trade off against each other as the threshold moves',
      'Optimize recall when missing a positive is costly, e.g. fraud; precision when false alarms are costly',
    ],
    commonGaps: [
      'Mixing up the definitions of precision and recall',
      'Not explaining the threshold tradeoff',
      'No business example for when each matters',
      '!you can maximize precision and recall at the same time',
    ],
    modelAnswer:
      'Precision answers: of everything I flagged as positive, how many were actually positive? Recall answers: of all the real positives, how many did I catch? They trade off — lowering the threshold catches more positives, raising recall, but also creates more false alarms, lowering precision. Which one I optimize depends on the cost of each error. For fraud detection or disease screening I prioritize recall, because a missed case is expensive. For something like sending a costly retention offer, I prioritize precision, because each false positive wastes money. When both matter I use the F1 score, which balances them.',
    followUps: [
      'How does moving the classification threshold change precision and recall?',
      'Give an example where high precision with low recall would be a business failure.',
      'What is the precision-recall curve, and when is it better than ROC?',
    ],
  },
  {
    id: 'iq-class-decision-tree-5',
    category: 'Classification',
    question: 'How does a decision tree decide where to split? Why do deep trees overfit?',
    difficulty: 'Medium',
    rubricKeywords: ['decision tree', 'split', 'gini', 'entropy', 'information gain', 'impurity', 'overfitting', 'pruning', 'max depth'],
    keyPoints: [
      'Trees split on the feature and threshold that most reduce impurity, measured by Gini or entropy',
      'Splitting continues until a stopping rule is met, e.g. max depth or minimum samples per leaf',
      'Deep trees memorize training data by creating tiny leaves for individual rows',
      'Pruning, max depth, and minimum samples per leaf control overfitting',
    ],
    commonGaps: [
      'Saying trees split randomly or on the most important feature overall',
      'Not naming Gini or entropy',
      'Not explaining why depth causes memorization',
      '!deeper trees always generalize better',
    ],
    modelAnswer:
      'At each node the tree tries candidate splits and picks the one that most reduces impurity — measured by Gini impurity or entropy, which quantify how mixed the classes in a node are. It keeps splitting until a stopping rule kicks in, like maximum depth or a minimum number of samples per leaf. Deep trees overfit because they keep splitting until leaves contain just a handful of rows, effectively memorizing the training data including its noise. I control that with max depth, minimum samples per leaf, and pruning — growing the tree and then cutting back branches that do not improve validation performance.',
    followUps: [
      'What is the difference between Gini impurity and entropy?',
      'How does pruning work, and how do you decide what to prune?',
      'Why are single decision trees considered high-variance models?',
    ],
  },
  {
    id: 'iq-class-random-forest-6',
    category: 'Classification',
    question: 'How does a random forest reduce overfitting compared to a single decision tree?',
    difficulty: 'Medium',
    rubricKeywords: ['random forest', 'bagging', 'bootstrap', 'random features', 'ensemble', 'variance', 'averaging', 'decorrelate', 'out-of-bag'],
    keyPoints: [
      'Random forest builds many trees on bootstrap samples of the data — bagging',
      'Each split considers only a random subset of features, decorrelating the trees',
      'Averaging many decorrelated trees reduces variance without increasing bias much',
      'Out-of-bag samples give a free validation estimate',
    ],
    commonGaps: [
      'Saying random forest just uses more trees with no explanation of why that helps',
      'Not mentioning feature randomness as the key decorrelation trick',
      'Confusing bagging with boosting',
      '!random forest reduces bias',
    ],
    modelAnswer:
      'A single decision tree is high-variance: small data changes produce a very different tree. A random forest fixes that with two kinds of randomness. First, bagging: each tree trains on a bootstrap sample, a random resample of the data with replacement. Second, at each split the tree only considers a random subset of features, which decorrelates the trees — otherwise every tree would split on the same strong feature and make the same mistakes. Averaging the predictions of many decorrelated trees cancels out their individual errors and sharply reduces variance. The samples left out of each bootstrap also give an out-of-bag error estimate for free.',
    followUps: [
      'What is the difference between bagging and boosting?',
      'How many trees are enough, and what happens if you add too many?',
      'How would you get feature importance from a random forest, and what is its weakness?',
    ],
  },
  {
    id: 'iq-class-knn-7',
    category: 'Classification',
    question: 'How does K-Nearest Neighbors work? How do you choose k, and what are its main weaknesses?',
    difficulty: 'Medium',
    rubricKeywords: ['KNN', 'nearest neighbors', 'distance', 'k', 'scaling', 'curse of dimensionality', 'lazy learner', 'Euclidean'],
    keyPoints: [
      'KNN classifies a point by the majority class of its k nearest neighbours in feature space',
      'Small k is noisy and overfits; large k smooths the boundary but can underfit',
      'Choose k with cross-validation, often starting from odd values to avoid ties',
      'Weaknesses include sensitivity to scaling, the curse of dimensionality, and slow prediction on large data',
    ],
    commonGaps: [
      'Not mentioning that features must be scaled for distance to be meaningful',
      'No explanation of the small-k versus large-k tradeoff',
      'Forgetting that KNN has no real training phase and predicts slowly',
      '!KNN works well with hundreds of features',
    ],
    modelAnswer:
      'KNN is a lazy learner: it stores the training data and, at prediction time, finds the k closest training points by distance — usually Euclidean — and takes a majority vote of their classes. Choosing k is a tradeoff: a small k like 1 follows the data closely and overfits noise, while a large k smooths the decision boundary and can underfit, so I pick k with cross-validation. Its main weaknesses are that distance is meaningless unless features are scaled, it suffers badly from the curse of dimensionality as features grow, and prediction is slow on large datasets because every prediction scans the training set. It is a good teaching model but rarely my production choice.',
    followUps: [
      'Why does KNN break down in high dimensions?',
      'How would you speed up KNN predictions on a large dataset?',
      'What distance metric would you use for categorical features?',
    ],
  },
  {
    id: 'iq-class-boosting-8',
    category: 'Classification',
    question: 'What is gradient boosting, and how is it different from a random forest?',
    difficulty: 'Hard',
    rubricKeywords: ['gradient boosting', 'boosting', 'sequential', 'residuals', 'weak learners', 'random forest', 'bagging', 'learning rate', 'XGBoost'],
    keyPoints: [
      'Boosting builds trees sequentially, each one correcting the errors of the previous ones',
      'Each new tree fits the residuals, or gradients, of the current ensemble',
      'Random forest builds trees independently in parallel and averages them — bagging',
      'Boosting reduces bias and often wins on accuracy but is more prone to overfitting and slower to train',
    ],
    commonGaps: [
      'Saying boosting and bagging are the same thing',
      'Not explaining that boosting trees are sequential and error-correcting',
      'Not mentioning the overfitting risk or learning rate',
      '!gradient boosting trains trees in parallel like random forest',
    ],
    modelAnswer:
      'Gradient boosting builds trees sequentially: each new tree is trained to correct the errors — technically the residuals or gradients — of the ensemble so far, so the model keeps improving where it is currently wrong. A random forest is the opposite approach: it builds many independent trees in parallel on bootstrap samples and averages them. That means boosting mainly reduces bias and usually achieves higher accuracy, while random forest mainly reduces variance. The tradeoff is that boosting is more prone to overfitting and slower to train, since trees cannot be built in parallel, and it needs tuning of the learning rate and tree count. Libraries like XGBoost and LightGBM are the standard implementations.',
    followUps: [
      'What does the learning rate control in gradient boosting?',
      'Why is XGBoost usually faster than a basic gradient boosting implementation?',
      'When would you pick a random forest over gradient boosting?',
    ],
  },
  // ─── Unsupervised Learning (5) ───────────────────────────────────────────
  {
    id: 'iq-unsup-kmeans-1',
    category: 'Unsupervised Learning',
    question: 'How does K-Means clustering work? What are its main assumptions and weaknesses?',
    difficulty: 'Medium',
    rubricKeywords: ['k-means', 'centroid', 'clusters', 'Euclidean distance', 'iterate', 'k', 'spherical', 'scaling', 'initialization'],
    keyPoints: [
      'K-means assigns each point to the nearest centroid, then recomputes centroids, iterating until stable',
      'You must choose k in advance; the algorithm does not discover it',
      'It assumes roughly spherical, similarly sized clusters and uses Euclidean distance',
      'Results depend on initialization and feature scaling, and outliers distort centroids',
    ],
    commonGaps: [
      'Not explaining the assign-and-update iteration',
      'Forgetting that k must be chosen beforehand',
      'Not mentioning scaling or the spherical-cluster assumption',
      '!k-means automatically finds the right number of clusters',
    ],
    modelAnswer:
      'K-means starts with k centroids, assigns every point to its nearest centroid, then recomputes each centroid as the mean of its assigned points, and repeats until the assignments stop changing. The catch is that I have to choose k in advance — the algorithm never discovers it. It also assumes clusters are roughly spherical and similarly sized, because it uses Euclidean distance, so it fails on elongated or unevenly dense clusters. Results depend on the random initialization, which is why k-means++ initialization helps, and features must be scaled or large-scale features dominate the distances. Outliers also pull centroids around, so I check for them first.',
    followUps: [
      'How does k-means++ initialization improve on random initialization?',
      'What would you use instead of k-means for non-spherical clusters?',
      'How do you handle categorical features in k-means?',
    ],
  },
  {
    id: 'iq-unsup-elbow-2',
    category: 'Unsupervised Learning',
    question: 'How do you choose the number of clusters k? Explain the elbow method and the silhouette score.',
    difficulty: 'Medium',
    rubricKeywords: ['elbow method', 'silhouette score', 'inertia', 'within-cluster sum of squares', 'k', 'cohesion', 'separation', 'diminishing returns'],
    keyPoints: [
      'The elbow method plots inertia against k and looks for the bend where gains diminish',
      'The silhouette score measures how similar a point is to its own cluster versus the nearest other cluster',
      'Silhouette ranges from -1 to 1; higher means better-defined clusters',
      'Combine metrics with business sense: clusters must be interpretable and actionable',
    ],
    commonGaps: [
      'Relying on the elbow alone when the plot has no clear bend',
      'Not knowing what the silhouette score actually measures',
      'Ignoring whether the clusters make business sense',
      '!the elbow method always gives a clear answer',
    ],
    modelAnswer:
      'I use two methods together. The elbow method plots inertia — the within-cluster sum of squared distances — against k, and I look for the bend where adding another cluster stops giving big improvements. The problem is the elbow is often unclear, so I also compute the silhouette score, which measures how close each point is to its own cluster compared with the nearest neighbouring cluster. It ranges from -1 to 1, and higher is better. But metrics are not the final word: I also check that the clusters are interpretable and useful. Five clusters a marketing team can name and act on beat eight statistically perfect ones nobody understands.',
    followUps: [
      'Your elbow plot has no clear bend — what do you do?',
      'What does a negative silhouette score for a point mean?',
      'How would you validate clusters without any labels at all?',
    ],
  },
  {
    id: 'iq-unsup-pca-3',
    category: 'Unsupervised Learning',
    question: 'What is PCA, and when would you use it? What do you lose by using it?',
    difficulty: 'Medium',
    rubricKeywords: ['PCA', 'principal components', 'variance', 'dimensionality reduction', 'eigenvectors', 'uncorrelated', 'scaling', 'interpretability'],
    keyPoints: [
      'PCA finds new uncorrelated axes, principal components, that capture maximum variance',
      'It reduces dimensionality by keeping the components that explain most variance',
      'Useful for visualization, noise reduction, and speeding up models',
      'You lose interpretability, since components are combinations of original features',
    ],
    commonGaps: [
      'Saying PCA selects the best original features',
      'Not mentioning that features must be scaled before PCA',
      'Forgetting the interpretability cost',
      '!PCA picks the most important features',
    ],
    modelAnswer:
      'PCA is a dimensionality reduction technique: it finds new axes called principal components, ordered by how much variance they capture, and I keep the top few. The first component captures the most variance, the second captures the most of what remains, and so on — and the components are uncorrelated with each other. I use it to visualize high-dimensional data in two dimensions, to reduce noise, and to speed up models. What I lose is interpretability: each component is a mixture of the original features, so I can no longer say "income drives this". Features must also be scaled first, or the largest-scale feature dominates the components.',
    followUps: [
      'How do you decide how many principal components to keep?',
      'What is the difference between PCA and feature selection?',
      'Why does PCA fail on non-linear structure, and what would you use instead?',
    ],
  },
  {
    id: 'iq-unsup-clustering-eval-4',
    category: 'Unsupervised Learning',
    question: 'There are no labels in clustering, so how do you evaluate whether your clusters are any good?',
    difficulty: 'Hard',
    rubricKeywords: ['silhouette', 'Davies-Bouldin', 'stability', 'cohesion', 'separation', 'business validation', 'profiling', 'interpretability'],
    keyPoints: [
      'Internal metrics like silhouette score and Davies-Bouldin index measure cohesion and separation',
      'Stability checks: clusters should be similar across subsamples and random seeds',
      'Profile clusters on business variables to check they are distinct and meaningful',
      'The ultimate test is whether clusters drive different actions or outcomes',
    ],
    commonGaps: [
      'Saying clustering cannot be evaluated at all',
      'Only naming the silhouette score with no other check',
      'Not profiling clusters against business variables',
      '!accuracy can be used to evaluate clustering',
    ],
    modelAnswer:
      'Without labels I evaluate on three levels. First, internal metrics: the silhouette score and Davies-Bouldin index measure how tight clusters are internally and how separated they are from each other. Second, stability: I rerun clustering on subsamples and different random seeds, and good clusters should largely survive. Third, and most important, business validation: I profile each cluster on variables the business cares about — average spend, tenure, churn rate — and check the clusters are genuinely different and actionable. If two clusters look identical on every business metric, the split is not useful no matter what the silhouette score says.',
    followUps: [
      'How would you compare k-means clusters against hierarchical clustering results?',
      'What is the Davies-Bouldin index, and what values are good?',
      'Your clusters are stable but meaningless to the business — what do you change?',
    ],
  },
  {
    id: 'iq-unsup-dbscan-5',
    category: 'Unsupervised Learning',
    question: 'What is DBSCAN, and when would you choose it over K-Means?',
    difficulty: 'Hard',
    rubricKeywords: ['DBSCAN', 'density', 'eps', 'min_samples', 'noise', 'arbitrary shape', 'k-means', 'outliers', 'clusters'],
    keyPoints: [
      'DBSCAN groups points in dense regions and labels sparse points as noise',
      'It does not require choosing k in advance and finds arbitrarily shaped clusters',
      'It needs eps (neighbourhood radius) and min_samples (density threshold) to be tuned',
      'It struggles when clusters have very different densities',
    ],
    commonGaps: [
      'Saying DBSCAN needs k like k-means',
      'Not explaining the noise-label concept',
      'Not mentioning eps and min_samples',
      '!DBSCAN works well when clusters have very different densities',
    ],
    modelAnswer:
      'DBSCAN is a density-based clustering algorithm: it groups together points that have many neighbours within a radius called eps, and labels points in sparse regions as noise instead of forcing them into a cluster. I choose it over k-means when clusters have irregular shapes — k-means can only find round blobs — and when I do not know the number of clusters in advance. It also handles outliers naturally by calling them noise. The tradeoff is tuning: eps and min_samples are sensitive, and DBSCAN struggles when clusters have very different densities, because one eps value cannot suit both a dense and a sparse cluster.',
    followUps: [
      'How would you choose eps in practice?',
      'What happens if you set min_samples too high or too low?',
      'How would you use DBSCAN for anomaly detection?',
    ],
  },
  // ─── Model Evaluation (8) ────────────────────────────────────────────────
  {
    id: 'iq-eval-accuracy-1',
    category: 'Model Evaluation',
    question: 'Why is accuracy often a bad metric? Give a concrete example.',
    difficulty: 'Easy',
    rubricKeywords: ['accuracy', 'imbalanced', 'majority class', 'precision', 'recall', 'confusion matrix', 'baseline', 'misleading'],
    keyPoints: [
      'Accuracy hides performance on the minority class when classes are imbalanced',
      'A model predicting only the majority class can score high accuracy while being useless',
      'Accuracy also ignores the cost difference between false positives and false negatives',
      'Use the confusion matrix, precision, recall, F1, or ROC-AUC instead',
    ],
    commonGaps: [
      'Saying accuracy is always bad, even on balanced data',
      'No concrete numeric example',
      'Not naming a better metric to replace it',
      '!98% accuracy means the model is excellent',
    ],
    modelAnswer:
      'Accuracy is misleading whenever the classes are imbalanced or the errors have different costs. If only 2% of transactions are fraud, a model that predicts "never fraud" gets 98% accuracy while catching zero fraud — completely useless. Accuracy also treats a false positive and a false negative as equally bad, which is rarely true in business: missing a cancer diagnosis costs far more than an extra screening. On balanced data with equal error costs, accuracy is fine. Otherwise I look at the confusion matrix and report precision, recall, F1, or ROC-AUC, depending on what the business actually cares about.',
    followUps: [
      'When is accuracy actually a reasonable metric?',
      'How would you explain to a stakeholder why you are not reporting accuracy?',
      'What metric would you use for a fraud model and why?',
    ],
  },
  {
    id: 'iq-eval-confusion-2',
    category: 'Model Evaluation',
    question: 'Walk me through a confusion matrix. How do you read it, and what does each cell mean for the business?',
    difficulty: 'Easy',
    rubricKeywords: ['confusion matrix', 'true positive', 'false positive', 'true negative', 'false negative', 'precision', 'recall', 'errors'],
    keyPoints: [
      'Rows are actual classes, columns are predicted classes, giving four cells',
      'True positives and true negatives are correct predictions; false positives and false negatives are the two error types',
      'Precision and recall are both derived from the matrix',
      'Each error cell maps to a business cost, e.g. false negatives are missed fraud cases',
    ],
    commonGaps: [
      'Mixing up false positives and false negatives',
      'Reading the matrix without connecting cells to business costs',
      'Not deriving precision or recall from it',
      '!the diagonal shows the errors',
    ],
    modelAnswer:
      'A confusion matrix compares actual versus predicted classes in four cells. True positives: I predicted churn and the customer did churn. True negatives: I predicted no churn and they stayed. False positives: I flagged a customer who did not churn — a wasted retention offer. False negatives: I missed a customer who did churn — lost revenue. The two error cells matter most, because they carry different business costs. From the matrix I derive precision — true positives over all predicted positives — and recall — true positives over all actual positives. Before I trust any single metric, I always read the matrix itself, because it shows exactly where the model fails.',
    followUps: [
      'Your false negatives cost ten times more than false positives — how does that change your threshold?',
      'How would you present a confusion matrix to a non-technical stakeholder?',
      'What does a confusion matrix look like for a three-class problem?',
    ],
  },
  {
    id: 'iq-eval-roc-auc-3',
    category: 'Model Evaluation',
    question: 'What is ROC-AUC, and what does an AUC of 0.85 mean in plain language?',
    difficulty: 'Medium',
    rubricKeywords: ['ROC', 'AUC', 'true positive rate', 'false positive rate', 'threshold', 'ranking', '0.5', 'random', 'curve'],
    keyPoints: [
      'The ROC curve plots true positive rate against false positive rate across thresholds',
      'AUC is the area under that curve, from 0.5 for random guessing to 1.0 for perfect ranking',
      'An AUC of 0.85 means the model ranks a random positive above a random negative 85% of the time',
      'ROC-AUC is threshold-independent but can be optimistic on heavily imbalanced data',
    ],
    commonGaps: [
      'Saying AUC is the same as accuracy',
      'Not explaining the ranking interpretation',
      'Forgetting that ROC-AUC can mislead on imbalanced data',
      '!AUC of 0.85 means 85% accuracy',
    ],
    modelAnswer:
      'The ROC curve plots the true positive rate against the false positive rate as I move the classification threshold from one extreme to the other. AUC is the area under that curve. In plain language, an AUC of 0.85 means that if I pick one random positive example and one random negative example, the model will rank the positive one higher 85% of the time. An AUC of 0.5 is random guessing, and 1.0 is perfect separation. It is useful because it is threshold-independent — it measures ranking quality, not one particular cutoff. The caveat is that on heavily imbalanced data it can look optimistic, so I check the precision-recall curve too.',
    followUps: [
      'When would you prefer PR-AUC over ROC-AUC?',
      'What does an AUC below 0.5 mean?',
      'How would you explain AUC to a stakeholder without any math?',
    ],
  },
  {
    id: 'iq-eval-crossval-4',
    category: 'Model Evaluation',
    question: 'What is cross-validation, and why is it better than a single train-test split?',
    difficulty: 'Easy',
    rubricKeywords: ['cross-validation', 'k-fold', 'folds', 'variance', 'reliable estimate', 'overfitting', 'stratified', 'validation'],
    keyPoints: [
      'Cross-validation trains and validates on multiple folds so every row is used for validation once',
      'It gives a more reliable performance estimate with less dependence on one lucky split',
      'The spread across folds shows how stable the model is',
      'Use stratified k-fold for classification to preserve class proportions',
    ],
    commonGaps: [
      'Saying cross-validation increases accuracy',
      'Not explaining that each row is validated exactly once',
      'Forgetting stratified folds for imbalanced classification',
      '!cross-validation replaces the need for a test set',
    ],
    modelAnswer:
      'In k-fold cross-validation I split the data into k parts, train on k minus 1 parts and validate on the remaining part, and repeat until every part has served as validation once. Then I average the scores. It is better than a single split because one split can be lucky or unlucky — the estimate depends on which rows happened to land in the test set. Cross-validation averages that luck away and the spread across folds tells me how stable the model is. For classification I use stratified folds so each fold keeps the same class proportions. It does not replace a final held-out test set, but it makes my model selection decisions far more trustworthy.',
    followUps: [
      'What is the difference between k-fold and stratified k-fold?',
      'When would you use time-series cross-validation instead?',
      'How do you choose the number of folds?',
    ],
  },
  {
    id: 'iq-eval-pr-curve-5',
    category: 'Model Evaluation',
    question: 'When is the precision-recall curve more informative than the ROC curve?',
    difficulty: 'Hard',
    rubricKeywords: ['precision-recall', 'PR curve', 'ROC', 'imbalanced', 'minority class', 'false positives', 'baseline', 'AUC'],
    keyPoints: [
      'The PR curve plots precision against recall across thresholds, focusing on the positive class',
      'ROC uses true negatives, which dominate on imbalanced data and make the curve look good',
      'With rare positives, PR-AUC reveals poor performance that ROC-AUC hides',
      'The PR baseline is the positive class rate, not 0.5',
    ],
    commonGaps: [
      'Saying the two curves are interchangeable',
      'Not explaining why true negatives inflate ROC on imbalanced data',
      'Not knowing the PR baseline is the prevalence of the positive class',
      '!ROC-AUC is always the best metric for imbalanced data',
    ],
    modelAnswer:
      'The precision-recall curve is more informative when the positive class is rare — fraud, churn, disease. ROC curves include true negatives, and when negatives dominate, the false positive rate stays tiny even while the model floods you with false alarms relative to the few real positives. So ROC-AUC can look great while the model is practically useless. The PR curve ignores true negatives entirely and focuses on the positive class: of the cases I flag, how many are real, and of the real cases, how many do I catch? One thing to remember is the baseline differs — a random PR-AUC equals the positive class rate, not 0.5, so 0.4 can be excellent when only 2% of cases are positive.',
    followUps: [
      'What does a PR-AUC of 0.3 mean if only 1% of cases are positive?',
      'How would you choose an operating threshold from a PR curve?',
      'When would ROC still be the right choice?',
    ],
  },
  {
    id: 'iq-eval-f1-6',
    category: 'Model Evaluation',
    question: 'What is the F1 score, and when would you use it instead of accuracy or AUC?',
    difficulty: 'Easy',
    rubricKeywords: ['F1', 'harmonic mean', 'precision', 'recall', 'imbalanced', 'balance', 'threshold', 'classification'],
    keyPoints: [
      'F1 is the harmonic mean of precision and recall',
      'The harmonic mean punishes extreme imbalance between precision and recall',
      'Useful when both false positives and false negatives matter and classes are imbalanced',
      'It depends on a chosen threshold, unlike AUC',
    ],
    commonGaps: [
      'Calling F1 a simple average of precision and recall',
      'Not knowing why the harmonic mean is used',
      'Using F1 when only one error type matters',
      '!F1 is threshold-independent like AUC',
    ],
    modelAnswer:
      'The F1 score is the harmonic mean of precision and recall — it combines both into one number. The harmonic mean matters because it punishes extreme imbalance: if precision is 1.0 but recall is 0.1, the F1 is only about 0.18, while a simple average would misleadingly give 0.55. I use F1 when both false positives and false negatives matter and the classes are imbalanced, so accuracy is useless. The difference from AUC is that F1 is computed at one specific threshold, so it answers "how good is this operating point", while AUC answers "how good is the ranking overall". If the business cares much more about one error type, I weight F1 or pick precision or recall directly.',
    followUps: [
      'Why use the harmonic mean instead of the arithmetic mean?',
      'What is the F-beta score, and when would you use it?',
      'Your F1 is high but the business is unhappy — what could be wrong?',
    ],
  },
  {
    id: 'iq-eval-overfit-detect-7',
    category: 'Model Evaluation',
    question: 'How do you detect overfitting during evaluation, and what do you do about it?',
    difficulty: 'Medium',
    rubricKeywords: ['overfitting', 'training score', 'validation score', 'gap', 'learning curve', 'cross-validation', 'regularization', 'simpler model'],
    keyPoints: [
      'Overfitting shows as a large gap between training and validation performance',
      'Learning curves show the gap growing as training data or complexity increases',
      'High variance across cross-validation folds is another symptom',
      'Fixes include regularization, simpler models, more data, and early stopping',
    ],
    commonGaps: [
      'Only checking a single test score',
      'Not using learning curves',
      'Suggesting more features as a fix for overfitting',
      '!overfitting means the validation score is too high',
    ],
    modelAnswer:
      'The clearest signal is a large gap between training and validation scores — the model performs well on data it has seen and badly on data it has not. I confirm it with learning curves: as I add training data or complexity, the training score stays high while the validation score plateaus or falls. High variance across cross-validation folds is another symptom. To fix it I work through the standard levers: add regularization, simplify the model, get more training data, or use early stopping for iterative models. I also check for leakage, because leakage can mask overfitting by inflating the validation score too.',
    followUps: [
      'How do you read a learning curve to decide between more data and a simpler model?',
      'What is early stopping, and how do you choose when to stop?',
      'Your training and validation scores are both low — is that overfitting?',
    ],
  },
  {
    id: 'iq-eval-regression-metrics-8',
    category: 'Model Evaluation',
    question: 'When would you use MAE, RMSE, or MAPE to evaluate a regression model?',
    difficulty: 'Medium',
    rubricKeywords: ['MAE', 'RMSE', 'MAPE', 'mean absolute error', 'root mean squared error', 'outliers', 'percentage', 'units'],
    keyPoints: [
      'MAE is the average absolute error in the original units and is robust to outliers',
      'RMSE squares errors, so it penalizes large mistakes more heavily',
      'MAPE expresses error as a percentage, which is intuitive but breaks near zero values',
      'Choose based on what the business penalizes: typical error, large errors, or relative error',
    ],
    commonGaps: [
      'Saying the three metrics are interchangeable',
      'Not knowing RMSE penalizes large errors more',
      'Forgetting MAPE fails when actual values are near zero',
      '!RMSE is always better than MAE',
    ],
    modelAnswer:
      'MAE is the average absolute error in the original units — easy to explain, like "on average we are off by 400 rupees", and it treats all errors equally. RMSE squares the errors before averaging, so it punishes large mistakes much more; I use it when a few big errors are worse than many small ones. MAPE expresses error as a percentage, which stakeholders love, but it breaks when actual values are near zero and it penalizes over- and under-prediction asymmetrically. My choice depends on the business cost: for house prices I might report MAE for interpretability and RMSE to catch big misses, and I use MAPE only when the target is safely far from zero.',
    followUps: [
      'Why does MAPE penalize over-prediction and under-prediction differently?',
      'Your RMSE is much larger than your MAE — what does that tell you?',
      'How would you explain RMSE to a non-technical stakeholder?',
    ],
  },
  // ─── Feature Engineering (5) ─────────────────────────────────────────────
  {
    id: 'iq-feat-what-1',
    category: 'Feature Engineering',
    question: 'What is feature engineering, and can you give an example where it mattered more than the model choice?',
    difficulty: 'Easy',
    rubricKeywords: ['feature engineering', 'domain knowledge', 'transform', 'interactions', 'ratios', 'aggregations', 'signal', 'raw features'],
    keyPoints: [
      'Feature engineering creates new informative features from raw data using domain knowledge',
      'Good features expose signal the model cannot easily find itself',
      'Examples include ratios, time-based aggregates, and interaction terms',
      'Feature quality often matters more than algorithm choice',
    ],
    commonGaps: [
      'Describing feature engineering as just cleaning data',
      'No concrete example with a measurable effect',
      'Saying the model choice always matters more',
      '!feature engineering is just renaming columns',
    ],
    modelAnswer:
      'Feature engineering is creating new features from raw data that expose signal the model cannot easily find on its own. In my churn project, the raw data had transaction dates and amounts, but the feature that mattered most was "days since last purchase" — a simple transformation that captured recency directly. Adding recency, frequency, and monetary aggregates lifted the model far more than switching from logistic regression to gradient boosting ever did. That is the general lesson: models can only learn from what the features express. Domain knowledge tells me which transformations matter, and that is often where the real performance gains live.',
    followUps: [
      'How do you come up with new features for a domain you do not know well?',
      'What is the risk of creating too many features?',
      'How would you test whether a new feature actually helps?',
    ],
  },
  {
    id: 'iq-feat-selection-2',
    category: 'Feature Engineering',
    question: 'How do you decide which features to keep and which to drop?',
    difficulty: 'Medium',
    rubricKeywords: ['feature selection', 'importance', 'correlation', 'univariate', 'recursive', 'permutation importance', 'variance', 'domain knowledge'],
    keyPoints: [
      'Start with domain knowledge and EDA: drop constant, duplicate, or leaking features',
      'Filter methods rank features by correlation or statistical tests',
      'Model-based methods include feature importance and recursive feature elimination',
      'Validate the final set with cross-validation, not on the test set',
    ],
    commonGaps: [
      'Dropping features based only on correlation with the target',
      'Doing feature selection on the full dataset before splitting',
      'Keeping a feature that leaks the target',
      '!more features always improve the model',
    ],
    modelAnswer:
      'I start with the obvious cuts: constant features, exact duplicates, and anything that leaks the target. Then I use EDA and domain knowledge to shortlist candidates. For ranking I use filter methods like correlation with the target, and model-based methods like permutation importance or recursive feature elimination, which show what the model actually relies on. I am careful to do selection inside the cross-validation loop or on training data only, because selecting on the full dataset leaks information. The final test is simple: does the smaller feature set hold up on validation? If dropping twenty features costs nothing, I keep the simpler model.',
    followUps: [
      'What is permutation importance, and why is it better than built-in importance?',
      'Why is feature selection before the split a leakage problem?',
      'When would you keep a feature that looks useless on its own?',
    ],
  },
  {
    id: 'iq-feat-target-encoding-3',
    category: 'Feature Engineering',
    question: 'What is target encoding, and what makes it dangerous?',
    difficulty: 'Hard',
    rubricKeywords: ['target encoding', 'mean encoding', 'leakage', 'overfitting', 'cross-validation', 'smoothing', 'high cardinality', 'categorical'],
    keyPoints: [
      'Target encoding replaces a category with the mean target value for that category',
      'It is powerful for high-cardinality categoricals where one-hot fails',
      'It leaks the target into features if computed on the same rows being trained',
      'Safe practice uses out-of-fold encoding and smoothing for rare categories',
    ],
    commonGaps: [
      'Describing target encoding without mentioning leakage',
      'Not knowing about out-of-fold encoding',
      'Forgetting that rare categories get noisy estimates',
      '!target encoding is safe if you do it after the train-test split',
    ],
    modelAnswer:
      'Target encoding replaces each category with the average target value for that category — so a city column becomes the average churn rate of each city. It is powerful for high-cardinality categoricals where one-hot encoding would explode into hundreds of columns. The danger is leakage: if I compute the encoding from the same rows I train on, the feature contains information about the target I am trying to predict, and validation scores become fantasy. The safe way is out-of-fold encoding — compute each fold\'s encoding from the other folds only — plus smoothing, so rare categories shrink toward the global mean instead of getting a noisy estimate from two rows.',
    followUps: [
      'How does out-of-fold encoding prevent leakage exactly?',
      'What is smoothing in target encoding, and how do you choose the smoothing strength?',
      'When would you choose target encoding over one-hot or embeddings?',
    ],
  },
  {
    id: 'iq-feat-date-4',
    category: 'Feature Engineering',
    question: 'You have a timestamp column. What features would you engineer from it, and why?',
    difficulty: 'Easy',
    rubricKeywords: ['datetime', 'day of week', 'month', 'hour', 'seasonality', 'cyclical', 'sin cos', 'recency', 'time since', 'holiday'],
    keyPoints: [
      'Extract calendar parts: hour, day of week, month, quarter, weekend flag',
      'Encode cyclical features with sine and cosine so December and January are close',
      'Compute time-since features like days since last purchase or account age',
      'Add holiday and seasonality flags where the business has calendar effects',
    ],
    commonGaps: [
      'Only extracting the year or month',
      'Treating month as a plain number from 1 to 12',
      'Forgetting time-since and recency features',
      '!timestamps can be used directly as a numeric feature',
    ],
    modelAnswer:
      'A raw timestamp is almost useless to a model, so I break it down. First, calendar parts: hour of day, day of week, month, quarter, and a weekend flag — these capture daily and weekly patterns. Second, I encode cyclical features with sine and cosine transforms, because month 12 and month 1 are neighbours in reality but far apart as plain numbers. Third, time-since features: days since last purchase, account age, time since first order — these are often the most predictive features in churn and retention work. Finally, I add holiday flags and seasonality indicators when the business has calendar effects, like festival-season sales spikes.',
    followUps: [
      'Why does encoding month as 1 to 12 mislead a model?',
      'How would you engineer features from a timestamp for a forecasting model?',
      'What time-based features would you build for a loan default model?',
    ],
  },
  {
    id: 'iq-feat-domain-5',
    category: 'Feature Engineering',
    question: 'How do you use domain knowledge to create features? Give an example from e-commerce or finance.',
    difficulty: 'Medium',
    rubricKeywords: ['domain knowledge', 'RFM', 'recency', 'frequency', 'monetary', 'ratios', 'aggregations', 'business logic', 'customer lifetime'],
    keyPoints: [
      'Domain knowledge identifies which behaviours and ratios actually drive the outcome',
      'RFM features — recency, frequency, monetary — summarize customer value in e-commerce',
      'Ratios like debt-to-income or discount depth capture business logic in one number',
      'Talking to stakeholders and studying the business process reveals features data alone will not suggest',
    ],
    commonGaps: [
      'Only listing generic transformations with no domain example',
      'Not explaining why RFM works as a feature set',
      'Saying domain knowledge does not matter because models learn everything',
      '!domain knowledge is unnecessary if you have enough data',
    ],
    modelAnswer:
      'Domain knowledge tells me what actually drives the outcome, so I can encode it directly instead of hoping the model discovers it. In e-commerce, RFM features — recency of last purchase, frequency of orders, and monetary value — summarize a customer\'s whole relationship in three numbers, and they are consistently among the strongest churn predictors. In lending, a debt-to-income ratio captures affordability in one feature far better than raw income and loan amount separately. I get these ideas by talking to stakeholders, reading how the business process works, and asking "what would a human expert look at?" That question reliably produces better features than any automated method.',
    followUps: [
      'How would you build RFM features in SQL?',
      'You know nothing about the insurance domain — how do you still engineer good features?',
      'When would an automated feature engineering tool beat hand-crafted features?',
    ],
  },
  // ─── Model Selection (5) ─────────────────────────────────────────────────
  {
    id: 'iq-select-how-choose-1',
    category: 'Model Selection',
    question: 'How do you choose between different models for a problem?',
    difficulty: 'Medium',
    rubricKeywords: ['baseline', 'cross-validation', 'metric', 'business', 'interpretability', 'complexity', 'validation', 'benchmark', 'tradeoff'],
    keyPoints: [
      'Start with a simple baseline to set the bar any model must beat',
      'Define the evaluation metric from the business goal before comparing models',
      'Compare candidates with cross-validation on the same folds and metric',
      'Weigh accuracy against interpretability, training cost, and deployment constraints',
    ],
    commonGaps: [
      'Picking the model with the highest score with no other consideration',
      'Comparing models on different splits or metrics',
      'Skipping the baseline entirely',
      '!the model with the highest validation score is always the right choice',
    ],
    modelAnswer:
      'I start by defining the metric from the business goal — for churn that might be recall at a fixed precision, not accuracy. Then I build a simple baseline, usually logistic regression, to set the bar. I compare candidates with cross-validation on the same folds and the same metric, so the comparison is fair. But the highest score does not automatically win: I weigh it against interpretability, training time, and deployment constraints. If a gradient boosting model beats logistic regression by one point but nobody can explain its decisions to a regulator, I ship the simpler model. Model selection is a business decision, not just a leaderboard.',
    followUps: [
      'Two models score within 0.5% of each other — how do you break the tie?',
      'How do you make sure a model comparison is fair?',
      'When would you choose a worse-scoring model on purpose?',
    ],
  },
  {
    id: 'iq-select-baseline-2',
    category: 'Model Selection',
    question: 'Why do you always start with a simple baseline model? What makes a good baseline?',
    difficulty: 'Easy',
    rubricKeywords: ['baseline', 'benchmark', 'simple', 'majority class', 'logistic regression', 'sanity check', 'improvement', 'reference'],
    keyPoints: [
      'A baseline sets the minimum bar: a complex model must beat it to justify itself',
      'It catches pipeline bugs — if the baseline fails, the data or setup is wrong',
      'Good baselines include majority-class prediction, simple heuristics, and logistic regression',
      'It gives stakeholders a reference point for the value the ML adds',
    ],
    commonGaps: [
      'Saying baselines waste time',
      'Not mentioning that baselines catch data and pipeline bugs',
      'No example of what a baseline actually is',
      '!you should start with the most powerful model available',
    ],
    modelAnswer:
      'A baseline sets the bar that any complex model has to clear — if gradient boosting barely beats logistic regression, the extra complexity is not worth it. It is also a sanity check on my whole pipeline: if even a simple model performs terribly, the problem is probably the data or my setup, not the algorithm. A good baseline is dead simple: predict the majority class, use a business heuristic, or fit a logistic regression. It also gives stakeholders a reference point — I can say "the model improves on the naive approach by this much", which is far more convincing than a raw accuracy number with no context.',
    followUps: [
      'Your complex model loses to the baseline — what do you do?',
      'What baseline would you use for a forecasting problem?',
      'How do you present baseline comparisons to stakeholders?',
    ],
  },
  {
    id: 'iq-select-tuning-3',
    category: 'Model Selection',
    question: 'What is hyperparameter tuning, and what is the difference between grid search and random search?',
    difficulty: 'Medium',
    rubricKeywords: ['hyperparameter', 'grid search', 'random search', 'cross-validation', 'parameters', 'search space', 'tuning', 'validation'],
    keyPoints: [
      'Hyperparameters are settings chosen before training, unlike parameters learned from data',
      'Grid search tries every combination in a defined grid — exhaustive but expensive',
      'Random search samples combinations randomly and is more efficient in high dimensions',
      'Tuning must use cross-validation, and the test set stays untouched until the end',
    ],
    commonGaps: [
      'Confusing hyperparameters with learned parameters',
      'Not knowing why random search beats grid search in high dimensions',
      'Tuning on the test set',
      '!more hyperparameter combinations always means a better model',
    ],
    modelAnswer:
      'Hyperparameters are the settings I choose before training — like tree depth or regularization strength — as opposed to parameters the model learns from data, like coefficients. Grid search tries every combination in a grid I define: exhaustive, but the cost explodes as I add dimensions. Random search samples combinations randomly, which is usually more efficient, because most hyperparameters matter little and random search explores the important ones more thoroughly for the same budget. Either way I evaluate each combination with cross-validation, and I keep the test set untouched — tuning on the test set is just overfitting to it by hand.',
    followUps: [
      'When would you use Bayesian optimization instead of random search?',
      'How do you decide the search ranges for a hyperparameter?',
      'Can hyperparameter tuning cause overfitting? How?',
    ],
  },
  {
    id: 'iq-select-nested-cv-4',
    category: 'Model Selection',
    question: 'What is nested cross-validation, and when do you need it?',
    difficulty: 'Hard',
    rubricKeywords: ['nested cross-validation', 'inner loop', 'outer loop', 'tuning', 'unbiased estimate', 'model selection', 'overfitting', 'generalization'],
    keyPoints: [
      'Nested CV has an outer loop for evaluation and an inner loop for tuning',
      'It prevents tuning from leaking into the performance estimate',
      'Regular CV with tuning on the same folds gives optimistically biased scores',
      'It is expensive, so it matters most when data is small and honest estimates are critical',
    ],
    commonGaps: [
      'Saying nested CV is just cross-validation with more folds',
      'Not explaining the inner versus outer loop roles',
      'Not mentioning the computational cost',
      '!nested cross-validation is the same as regular cross-validation',
    ],
    modelAnswer:
      'Nested cross-validation separates model selection from evaluation. The outer loop splits the data into folds for honest evaluation; inside each outer training fold, an inner cross-validation loop does the hyperparameter tuning. That way the hyperparameters are never chosen using the data they are evaluated on. With plain cross-validation, if I tune on the same folds I report, the score is optimistically biased — I have effectively overfit to the validation data. Nested CV fixes that, at the cost of much more compute, since I train many models per outer fold. I use it when the dataset is small and I need a trustworthy estimate, not for every project.',
    followUps: [
      'How many models do you train in a 5x5 nested cross-validation?',
      'What is the alternative to nested CV when compute is limited?',
      'How would you explain nested CV to someone who only knows train-test split?',
    ],
  },
  {
    id: 'iq-select-simple-vs-complex-5',
    category: 'Model Selection',
    question: 'A simple model and a complex model perform almost the same. Which do you ship, and why?',
    difficulty: 'Medium',
    rubricKeywords: ['simple', 'complex', 'interpretability', 'Occam', 'maintainability', 'deployment', 'robustness', 'tradeoff', 'production'],
    keyPoints: [
      'Ship the simpler model when performance is close — Occam\'s razor',
      'Simple models are easier to explain, debug, monitor, and maintain',
      'Complex models carry more failure modes and retraining cost',
      'The small accuracy gap rarely justifies the operational burden',
    ],
    commonGaps: [
      'Always shipping the higher-scoring model regardless of the gap',
      'Not mentioning maintenance or monitoring costs',
      'No consideration of explainability requirements',
      '!a 0.3% accuracy gain always justifies a complex model',
    ],
    modelAnswer:
      'I ship the simpler model. When the performance gap is tiny, the complex model\'s extra accuracy rarely justifies its costs: it is harder to explain to stakeholders, harder to debug when it fails, more expensive to retrain and monitor, and more fragile when the data shifts. A logistic regression I can explain in one sentence and retrain in seconds beats a tuned ensemble that nobody on the team fully understands. I would only take the complex model if the gap were large enough to matter in business terms — and I would quantify that in rupees or customers saved, not in decimal points of AUC, before deciding.',
    followUps: [
      'How big does the performance gap need to be before you switch to the complex model?',
      'How would you quantify the business value of a 1% accuracy improvement?',
      'What risks does a complex model carry in production that a simple one does not?',
    ],
  },
  // ─── SQL + ML (4) ────────────────────────────────────────────────────────
  {
    id: 'iq-sql-features-1',
    category: 'SQL + ML',
    question: 'How would you use SQL to build features for a churn model from a transactions table?',
    difficulty: 'Medium',
    rubricKeywords: ['SQL', 'aggregation', 'GROUP BY', 'window functions', 'recency', 'frequency', 'monetary', 'features', 'JOIN'],
    keyPoints: [
      'Aggregate transactions per customer with GROUP BY to build RFM features',
      'Use MAX(order_date) for recency, COUNT for frequency, SUM for monetary value',
      'Window functions compute rolling behaviour without collapsing rows',
      'Join the feature table to the customer table on customer ID at the right grain',
    ],
    commonGaps: [
      'Only naming GROUP BY with no specific features',
      'Not mentioning window functions',
      'Forgetting the grain — one row per customer for a churn model',
      '!SQL cannot build machine learning features',
    ],
    modelAnswer:
      'I would build one row per customer with GROUP BY on the customer ID. Recency comes from MAX(order_date) compared with a cutoff date, frequency from COUNT of orders, and monetary value from SUM of order amounts — the classic RFM features. I would add average order value, distinct product categories, and the share of discounted orders. Window functions help for rolling behaviour, like orders in the last 30 days, without collapsing the table first. Then I join this feature table to the customer table on customer ID. The key discipline is the grain: exactly one row per customer, and every feature computed only from data before the prediction date.',
    followUps: [
      'How would you compute a 30-day rolling order count in SQL?',
      'What goes wrong if your feature table has two rows for one customer?',
      'How do you make sure your SQL features use only data from before the cutoff date?',
    ],
  },
  {
    id: 'iq-sql-aggregates-2',
    category: 'SQL + ML',
    question: 'What are window functions, and how do they help in feature engineering for ML?',
    difficulty: 'Medium',
    rubricKeywords: ['window functions', 'OVER', 'PARTITION BY', 'ROW_NUMBER', 'LAG', 'RANK', 'running total', 'aggregation'],
    keyPoints: [
      'Window functions compute aggregates over a window of rows without collapsing them',
      'PARTITION BY defines the group and ORDER BY defines the sequence within it',
      'LAG and LEAD access previous and next rows for time-based features',
      'ROW_NUMBER and RANK identify first or latest events per entity',
    ],
    commonGaps: [
      'Confusing window functions with GROUP BY',
      'Not naming LAG, LEAD, or ROW_NUMBER',
      'No ML feature example',
      '!window functions reduce the number of rows like GROUP BY',
    ],
    modelAnswer:
      'Window functions compute a value over a set of related rows — a window — without collapsing them into one row the way GROUP BY does. PARTITION BY defines the group, like one customer, and ORDER BY defines the sequence inside it, like order date. That makes them perfect for ML features: LAG gives me the previous order amount so I can compute the change between orders, ROW_NUMBER identifies each customer\'s first or most recent order, and a running SUM with a frame gives rolling 30-day spend. These per-row features capture behaviour over time in a way plain aggregations cannot, and they keep the row-level detail the model needs.',
    followUps: [
      'What is the difference between RANK, DENSE_RANK, and ROW_NUMBER?',
      'How would you compute days between consecutive orders using LAG?',
      'When would you use a window function instead of a self-join?',
    ],
  },
  {
    id: 'iq-sql-joins-3',
    category: 'SQL + ML',
    question: 'You join a customers table to an orders table and your row count explodes. What happened, and how do you fix it?',
    difficulty: 'Easy',
    rubricKeywords: ['JOIN', 'one-to-many', 'fanout', 'duplicates', 'aggregation', 'grain', 'primary key', 'COUNT', 'DISTINCT'],
    keyPoints: [
      'A one-to-many join fans out: one customer row becomes one row per order',
      'Aggregating after a fanout double-counts customer-level values',
      'Fix by aggregating the many-side table first, then joining at the customer grain',
      'Always check row counts and validate join keys before trusting the result',
    ],
    commonGaps: [
      'Saying the join is broken without explaining fanout',
      'Summing a customer-level column after the join',
      'Not checking row counts before and after',
      '!a JOIN never changes the number of rows in the left table',
    ],
    modelAnswer:
      'That is join fanout: the relationship is one-to-many, so each customer row is duplicated once per order. The join itself is correct — the problem is what I do next. If I SUM a customer-level column like credit limit after the join, it gets counted once per order and the total is wildly wrong. The fix is to aggregate the orders table first — one row per customer with order count, total spend, and last order date — and then join that summary to the customers table. That keeps one row per customer. I always check the row count before and after a join, and I verify that the join key is unique on the side I expect it to be.',
    followUps: [
      'How would you check whether a join key is unique before joining?',
      'What is the difference between a fanout and a many-to-many join problem?',
      'Your aggregated join still has duplicates — what do you check next?',
    ],
  },
  {
    id: 'iq-sql-leakage-4',
    category: 'SQL + ML',
    question: 'How can a SQL query introduce data leakage into your training data? Give an example.',
    difficulty: 'Hard',
    rubricKeywords: ['leakage', 'point-in-time', 'as-of date', 'future data', 'cutoff', 'target', 'snapshot', 'JOIN'],
    keyPoints: [
      'Leakage happens when features use data from after the prediction point',
      'Joining a current-state table to historical events pulls in future information',
      'The fix is point-in-time correctness: every feature uses only data as of the cutoff date',
      'Aggregates without a date filter are the most common SQL leakage source',
    ],
    commonGaps: [
      'Only talking about leakage in Python, not SQL',
      'Not mentioning point-in-time correctness or as-of joins',
      'Forgetting that current-state dimension tables leak future information',
      '!SQL queries cannot cause leakage',
    ],
    modelAnswer:
      'The classic SQL leakage is a feature that uses data from after the prediction point. Say I am predicting whether a customer churned in March, and I build a feature like "total orders" with no date filter — that includes April orders, which did not exist in March. Or I join the current customer status table, which already reflects that they churned. The model learns from the future and looks brilliant in validation, then fails in production. The fix is point-in-time correctness: every feature gets an as-of cutoff, so aggregates only include events before the prediction date, and joins use the historical snapshot of dimension tables, not the current state.',
    followUps: [
      'How would you write an as-of join in SQL?',
      'What is a slowly changing dimension, and why does it matter for ML?',
      'Your backtest looks great but the live model fails — how do you check for point-in-time leakage?',
    ],
  },
  // ─── Business + ML (5) ───────────────────────────────────────────────────
  {
    id: 'iq-biz-roi-1',
    category: 'Business + ML',
    question: 'How do you measure the business value of a machine learning model?',
    difficulty: 'Medium',
    rubricKeywords: ['business value', 'ROI', 'baseline', 'revenue', 'cost', 'uplift', 'A/B test', 'KPI', 'impact'],
    keyPoints: [
      'Translate model metrics into business outcomes like revenue saved or costs avoided',
      'Compare against the baseline of doing nothing or the current process',
      'Use A/B tests or holdout groups to measure causal uplift, not just correlation',
      'Track the metric the business owns, e.g. churn rate or fraud loss, not just AUC',
    ],
    commonGaps: [
      'Reporting only accuracy or AUC as the value',
      'No baseline comparison',
      'Not mentioning uplift or A/B testing',
      '!a high AUC automatically means high business value',
    ],
    modelAnswer:
      'I translate the model into money and outcomes the business already tracks. For a churn model, that means: how many at-risk customers did we retain, and what is their lifetime value, minus the cost of the retention offers? I always compare against a baseline — what happens if we do nothing, or use the current rule-based process — because value is the difference, not the raw number. The cleanest measurement is an A/B test or a holdout group, so I can claim causal uplift rather than correlation. And I report the business KPI itself, like the churn rate or fraud loss, alongside the model metric, because AUC alone never convinced a stakeholder.',
    followUps: [
      'How would you design an A/B test for a churn model?',
      'The model improved AUC by 5 points but revenue did not move — what do you investigate?',
      'How do you estimate ROI before building the model?',
    ],
  },
  {
    id: 'iq-biz-stakeholder-2',
    category: 'Business + ML',
    question: 'How would you explain your model to a non-technical manager who needs to trust it?',
    difficulty: 'Medium',
    rubricKeywords: ['explain', 'stakeholder', 'interpretability', 'feature importance', 'examples', 'business language', 'trust', 'limitations', 'SHAP'],
    keyPoints: [
      'Lead with the business outcome, not the algorithm',
      'Use concrete examples: show a customer the model flagged and why',
      'Translate feature importance into plain language drivers',
      'Be honest about limitations and error rates to build trust',
    ],
    commonGaps: [
      'Leading with algorithm names and math',
      'No concrete example to make it tangible',
      'Hiding the error rate or limitations',
      '!stakeholders do not need to understand the model',
    ],
    modelAnswer:
      'I lead with the outcome, not the algorithm: "This model finds customers likely to leave in the next month so the team can reach out first." Then I make it concrete with examples — here is a customer it flagged, and these are the three reasons: no purchase in 60 days, declining order size, and a support complaint. I translate feature importance into plain-language drivers and show the confusion matrix as real counts: out of 100 flagged customers, about 70 actually churn. I am honest about the limits too — what the model gets wrong and when it should not be trusted. That honesty is what actually builds trust with a manager.',
    followUps: [
      'Your manager asks "but why did it flag this specific customer?" — how do you answer?',
      'How would you present model errors without losing stakeholder confidence?',
      'What is SHAP, and how would you use it in a stakeholder meeting?',
    ],
  },
  {
    id: 'iq-biz-metric-choice-3',
    category: 'Business + ML',
    question: 'How do you choose the right evaluation metric for a business problem?',
    difficulty: 'Medium',
    rubricKeywords: ['metric', 'business cost', 'false positive', 'false negative', 'stakeholder', 'precision', 'recall', 'tradeoff', 'KPI'],
    keyPoints: [
      'Start from the cost of each error type in business terms',
      'Map error costs to precision, recall, or a custom metric',
      'Involve stakeholders: the metric encodes whose mistakes matter',
      'A single metric is a simplification — report a small set, not one number',
    ],
    commonGaps: [
      'Defaulting to accuracy without asking about costs',
      'Not involving the business in the metric decision',
      'Ignoring that different errors cost different amounts',
      '!accuracy is the default metric for every problem',
    ],
    modelAnswer:
      'I start by asking what each mistake costs the business. In fraud, a missed fraud case costs real money, so I weight recall heavily. In a marketing campaign, each false positive wastes an offer, so precision matters more. That cost structure tells me which metric to optimize — precision, recall, F1, or a custom cost-weighted metric. I involve stakeholders in this choice, because picking the metric is really deciding whose mistakes matter, and that is a business call, not a technical one. I never report just one number either: I show the metric we optimize plus the confusion matrix, so everyone sees the full tradeoff.',
    followUps: [
      'How would you build a custom cost-weighted metric?',
      'Two stakeholders disagree on which error is worse — how do you resolve it?',
      'When would you optimize a ranking metric instead of a classification metric?',
    ],
  },
  {
    id: 'iq-biz-deploy-4',
    category: 'Business + ML',
    question: 'Your model is trained and validated. What happens next before it creates business value?',
    difficulty: 'Medium',
    rubricKeywords: ['deployment', 'monitoring', 'drift', 'pipeline', 'retraining', 'integration', 'stakeholder', 'production', 'feedback'],
    keyPoints: [
      'Deployment means integrating predictions into a real workflow or system',
      'The preprocessing pipeline must be packaged with the model so production inputs match training',
      'Monitor input drift, prediction distribution, and business outcomes after launch',
      'Plan retraining triggers and a feedback loop for when performance degrades',
    ],
    commonGaps: [
      'Saying the work ends when the model is trained',
      'Not mentioning monitoring or drift',
      'Forgetting that the preprocessing pipeline must ship with the model',
      '!a validated model works forever without monitoring',
    ],
    modelAnswer:
      'Training is maybe a third of the work. First the model has to be deployed — integrated into the actual workflow, whether that is a batch scoring job that feeds the CRM or an API the app calls. The preprocessing pipeline ships with it, because production inputs must be transformed exactly as training data was. Then I set up monitoring: input distributions for drift, prediction distributions for sudden shifts, and the business KPI itself. I also define retraining triggers in advance — a performance threshold or a time schedule — and a feedback loop so we learn from wrong predictions. A model nobody monitors quietly decays; the value comes from the system around it.',
    followUps: [
      'What is data drift, and how would you detect it?',
      'How do you decide when to retrain a model?',
      'What is the difference between batch scoring and real-time inference?',
    ],
  },
  {
    id: 'iq-biz-failure-5',
    category: 'Business + ML',
    question: 'Your model is live and performance suddenly drops. Walk me through how you investigate.',
    difficulty: 'Hard',
    rubricKeywords: ['drift', 'data pipeline', 'monitoring', 'distribution', 'upstream', 'rollback', 'root cause', 'features', 'labels'],
    keyPoints: [
      'First check whether the data pipeline broke: missing features, schema changes, upstream bugs',
      'Compare current input distributions against training data for drift',
      'Check whether the business or user behaviour changed, e.g. a new promotion',
      'Have a rollback plan to the previous model while investigating',
    ],
    commonGaps: [
      'Immediately retraining without diagnosing the cause',
      'Not checking the data pipeline first',
      'No rollback or fallback plan',
      '!a performance drop always means the model needs retraining',
    ],
    modelAnswer:
      'I start with the data pipeline, because most sudden drops are plumbing, not modelling: a feature stopped updating, an upstream table changed schema, or a join broke. Next I compare the live input distributions against the training data to check for drift — maybe the customer mix changed after a new marketing campaign. I also ask the business whether anything changed on their side: a new pricing plan or a competitor move can shift behaviour overnight. While I investigate, I fall back to the previous model version or a simple rule so the business is not flying blind. Only after I understand the root cause do I decide whether to fix the pipeline, retrain, or rebuild the features.',
    followUps: [
      'How do you distinguish data drift from concept drift?',
      'What monitoring would have caught this drop earlier?',
      'When is it safe to retrain on the new data, and when is it not?',
    ],
  },
  // ─── Scenario (4) ────────────────────────────────────────────────────────
  {
    id: 'iq-scen-churn-1',
    category: 'Scenario',
    question: 'A telecom company wants to predict customer churn. Walk me through your end-to-end approach.',
    difficulty: 'Interview',
    rubricKeywords: ['churn', 'target definition', 'features', 'RFM', 'baseline', 'evaluation', 'recall', 'business', 'deployment', 'leakage'],
    keyPoints: [
      'Define churn precisely with a time window, e.g. no activity for 90 days',
      'Build features from usage, billing, support, and tenure data with point-in-time correctness',
      'Start with a logistic regression baseline, then try tree models',
      'Evaluate with recall and PR-AUC, and translate results into retention actions and ROI',
    ],
    commonGaps: [
      'Jumping to model choice before defining churn',
      'No mention of leakage or point-in-time features',
      'Evaluating with accuracy on imbalanced churn data',
      '!churn prediction is just a classification problem with no business framing',
    ],
    modelAnswer:
      'First I define churn precisely with the business — say, no activity for 90 days — and fix the prediction point, because everything downstream depends on that. Then I build features from usage, billing, support tickets, and tenure, all point-in-time correct so nothing leaks future information. I start with a logistic regression baseline, then try random forest and gradient boosting. Since churn is imbalanced, I evaluate with recall and PR-AUC, not accuracy, and I tune the threshold to the retention budget. Finally I translate the output into action: a ranked list of at-risk customers for the retention team, with the expected saving per intervention, so the model connects to revenue.',
    followUps: [
      'How would you define the churn window if the business is unsure?',
      'The retention team can only contact 500 customers a month — how does that change your approach?',
      'How would you measure whether the retention campaign actually worked?',
    ],
  },
  {
    id: 'iq-scen-sales-drop-2',
    category: 'Scenario',
    question: 'A sales forecasting model was accurate for six months, then accuracy dropped sharply. What do you do?',
    difficulty: 'Interview',
    rubricKeywords: ['drift', 'concept drift', 'seasonality', 'features', 'retraining', 'monitoring', 'root cause', 'external factors'],
    keyPoints: [
      'Check for data issues first: pipeline breaks, missing features, schema changes',
      'Look for concept drift: customer behaviour or market conditions changed',
      'Check seasonality and external events the model never saw, e.g. a festival or competitor launch',
      'Diagnose before retraining; retraining on a broken pipeline just bakes in the problem',
    ],
    commonGaps: [
      'Retraining immediately without diagnosis',
      'Not considering seasonality or external events',
      'No mention of checking the data pipeline',
      '!the model just needs more training data',
    ],
    modelAnswer:
      'A sudden drop after six good months points to something changing, so I diagnose before retraining. First I check the pipeline: did a feature stop updating, did a source table change, is the data even arriving? Then I look for drift — comparing recent input distributions and error patterns against the training period. I also check the calendar: a festival season, a competitor launch, or a pricing change can break patterns the model learned. If it is concept drift, I retrain on recent data, possibly with a shorter window, and add features for the new regime. And I set up monitoring so the next drop triggers an alert instead of a surprise.',
    followUps: [
      'How do you tell data drift apart from concept drift in this case?',
      'Would you retrain on all historical data or only recent data? Why?',
      'What features would you add to make the model robust to the next shock?',
    ],
  },
  {
    id: 'iq-scen-small-data-3',
    category: 'Scenario',
    question: 'You have only 500 labelled rows for a classification problem. How do you approach it?',
    difficulty: 'Interview',
    rubricKeywords: ['small data', 'simple model', 'cross-validation', 'regularization', 'features', 'overfitting', 'augmentation', 'transfer learning'],
    keyPoints: [
      'Keep the model simple: logistic regression or a shallow tree, with strong regularization',
      'Use cross-validation, since a single split wastes too much data',
      'Limit features aggressively — few rows cannot support many features',
      'Consider data augmentation, synthetic data, or transfer learning if applicable',
    ],
    commonGaps: [
      'Training a deep neural network on 500 rows',
      'Using a single train-test split and wasting data',
      'Not limiting the feature count',
      '!500 rows is enough for any model if you tune it well',
    ],
    modelAnswer:
      'With 500 rows my biggest enemy is overfitting, so I keep everything simple. I use logistic regression or a shallow decision tree with strong regularization, and I limit the feature count aggressively — a few dozen features at most, chosen with domain knowledge. I use cross-validation instead of a single split, because holding out 100 rows for testing wastes a fifth of my data. I also squeeze more signal from the data I have: careful feature engineering, and possibly data augmentation or synthetic samples if the domain allows it. Most importantly, I set honest expectations with stakeholders — with 500 rows, the uncertainty bands are wide, and I report them.',
    followUps: [
      'How many features is too many for 500 rows?',
      'When would you use leave-one-out cross-validation?',
      'The stakeholder wants 95% accuracy on this dataset — how do you respond?',
    ],
  },
  {
    id: 'iq-scen-no-labels-4',
    category: 'Scenario',
    question: 'The business wants a fraud detection model, but there are no labelled fraud cases. What do you do?',
    difficulty: 'Interview',
    rubricKeywords: ['no labels', 'unsupervised', 'anomaly detection', 'clustering', 'rules', 'labelling', 'isolation forest', 'heuristic'],
    keyPoints: [
      'Without labels, start with unsupervised anomaly detection like isolation forest or clustering',
      'Use business rules and heuristics to create a first version of labels',
      'Manually review the top anomalies with domain experts to build a labelled set',
      'Set up a labelling workflow so a supervised model becomes possible over time',
    ],
    commonGaps: [
      'Saying the project is impossible without labels',
      'Jumping straight to supervised learning with invented labels',
      'No plan to create labels over time',
      '!you cannot do fraud detection without labelled data',
    ],
    modelAnswer:
      'No labels does not mean no project — it means I start unsupervised. I would use anomaly detection, like an isolation forest, to surface the most unusual transactions, and clustering to find behaviour groups that look different from normal. I would combine that with business rules — known fraud patterns from the risk team — to create a first-pass heuristic system. Then I take the top anomalies to domain experts for manual review, which builds a small labelled set. That labelled set lets me train a first supervised model, and I set up a labelling workflow so every reviewed case improves the model over time. The honest framing is that version one is a triage tool, not a finished fraud model.',
    followUps: [
      'How does an isolation forest detect anomalies?',
      'How would you evaluate an anomaly detection model with no labels?',
      'How do you avoid bias when experts label the cases you show them?',
    ],
  },
  // ─── Project (3) ─────────────────────────────────────────────────────────
  {
    id: 'iq-proj-favorite-1',
    category: 'Project',
    question: 'Walk me through your favourite project. What problem did you solve, and what did you learn?',
    difficulty: 'Interview',
    rubricKeywords: ['business problem', 'data', 'features', 'model', 'evaluation', 'results', 'impact', 'learned', 'challenges'],
    keyPoints: [
      'Open with the business problem and why it mattered, not the tools',
      'Describe the data, the key features, and why they were chosen',
      'Name the models tried, the metric used, and the final result with numbers',
      'End with what went wrong and what you learned',
    ],
    commonGaps: [
      'Listing tools without explaining the business problem',
      'No numbers or results',
      'Not mentioning any challenge or lesson learned',
      '!the project had no problems at all',
    ],
    modelAnswer:
      'My favourite project is a customer churn model I built on a telecom-style dataset. The business problem was simple: acquiring a customer costs far more than retaining one, so the goal was to flag at-risk customers early. I defined churn as no activity for 90 days and built features around recency, tenure, billing patterns, and support contacts. I started with logistic regression as a baseline, then compared a random forest and gradient boosting, evaluating on recall and PR-AUC because churn was imbalanced. The final model caught 78% of churners in the top risk decile. The biggest lesson was about leakage — my first version scored suspiciously well because a feature used post-churn data, and fixing that taught me to audit every feature.',
    followUps: [
      'Why did you choose recall as your main metric for this project?',
      'What would you do differently if you rebuilt this project today?',
      'How did you decide which features to engineer?',
    ],
  },
  {
    id: 'iq-proj-leakage-2',
    category: 'Project',
    question: 'In your projects, how did you prevent data leakage? Give a specific example.',
    difficulty: 'Interview',
    rubricKeywords: ['leakage', 'train-test split', 'pipeline', 'point-in-time', 'target', 'future data', 'validation', 'features'],
    keyPoints: [
      'Split before any preprocessing and fit all transformers on training data only',
      'Use pipelines so preprocessing is refit inside each cross-validation fold',
      'Audit features for target-derived or future information',
      'Give a concrete example of a leaking feature found and fixed',
    ],
    commonGaps: [
      'Only giving a textbook definition with no project example',
      'Not mentioning pipelines',
      'Saying leakage was never a problem',
      '!leakage is only a theoretical concern',
    ],
    modelAnswer:
      'I prevent leakage in two ways: process and auditing. On process, I split the data before any preprocessing and put everything inside a scikit-learn Pipeline, so scalers and imputers are fit on training folds only during cross-validation. On auditing, I check every feature against one question: would I know this value at prediction time? In my churn project I caught a real leak this way — a "days since last activity" feature was computed from the full dataset, so for churned customers it used dates after they had already left. My validation score was suspiciously high, which was the clue. I rebuilt the feature with a strict cutoff date, the score dropped to a realistic level, and the model actually generalized.',
    followUps: [
      'What other leakage risks exist in a time-based dataset?',
      'How would you explain leakage to a teammate who has never heard of it?',
      'Your pipeline is correct but the score is still suspiciously high — what else do you check?',
    ],
  },
  {
    id: 'iq-proj-failure-3',
    category: 'Project',
    question: 'Tell me about a modelling decision in one of your projects that did not work out. What did you change?',
    difficulty: 'Interview',
    rubricKeywords: ['mistake', 'failed', 'learned', 'changed', 'overfitting', 'metric', 'features', 'iterate', 'validation'],
    keyPoints: [
      'Name a specific decision that failed, with the evidence that showed it',
      'Explain the diagnosis: what the metrics or error analysis revealed',
      'Describe the concrete change made and the improved result',
      'State the general lesson carried into later projects',
    ],
    commonGaps: [
      'Giving a fake weakness like "I worked too hard"',
      'No specific decision or evidence',
      'Not explaining what changed as a result',
      '!every modelling decision worked perfectly',
    ],
    modelAnswer:
      'In my loan default project I initially optimized for accuracy, and the model looked great at 94%. But when I read the confusion matrix, it was barely catching any defaults — the minority class the bank actually cares about. I had chosen the wrong metric for an imbalanced problem. I switched to optimizing recall at a minimum precision, retuned the threshold, and added class weights. Recall on defaults went from 31% to 68% while precision stayed acceptable. The lesson stuck: I now define the metric from the business cost of each error before I train anything, and I always read the confusion matrix before trusting a headline number.',
    followUps: [
      'How did you decide what precision level was acceptable?',
      'What would you do if the business insisted on accuracy as the metric?',
      'Has that lesson changed how you start a new project?',
    ],
  },
];






