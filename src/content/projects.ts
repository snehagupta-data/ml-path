import type { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'churn',
    title: 'Customer Churn Prediction',
    level: 2,
    levelLabel: 'Semi-guided',
    problemType: 'Classification',
    businessProblem:
      'A subscription business loses customers every month, and acquiring a replacement costs 5–7x more than retaining an existing one. The retention team currently contacts customers at random, so most effort goes to people who were never going to leave, while genuinely at-risk customers slip away unnoticed.',
    businessObjective:
      'Identify customers likely to churn in the next 30 days so the retention team can intervene early, prioritized by churn probability and customer value.',
    targetDefinition:
      'Binary target: 1 if the customer cancels or shows no activity for 30 consecutive days within the prediction window, 0 otherwise. The prediction point is fixed at the end of each month, and all features use only data available before that date.',
    datasetId: 'churn',
    datasetDescription:
      'A telecom-style customer dataset with demographics, subscription plan, tenure, monthly charges, usage patterns, support interactions, and payment history, plus a churn label. Roughly 7,000 customers with a churn rate near 25%, including realistic missing values and mixed numeric and categorical columns.',
    steps: [
      {
        title: 'Business Problem',
        guidance:
          'Write the business problem in one paragraph: who loses money from churn, how much, and what decision this model will change. Talk to the retention team (or imagine their workflow) and note what action follows a churn prediction. This framing decides every later choice, from the target definition to the metric.',
        deliverable: 'A one-paragraph problem statement plus a list of the decisions the model will support.',
      },
      {
        title: 'Problem Framing',
        guidance:
          'Frame churn as binary classification with a fixed prediction window. Define the prediction point and the churn window precisely, and decide the observation period for features. Document what counts as churn and what the model will output: a probability, not just a yes/no label.',
        deliverable: 'Written target definition, prediction point, observation window, and output format.',
      },
      {
        title: 'Data Understanding',
        guidance:
          'Load the dataset and inspect its shape, column types, and target balance. Check the grain — one row per customer — and confirm every column\'s meaning. Look for obvious issues: duplicate customer IDs, impossible values like negative tenure, and columns that could leak the target.',
        deliverable: 'A data dictionary with one line per column plus notes on grain, target balance, and suspected leakage columns.',
      },
      {
        title: 'EDA',
        guidance:
          'Explore churn rates by plan, tenure band, payment method, and contract type. Plot distributions of tenure and monthly charges split by churn, and check correlations between features. Look for the story: which customer segments churn most, and what behaviour precedes churn?',
        deliverable: '5–8 charts with a written summary of the three strongest churn signals found.',
      },
      {
        title: 'Data Cleaning',
        guidance:
          'Handle missing values per column: check whether missingness is random or patterned before dropping or imputing. Fix inconsistent categories and impossible values. Decide what to do with duplicate rows and confirm the train/test split happens only after cleaning rules are defined.',
        deliverable: 'A cleaning log: every fix applied, the reasoning, and the row count before and after.',
      },
      {
        title: 'Feature Engineering',
        guidance:
          'Build behaviour features the raw columns do not express: tenure bands, charges per month of tenure, support contacts per month, and a flag for recent price increases. Create a missingness indicator if any column\'s missingness correlates with churn. Keep every feature point-in-time correct.',
        deliverable: 'A list of engineered features with a one-line justification for each, plus code in a reusable function.',
      },
      {
        title: 'Train/Test Split',
        guidance:
          'Split the data with stratification so both sets keep the same churn rate, using an 80/20 split. Confirm no customer appears in both sets. From here on, fit every transformer on the training set only.',
        deliverable: 'Train and test sets with matching churn rates, and a note confirming no customer overlap.',
      },
      {
        title: 'Baseline',
        guidance:
          'Build two baselines: a majority-class predictor (predict no churn for everyone) and a logistic regression on the raw features. Record accuracy, precision, recall, and ROC-AUC for both. These numbers are the bar every later model must beat.',
        deliverable: 'Baseline metrics table with a one-line interpretation of what each baseline proves.',
      },
      {
        title: 'Model Selection',
        guidance:
          'Shortlist models suited to tabular binary classification: logistic regression, decision tree, random forest, and gradient boosting. Decide the selection metric up front — recall at a minimum precision, or PR-AUC — based on the cost of missing a churner versus a wasted retention offer.',
        deliverable: 'A shortlist of 3–4 models with the selection metric and the business reasoning behind it.',
      },
      {
        title: 'Model Training',
        guidance:
          'Train each candidate inside a scikit-learn Pipeline that includes preprocessing, so scaling and encoding are fit on training folds only. Use stratified 5-fold cross-validation and record the mean and spread of the selection metric for every model.',
        deliverable: 'Trained pipelines for all candidates with cross-validated scores and their standard deviations.',
      },
      {
        title: 'Evaluation',
        guidance:
          'Evaluate the best model on the held-out test set. Read the full confusion matrix, report precision, recall, F1, ROC-AUC, and PR-AUC, and plot the ROC and precision-recall curves. Translate the confusion matrix into business counts: how many churners caught, how many false alarms.',
        deliverable: 'A test-set evaluation report with the confusion matrix, all metrics, both curves, and business-count translation.',
      },
      {
        title: 'Model Comparison',
        guidance:
          'Compare all candidates on the same cross-validation folds and metric. Check whether the winner beats the baseline by a margin that matters in business terms, and weigh any small accuracy gain against interpretability and training cost before choosing.',
        deliverable: 'A comparison table with the chosen model and a written justification for the choice.',
      },
      {
        title: 'Hyperparameter Tuning',
        guidance:
          'Tune the chosen model with randomized search over a sensible parameter grid, using stratified cross-validation. Tune only a few influential parameters — for gradient boosting, learning rate, depth, and number of trees — and record the best configuration and its validation gain.',
        deliverable: 'Best hyperparameters found, the search space used, and the validation improvement over defaults.',
      },
      {
        title: 'Error Analysis',
        guidance:
          'Inspect the false negatives (missed churners) and false positives (false alarms) separately. Look for patterns: do missed churners share a plan type or tenure band? Check whether errors concentrate in a segment, which suggests a missing feature or a data problem.',
        deliverable: 'A written error profile: who the model misses, who it wrongly flags, and one hypothesis per pattern.',
      },
      {
        title: 'Explainability',
        guidance:
          'Compute permutation importance or SHAP values for the final model and identify the top five drivers of churn. Produce one example explanation for an individual high-risk customer, in language a retention agent could use on a call.',
        deliverable: 'A top-5 drivers chart plus a worked individual explanation for one customer.',
      },
      {
        title: 'Business Recommendations',
        guidance:
          'Turn the model into actions: a ranked outreach list for the retention team, suggested interventions per risk segment, and an estimate of customers saved and revenue protected. Recommend a decision threshold tied to the team\'s monthly outreach capacity.',
        deliverable: 'A one-page recommendation memo with the outreach list logic, threshold, and estimated impact.',
      },
      {
        title: 'Limitations & Future Improvements',
        guidance:
          'Document what the model cannot do: it predicts churn, not why a customer churns; it may degrade if pricing or competitors change; and it was validated on historical data. Propose concrete next steps, such as adding usage-trend features or running an A/B test on the retention offers.',
        deliverable: 'A limitations list with one proposed improvement per limitation.',
      },
      {
        title: 'Deployment Plan',
        guidance:
          'Describe how the model would run in production: a monthly batch scoring job that writes churn probabilities to the CRM, the monitoring to add (input drift, prediction distribution, monthly churn rate), and the retraining trigger. Note that the full pipeline, not just the model, must be saved and versioned.',
        deliverable: 'A deployment sketch: scoring cadence, monitoring metrics, retraining trigger, and rollback plan.',
      },
    ],
    modelsToTry: ['Logistic Regression', 'Decision Tree', 'Random Forest', 'Gradient Boosting (XGBoost / LightGBM)'],
    metrics: [
      'Recall — the share of real churners caught; missing a churner is the expensive error',
      'Precision — the share of flagged customers who actually churn; controls wasted retention offers',
      'PR-AUC — ranking quality on imbalanced data, more honest than ROC-AUC here',
      'ROC-AUC — overall ranking quality, useful for model comparison',
    ],
    prerequisites: [
      { skill: 'Python', threshold: 40 },
      { skill: 'Statistics', threshold: 30 },
      { skill: 'Preprocessing', threshold: 30 },
      { skill: 'Algorithms', threshold: 30 },
      { skill: 'Evaluation', threshold: 30 },
    ],
    pitch30s:
      'I built a churn prediction model for a subscription business. It flags customers likely to leave in the next 30 days so the retention team can reach out first. It catches about three-quarters of churners in the top risk group, and the biggest drivers were recency of activity, tenure, and support contacts.',
    pitch1min:
      'I built a churn prediction model for a subscription business where keeping a customer costs far less than acquiring one. I defined churn as no activity for 30 days, engineered features around recency, tenure, and support behaviour, and compared logistic regression, random forest, and gradient boosting using recall and PR-AUC, since churn is imbalanced. The final model catches around 78% of churners in the top risk decile. The main lesson was leakage: my first version scored suspiciously well because one feature used post-churn data, and fixing that taught me to audit every feature for point-in-time correctness.',
    pitch3min:
      'I built a churn prediction model for a subscription business. The business problem was that acquiring a customer costs five to seven times more than retaining one, yet the retention team was contacting customers at random. I framed it as binary classification: predict whether a customer churns in the next 30 days. The target definition mattered a lot — I fixed a prediction point at month end and made sure every feature used only data available before that date. My key features were recency of last activity, tenure bands, charges per month of tenure, and support contacts per month. I started with a logistic regression baseline, then compared a random forest and gradient boosting with stratified cross-validation, evaluating on recall and PR-AUC because only about a quarter of customers churn. The gradient boosting model won, catching roughly 78% of churners in the top risk decile. Error analysis showed the model missed mostly long-tenure customers with sudden behaviour changes, which suggests adding trend features next. I also built SHAP explanations so a retention agent can see the top reasons for each flagged customer. The biggest lesson was data leakage: my first version scored suspiciously well because one feature used post-churn data. Catching that taught me to question any score that looks too good, and to audit every feature against the question "would I know this at prediction time?"',
    deepDive: [
      'Target definition: churn as 30 days of inactivity, with a fixed prediction point so features are point-in-time correct.',
      'Why recall and PR-AUC, not accuracy: churn is imbalanced at ~25%, and a missed churner costs more than a false alarm.',
      'Key features: recency of last activity, tenure bands, charges per month of tenure, and support contacts per month.',
      'Leakage catch: a days-since-last-activity feature computed on full data used post-churn dates; rebuilding it with a cutoff fixed a suspiciously high validation score.',
      'Model comparison: gradient boosting beat logistic regression by a meaningful margin on PR-AUC, justifying the extra complexity.',
      'Explainability: SHAP values give per-customer reasons a retention agent can use on a call, not just a score.',
      'Threshold choice: set from the retention team\'s monthly outreach capacity, not from the default 0.5.',
    ],
    toughFollowUps: [
      {
        question: 'Why didn\'t you use a neural network for this?',
        guidance:
          'Tabular data with 7,000 rows: tree models and logistic regression outperform neural networks here, train faster, and are interpretable. A neural network would need far more data and tuning for no expected gain. Say you would reconsider only with much more data or unstructured inputs.',
      },
      {
        question: 'What would happen if the dataset doubled in size?',
        guidance:
          'More data would mainly stabilize the estimates and let you use more features safely; the model choice would likely stay the same. Mention that training time grows for gradient boosting, and that you would re-check whether the new data covers new segments or just more of the same.',
      },
      {
        question: 'How would you explain this model to a non-technical manager?',
        guidance:
          'Lead with the outcome and the money: the model ranks customers by churn risk so the team contacts the right people first. Use one concrete example customer with three reasons. Show the confusion matrix as real counts, and be honest about the error rate.',
      },
      {
        question: 'Your model flags a loyal 5-year customer as high risk. The retention team is skeptical. What do you say?',
        guidance:
          'Show the individual SHAP explanation: the flag is driven by recent behaviour change, not tenure. Explain that the model weighs recent signals heavily because behaviour change precedes churn. Suggest the team verify with a quick check-in rather than dismissing the flag.',
      },
      {
        question: 'How would you know if this model stops working in production?',
        guidance:
          'Monitor input drift, the distribution of predicted probabilities, and the actual monthly churn rate against predictions. A sudden shift in any of these triggers investigation. Mention a retraining schedule and a rollback to the previous version.',
      },
      {
        question: 'What would you do differently if you rebuilt this project today?',
        guidance:
          'Name something specific: add trend features like declining usage over the last 3 months, run an A/B test on retention offers to measure causal impact, or build the labelling and scoring as a repeatable pipeline instead of one-off notebook code.',
      },
    ],
  },
  {
    id: 'loan-default',
    title: 'Loan Default Prediction',
    level: 3,
    levelLabel: 'Independent',
    problemType: 'Classification',
    businessProblem:
      'A lender loses money two ways: approving loans that default, and rejecting good borrowers who take their business elsewhere. Credit officers currently rely on scorecards and judgement, which are inconsistent and slow. A data-driven default model can make decisions faster and more consistently — but a wrong model can also systematize bad lending.',
    businessObjective:
      'Predict the probability that a loan applicant will default within 12 months, so the lender can approve, price, or reject applications consistently, while keeping the false-approval rate within the risk team\'s tolerance.',
    targetDefinition:
      'Binary target: 1 if the borrower misses payments for 90+ days within 12 months of disbursement, 0 otherwise. The prediction point is the moment of application, so only information available at application time may be used as features.',
    datasetId: 'loan',
    datasetDescription:
      'A consumer loan dataset with applicant income, employment length, loan amount, interest rate, credit history length, debt-to-income ratio, loan purpose, home ownership, and delinquency history, plus a default label. Roughly 10,000 loans with a default rate near 18%, including skewed income data, missing values, and high-cardinality categoricals.',
    steps: [
      {
        title: 'Business Problem',
        guidance:
          'Write the business problem from the lender\'s perspective: the cost of a default versus the cost of rejecting a good borrower. Note the regulatory context — lending decisions must be explainable and fair — and identify who uses the model output and how.',
        deliverable: 'A problem statement with the two error costs and the explainability requirement noted.',
      },
      {
        title: 'Problem Framing',
        guidance:
          'Frame default prediction as binary classification with a 12-month horizon. Define default precisely (90+ days past due) and fix the prediction point at application time. Decide the output: a default probability that feeds into approval and pricing decisions.',
        deliverable: 'Written target definition, horizon, prediction point, and output format.',
      },
      {
        title: 'Data Understanding',
        guidance:
          'Inspect the loan data: shape, types, target balance, and the grain (one row per loan). Check for survivorship bias — the data only contains approved loans, so rejected applicants are invisible. Flag any column that would not exist at application time.',
        deliverable: 'A data dictionary plus notes on the approved-only bias and any post-application columns.',
      },
      {
        title: 'EDA',
        guidance:
          'Compare default rates by loan purpose, income band, credit history length, and debt-to-income ratio. Plot income and loan amount distributions split by default, and check correlations between financial features. Look for the strongest risk signals and any suspicious patterns.',
        deliverable: '5–8 charts with a summary of the top risk signals and any data quirks found.',
      },
      {
        title: 'Data Cleaning',
        guidance:
          'Handle skewed income and loan amount distributions, and treat missing values per column — checking whether missingness predicts default before imputing. Standardize categorical values like employment length, and remove or cap impossible values such as negative income.',
        deliverable: 'A cleaning log with the reasoning for each decision and row counts before and after.',
      },
      {
        title: 'Feature Engineering',
        guidance:
          'Build lending ratios the raw columns do not express: loan amount to annual income, monthly instalment to monthly income, and credit utilization. Create bands for debt-to-income and credit history length, and add a missingness indicator where missing data is informative.',
        deliverable: 'A list of engineered features with a one-line business justification for each.',
      },
      {
        title: 'Train/Test Split',
        guidance:
          'Use a stratified 80/20 split so both sets keep the same default rate. If the data spans multiple years, consider a time-based split instead so the test set reflects the most recent lending conditions. Confirm no applicant appears in both sets.',
        deliverable: 'Train and test sets with matching default rates, and a note on why the split type was chosen.',
      },
      {
        title: 'Baseline',
        guidance:
          'Build a majority-class baseline and a logistic regression on the raw features. Record precision, recall, ROC-AUC, and PR-AUC for both. The logistic regression baseline doubles as the interpretable model the risk team can compare against.',
        deliverable: 'Baseline metrics table with interpretation of what each baseline shows.',
      },
      {
        title: 'Model Selection',
        guidance:
          'Shortlist logistic regression, decision tree, random forest, and gradient boosting. Because lending is regulated, weight interpretability heavily: a model the risk team cannot explain may be unusable no matter how accurate it is. Define the selection metric from the cost of a missed default.',
        deliverable: 'A shortlist with the selection metric and an explicit note on the interpretability constraint.',
      },
      {
        title: 'Model Training',
        guidance:
          'Train each candidate inside a Pipeline with preprocessing included, using stratified 5-fold cross-validation. Handle class imbalance with class weights rather than resampling first, and record the mean and spread of the selection metric for every model.',
        deliverable: 'Trained pipelines for all candidates with cross-validated scores and spreads.',
      },
      {
        title: 'Evaluation',
        guidance:
          'Evaluate on the held-out test set with the full confusion matrix, precision, recall, F1, ROC-AUC, and PR-AUC. Translate errors into money: estimate the loss from false approvals and the lost revenue from false rejections. Check calibration, since the probability itself feeds pricing.',
        deliverable: 'A test-set evaluation report with metrics, curves, calibration check, and a money translation of errors.',
      },
      {
        title: 'Model Comparison',
        guidance:
          'Compare candidates on the same folds and metric, then make the final choice with interpretability in the loop. If a complex model beats logistic regression by only a small margin, consider shipping the simpler model or using the complex model with SHAP explanations.',
        deliverable: 'A comparison table with the chosen model and a justification covering accuracy and explainability.',
      },
      {
        title: 'Hyperparameter Tuning',
        guidance:
          'Tune the chosen model with randomized search and stratified cross-validation. For gradient boosting, tune learning rate, depth, and number of trees; for logistic regression, tune the regularization strength. Record the best configuration and the gain over defaults.',
        deliverable: 'Best hyperparameters, search space, and validation improvement over defaults.',
      },
      {
        title: 'Error Analysis',
        guidance:
          'Profile the false negatives (defaults the model missed) and false positives (good borrowers rejected). Check whether errors concentrate in a segment — a loan purpose, income band, or region — which may indicate a missing feature or a fairness concern worth flagging.',
        deliverable: 'A written error profile with segment breakdowns and one hypothesis per pattern.',
      },
      {
        title: 'Explainability',
        guidance:
          'Produce global explanations (top drivers of default risk) and local explanations for individual applicants, since declined applicants may ask why. For a tree ensemble, use SHAP; for logistic regression, present the coefficients as odds effects in plain language.',
        deliverable: 'A top-drivers chart plus two worked individual explanations: one approval and one rejection.',
      },
      {
        title: 'Business Recommendations',
        guidance:
          'Recommend an approval threshold tied to the risk team\'s loss tolerance, a pricing suggestion for borderline applicants, and a review queue for high-uncertainty cases. Estimate the expected reduction in default losses versus the current process.',
        deliverable: 'A one-page recommendation memo with threshold, pricing note, review process, and estimated impact.',
      },
      {
        title: 'Limitations & Future Improvements',
        guidance:
          'Document the approved-only bias: the model has never seen rejected applicants, so it cannot fairly judge them. Note that economic conditions change, so the model needs regular retraining, and that fairness across protected groups must be audited before deployment.',
        deliverable: 'A limitations list with a proposed improvement or mitigation for each item.',
      },
      {
        title: 'Deployment Plan',
        guidance:
          'Describe production scoring at application time: an API or batch job that returns a default probability plus the top reasons. Plan monitoring for input drift, approval-rate shifts, and realized default rates, with a retraining trigger and a human-review fallback for edge cases.',
        deliverable: 'A deployment sketch: scoring path, monitoring metrics, retraining trigger, and fallback process.',
      },
    ],
    modelsToTry: ['Logistic Regression', 'Decision Tree', 'Random Forest', 'Gradient Boosting (XGBoost / LightGBM)'],
    metrics: [
      'Recall on defaults — a missed default is a direct financial loss',
      'Precision — controls how many good borrowers get wrongly rejected',
      'PR-AUC — ranking quality on imbalanced default data',
      'Calibration (Brier score) — the probability itself feeds pricing, so it must be honest',
    ],
    prerequisites: [
      { skill: 'Python', threshold: 50 },
      { skill: 'Statistics', threshold: 45 },
      { skill: 'Preprocessing', threshold: 45 },
      { skill: 'Algorithms', threshold: 45 },
      { skill: 'Evaluation', threshold: 45 },
      { skill: 'Explainability', threshold: 30 },
    ],
    pitch30s:
      'I built a loan default prediction model that estimates the chance an applicant defaults within 12 months. It helps the lender approve good borrowers faster while flagging risky ones, and it is built to be explainable because lending decisions have to be justified.',
    pitch1min:
      'I built a loan default prediction model for a consumer lender. The goal was to estimate the probability that an applicant defaults within 12 months, so the lender can approve, price, or reject consistently. I engineered lending ratios like loan-to-income and instalment-to-income, and compared logistic regression, random forest, and gradient boosting, evaluating on recall and PR-AUC since defaults are the minority class. The final model caught about 70% of defaults while keeping false rejections low. Because lending is regulated, I built SHAP explanations so every decision can be justified, and I flagged the approved-only bias in the training data as a key limitation.',
    pitch3min:
      'I built a loan default prediction model for a consumer lender. The business problem is two-sided: approving a loan that defaults loses money, but rejecting a good borrower loses revenue and the customer. I framed it as binary classification with a 12-month horizon — default means 90 or more days past due — and the prediction point is the application moment, so only application-time information is allowed as features. My strongest features were engineered ratios: loan amount to annual income, monthly instalment to monthly income, and debt-to-income bands, because raw income and loan amount separately do not capture affordability. I started with a logistic regression baseline, then compared random forest and gradient boosting with stratified cross-validation, evaluating on recall and PR-AUC since only about 18% of loans default. Gradient boosting won on PR-AUC, but the margin over logistic regression was modest, so I kept logistic regression in the comparison for the risk team. Error analysis showed the model missed defaults concentrated in small business-purpose loans, which suggests a missing feature around business cash flow. Because lending decisions must be explainable, I produced SHAP explanations for individual applicants and a plain-language top-drivers list. The biggest limitation is survivorship bias: the data only contains approved loans, so the model has never seen a rejected applicant. I documented that openly and recommended a fairness audit before any production use.',
    deepDive: [
      'Target definition: 90+ days past due within 12 months, predicted at application time — only application-time features allowed.',
      'Engineered ratios: loan-to-income, instalment-to-income, and debt-to-income bands capture affordability better than raw values.',
      'Imbalance handling: class weights first, evaluated with recall and PR-AUC rather than accuracy.',
      'Calibration matters: the predicted probability feeds pricing, so a Brier score check is part of evaluation.',
      'Survivorship bias: training data contains only approved loans, so the model cannot fairly judge rejected profiles.',
      'Explainability: SHAP local explanations for individual decisions, plus global drivers for the risk team.',
      'Threshold choice: tied to the risk team\'s loss tolerance, not the default 0.5.',
    ],
    toughFollowUps: [
      {
        question: 'Why didn\'t you use a deep learning model for this?',
        guidance:
          'Tabular lending data with 10,000 rows is the worst case for deep learning: tree models and logistic regression are stronger, faster, and explainable. Regulators require explainable lending decisions, which rules out black-box models. Mention you would revisit only with far more data or unstructured inputs like documents.',
      },
      {
        question: 'What would happen if the dataset doubled?',
        guidance:
          'Estimates get more stable and you could support more features, but the approved-only bias would remain — doubling biased data does not fix bias. The model choice would likely stay the same; the bigger win would be adding rejected-applicant data if it became available.',
      },
      {
        question: 'How would you explain a rejection to the applicant?',
        guidance:
          'Use the local SHAP explanation in plain language: the three biggest factors, e.g. high instalment-to-income ratio and short credit history. Never blame the model; frame it as the factors behind the decision and what would change the outcome. Note regulatory requirements for adverse-action reasons.',
      },
      {
        question: 'Your model rejects more applicants from one region. What do you do?',
        guidance:
          'First check whether the disparity reflects real risk differences or a data problem, e.g. a proxy feature correlated with region. Audit feature importance for proxies, test fairness metrics across groups, and escalate to the risk and compliance teams — do not silently ship a model with unexplained group disparity.',
      },
      {
        question: 'How would you know if this model stops working in production?',
        guidance:
          'Monitor approval rates, realized default rates by score band, and input drift. If defaults in the "low risk" band rise, the model is degrading. Set a retraining schedule tied to economic conditions and a champion-challenger setup for new versions.',
      },
      {
        question: 'A credit officer disagrees with the model on an application. Who wins?',
        guidance:
          'Neither automatically: the model is a decision support tool, not a replacement for judgement. High-uncertainty or borderline cases go to human review by design. Track overrides — if officers consistently override in one direction, that is feedback the model is missing something.',
      },
    ],
  },
  {
    id: 'house-prices',
    title: 'House Price Prediction',
    level: 2,
    levelLabel: 'Semi-guided',
    problemType: 'Regression',
    businessProblem:
      'A property platform wants to show buyers a fair price estimate for every listing. Manual valuations are slow and inconsistent, and buyers distrust listings with no price guidance. An accurate price model improves trust, helps sellers price competitively, and keeps users on the platform.',
    businessObjective:
      'Predict the sale price of a house from its features — size, location, age, rooms, and amenities — with errors small enough that buyers and sellers find the estimate useful.',
    targetDefinition:
      'Continuous target: the final sale price in the local currency. Predictions are made at listing time using only features known then. The model is judged on typical error (MAE) and on large errors (RMSE).',
    datasetId: 'housing',
    datasetDescription:
      'A housing dataset with sale price, living area, number of bedrooms and bathrooms, lot size, year built, location or neighbourhood, condition, and renovation history. Roughly 5,000 sales with a right-skewed price distribution, some missing values, and a mix of numeric and categorical features.',
    steps: [
      {
        title: 'Business Problem',
        guidance:
          'Write the business problem from the platform\'s perspective: who uses the price estimate, what decision it supports, and what a bad estimate costs. Note that buyers and sellers have different tolerances for over- versus under-estimation.',
        deliverable: 'A problem statement naming the users, their decisions, and the cost of a bad estimate.',
      },
      {
        title: 'Problem Framing',
        guidance:
          'Frame price prediction as regression with a continuous target. Decide the prediction point (listing time) and whether to model the raw price or a log-transformed price, given the right skew. Document the choice and why.',
        deliverable: 'Written target definition, prediction point, and the raw-versus-log price decision.',
      },
      {
        title: 'Data Understanding',
        guidance:
          'Inspect the housing data: shape, types, price distribution, and the grain (one row per sale). Check for duplicates, impossible values like zero bedrooms, and features that would not be known at listing time.',
        deliverable: 'A data dictionary plus notes on grain, price distribution, and any unusable columns.',
      },
      {
        title: 'EDA',
        guidance:
          'Plot price against living area, year built, and bedroom count, and compare median prices by neighbourhood. Check the skew of the price distribution and correlations between size features. Look for outliers like luxury properties that may dominate the error metrics.',
        deliverable: '5–8 charts with a summary of the strongest price drivers and the outlier situation.',
      },
      {
        title: 'Data Cleaning',
        guidance:
          'Handle missing values per column and fix impossible values. Decide how to treat extreme luxury properties: keep them, cap them, or model them separately, with reasoning. Confirm the cleaning rules are defined before the train/test split.',
        deliverable: 'A cleaning log with the outlier decision and row counts before and after.',
      },
      {
        title: 'Feature Engineering',
        guidance:
          'Build features a buyer would actually weigh: price-relevant ratios like living area per bedroom, house age at sale, years since renovation, and total rooms. Consider a log transform of skewed size features and an interaction between neighbourhood and living area.',
        deliverable: 'A list of engineered features with a one-line justification for each.',
      },
      {
        title: 'Train/Test Split',
        guidance:
          'Use a random 80/20 split, or a time-based split if sale dates span years and the market moved. Keep the test set untouched until final evaluation, and fit all preprocessing on the training set only.',
        deliverable: 'Train and test sets with a note on why the split type was chosen.',
      },
      {
        title: 'Baseline',
        guidance:
          'Build two baselines: predicting the median price for every house, and a simple linear regression on living area alone. Record MAE, RMSE, and R-squared for both. These set the bar for every later model.',
        deliverable: 'Baseline metrics table with a one-line interpretation of each baseline.',
      },
      {
        title: 'Model Selection',
        guidance:
          'Shortlist linear regression, Ridge, decision tree regressor, random forest, and gradient boosting. Decide the selection metric up front: MAE for typical error, RMSE if large errors matter more. Note that interpretability matters here, since sellers ask why a price is what it is.',
        deliverable: 'A shortlist of models with the selection metric and the reasoning behind it.',
      },
      {
        title: 'Model Training',
        guidance:
          'Train each candidate inside a Pipeline with preprocessing included, using 5-fold cross-validation. Scale features for the linear models; trees do not need it. Record the mean and spread of MAE and RMSE for every model.',
        deliverable: 'Trained pipelines for all candidates with cross-validated MAE and RMSE.',
      },
      {
        title: 'Evaluation',
        guidance:
          'Evaluate on the held-out test set: MAE, RMSE, MAPE, and R-squared, plus a residual plot and a predicted-versus-actual scatter. Check whether errors are larger for expensive houses, and translate the MAE into plain language for stakeholders.',
        deliverable: 'A test-set evaluation report with metrics, residual plot, predicted-vs-actual plot, and a plain-language error summary.',
      },
      {
        title: 'Model Comparison',
        guidance:
          'Compare all candidates on the same folds and metrics. Check whether the winner beats the linear baseline by enough to justify its complexity, and whether errors are balanced across price bands before choosing.',
        deliverable: 'A comparison table with the chosen model and a written justification.',
      },
      {
        title: 'Hyperparameter Tuning',
        guidance:
          'Tune the chosen model with randomized search and cross-validation. For gradient boosting, tune learning rate, depth, and number of trees; for Ridge, tune the regularization strength. Record the best configuration and its gain over defaults.',
        deliverable: 'Best hyperparameters, search space, and validation improvement over defaults.',
      },
      {
        title: 'Error Analysis',
        guidance:
          'Find the largest errors and look for patterns: are they luxury homes, unusual neighbourhoods, or renovated properties? Check the residual plot for systematic bias, such as under-predicting expensive houses, and hypothesize a missing feature for each pattern.',
        deliverable: 'A written error profile with the worst-error segments and one hypothesis per pattern.',
      },
      {
        title: 'Explainability',
        guidance:
          'Identify the top price drivers with permutation importance or SHAP, and produce a worked explanation for one listing: which features push its price up or down. For the linear model, present coefficients as "each extra bedroom adds roughly X" in plain language.',
        deliverable: 'A top-drivers chart plus a worked individual explanation for one house.',
      },
      {
        title: 'Business Recommendations',
        guidance:
          'Recommend how the estimate should be shown: a point estimate with a confidence range, not a single exact number. Suggest a review process for listings where the model is uncertain, and estimate how the feature could improve listing engagement.',
        deliverable: 'A one-page recommendation memo with the display format, uncertainty handling, and expected impact.',
      },
      {
        title: 'Limitations & Future Improvements',
        guidance:
          'Document what the model misses: market trends, school quality, upcoming infrastructure, and seller motivation are not in the data. Note that prices drift with the market, so the model needs regular retraining, and propose adding time-based features or external data.',
        deliverable: 'A limitations list with one proposed improvement per limitation.',
      },
      {
        title: 'Deployment Plan',
        guidance:
          'Describe production use: a batch job that scores new listings nightly, or an API for instant estimates. Plan monitoring for prediction drift and realized sale-price error, with a retraining trigger tied to market movement and a fallback to the median-price baseline.',
        deliverable: 'A deployment sketch: scoring path, monitoring metrics, retraining trigger, and fallback.',
      },
    ],
    modelsToTry: ['Linear Regression', 'Ridge Regression', 'Decision Tree Regressor', 'Random Forest Regressor', 'Gradient Boosting Regressor'],
    metrics: [
      'MAE — typical error in currency units, easy to explain to stakeholders',
      'RMSE — penalizes large errors, which matter most for expensive houses',
      'R-squared — share of price variance explained, useful for quick comparison',
      'MAPE — error as a percentage, intuitive but only valid away from zero prices',
    ],
    prerequisites: [
      { skill: 'Python', threshold: 40 },
      { skill: 'Statistics', threshold: 35 },
      { skill: 'Preprocessing', threshold: 30 },
      { skill: 'Algorithms', threshold: 30 },
      { skill: 'Evaluation', threshold: 30 },
    ],
    pitch30s:
      'I built a house price prediction model for a property platform. It estimates a fair sale price from size, location, age, and amenities, with a typical error of around 8%, and it shows sellers which features drive their home\'s value.',
    pitch1min:
      'I built a house price prediction model for a property platform that wanted fair price estimates on every listing. I framed it as regression on the sale price, engineered features like house age, years since renovation, and living area per bedroom, and compared linear regression, Ridge, random forest, and gradient boosting. I evaluated with MAE and RMSE, and gradient boosting won with a typical error of about 8%. The most interesting finding was that the model systematically under-predicted luxury homes, which taught me to check errors by price band rather than trusting one overall metric.',
    pitch3min:
      'I built a house price prediction model for a property platform. The business problem was that listings without a price estimate got less engagement, and manual valuations were slow and inconsistent. I framed it as regression on the final sale price, and one early decision was to model the log of price because the distribution is heavily right-skewed — a few luxury sales would otherwise dominate the error metrics. My key features were house age at sale, years since renovation, living area per bedroom, and neighbourhood, plus an interaction between neighbourhood and living area, since a square foot is worth very different amounts in different areas. I started with a median-price baseline and a simple linear regression, then compared Ridge, random forest, and gradient boosting with cross-validation. Gradient boosting won with an MAE of about 8% of the median price. Error analysis was the most useful step: residuals showed the model under-predicted expensive homes, which makes sense because luxury pricing depends on factors not in the data, like views and finishes. I recommended showing buyers a price range rather than a single number, and flagging high-uncertainty listings for human review. The main lesson was that a single metric hides where a model fails — slicing errors by price band told me far more than the overall MAE.',
    deepDive: [
      'Target choice: modelled log price because the sale-price distribution is right-skewed; luxury sales would otherwise dominate RMSE.',
      'Key features: house age, years since renovation, living area per bedroom, and a neighbourhood-by-area interaction.',
      'Metrics: MAE for typical error in currency units, RMSE to catch large misses, R-squared for quick comparison.',
      'Residual analysis: the model under-predicted luxury homes, revealing that unmeasured factors like views drive high-end prices.',
      'Model comparison: gradient boosting beat linear regression clearly, justifying the extra complexity for this non-linear problem.',
      'Business output: a price range with a confidence band, not a false-precision single number.',
      'Limitation: market drift means the model needs regular retraining as prices move.',
    ],
    toughFollowUps: [
      {
        question: 'Why didn\'t you use a more complex model like a neural network?',
        guidance:
          'Tabular data with 5,000 rows: gradient boosting is the strongest practical choice, and a neural network would need far more data and tuning. Emphasize that model choice follows data size and structure, not fashion.',
      },
      {
        question: 'What would happen if the dataset doubled?',
        guidance:
          'More data would stabilize estimates and help the model learn rarer segments like luxury homes better. The model choice would likely stay the same. Mention that doubling data does not fix missing features like school quality or market trends.',
      },
      {
        question: 'How would you explain this model to a non-technical manager?',
        guidance:
          'Lead with the user outcome: every listing gets a fair price range. Show one worked example — this house is priced higher because of its neighbourhood and recent renovation. Report the typical error in plain language, and be honest about where the model is weak.',
      },
      {
        question: 'Your model under-predicts expensive houses. Is that acceptable?',
        guidance:
          'It is a known limitation with a reason: luxury pricing depends on unmeasured factors. Mitigate by showing wider confidence bands for high-value homes and routing them to human review. Mention that a separate model for the luxury segment is a possible next step.',
      },
      {
        question: 'House prices change over time. How does your model stay accurate?',
        guidance:
          'Retrain on a schedule and monitor realized error against predictions. Add time-based features like a market index or months since sale. A time-based validation split is the honest way to test this.',
      },
      {
        question: 'Why did you model log price instead of raw price?',
        guidance:
          'The price distribution is right-skewed, so raw-price errors are dominated by a few luxury sales. Log price stabilizes variance and makes errors roughly proportional, which matches how buyers think about price differences. Mention you convert predictions back and report MAE in original units.',
      },
    ],
  },
  {
    id: 'customer-segmentation',
    title: 'Customer Segmentation',
    level: 3,
    levelLabel: 'Independent',
    problemType: 'Clustering',
    businessProblem:
      'An e-commerce company sends the same promotions to every customer. High-value loyal customers get generic discounts they did not need, while at-risk customers get nothing until they have already left. Marketing needs distinct customer groups with different behaviour so each group can be treated differently.',
    businessObjective:
      'Discover 4–6 actionable customer segments from purchase behaviour, each with a clear profile and a recommended marketing action, so campaigns can be targeted instead of blanket.',
    targetDefinition:
      'No supervised target: segments are discovered from behaviour, not predicted. Each customer is assigned to one segment based on recency, frequency, monetary value, and category preferences. Success means segments that are distinct, stable, and different enough to justify different actions.',
    datasetId: 'ecommerce',
    datasetDescription:
      'An e-commerce transaction dataset with customer IDs, order dates, order amounts, product categories, and discount usage. Roughly 20,000 customers and 150,000 orders, with skewed spend distributions and a mix of one-time buyers and repeat customers.',
    steps: [
      {
        title: 'Business Problem',
        guidance:
          'Write the business problem from marketing\'s perspective: blanket campaigns waste budget on customers who would buy anyway and miss customers who need attention. Identify the decisions segmentation will change: who gets which offer, and through which channel.',
        deliverable: 'A problem statement naming the marketing decisions segmentation will support.',
      },
      {
        title: 'Problem Framing',
        guidance:
          'Frame this as unsupervised learning: there is no label to predict, so success is defined by segment quality — distinct, stable, interpretable, and actionable. Decide the unit of analysis (one row per customer) and the behaviour window for features.',
        deliverable: 'Written framing: unit of analysis, behaviour window, and the four success criteria.',
      },
      {
        title: 'Data Understanding',
        guidance:
          'Inspect the transaction data: shape, date range, order counts per customer, and the grain (one row per order). Check for test orders, cancelled orders, and negative amounts. Confirm the customer ID is reliable as the join key.',
        deliverable: 'A data dictionary plus notes on grain, date range, and data quality issues.',
      },
      {
        title: 'EDA',
        guidance:
          'Explore the distribution of orders per customer, spend per customer, and time between orders. Check what share of revenue comes from the top 10% of customers and how category preferences vary. Look for natural groupings before clustering anything.',
        deliverable: '5–8 charts with a summary of customer behaviour patterns and concentration of revenue.',
      },
      {
        title: 'Data Cleaning',
        guidance:
          'Remove cancelled and test orders, handle negative or zero amounts, and decide how to treat one-time buyers with a single order. Aggregate the transaction table to one row per customer only after cleaning rules are defined.',
        deliverable: 'A cleaning log with the treatment of cancelled orders, one-time buyers, and row counts.',
      },
      {
        title: 'Feature Engineering',
        guidance:
          'Build RFM features per customer: recency (days since last order), frequency (order count), and monetary (total and average spend). Add category diversity, discount share of orders, and average days between orders. Log-transform skewed monetary features before clustering.',
        deliverable: 'A customer-level feature table with a one-line justification per feature.',
      },
      {
        title: 'Train/Test Split',
        guidance:
          'Clustering has no test set in the supervised sense, so instead plan a stability check: hold out a random 20% subsample and re-run clustering to confirm the segments reappear. Document this validation plan before choosing k.',
        deliverable: 'A written stability-check plan with the holdout subsample defined.',
      },
      {
        title: 'Baseline',
        guidance:
          'Build a simple rule-based baseline segmentation: RFM quartiles, e.g. high-recency high-spend customers versus everyone else. Profile these rule-based groups so you can show what clustering adds beyond simple rules.',
        deliverable: 'Rule-based segments with a profile table, as the comparison point for clustering.',
      },
      {
        title: 'Model Selection',
        guidance:
          'Shortlist k-means, hierarchical clustering, and DBSCAN. Decide the selection criteria up front: silhouette score and Davies-Bouldin index for internal quality, plus stability and business interpretability. Note that k-means needs scaled features and a chosen k.',
        deliverable: 'A shortlist of algorithms with the selection criteria and the scaling plan.',
      },
      {
        title: 'Model Training',
        guidance:
          'Scale the features and run k-means for k from 2 to 10, recording inertia and silhouette score for each. Use k-means++ initialization and multiple random starts to avoid bad local optima. Also run hierarchical clustering on a sample for comparison.',
        deliverable: 'Elbow plot, silhouette scores per k, and clustering runs saved for each k.',
      },
      {
        title: 'Evaluation',
        guidance:
          'Evaluate the chosen k with silhouette score and Davies-Bouldin index, then run the stability check: re-cluster the holdout subsample and compare segment profiles. A good solution is stable across subsamples and random seeds.',
        deliverable: 'An evaluation report with internal metrics and stability-check results.',
      },
      {
        title: 'Model Comparison',
        guidance:
          'Compare k-means against hierarchical clustering and the RFM-quartile baseline on metrics and interpretability. Choose the solution whose segments are most distinct in business terms, not just the highest silhouette score.',
        deliverable: 'A comparison table with the chosen algorithm and k, plus the justification.',
      },
      {
        title: 'Hyperparameter Tuning',
        guidance:
          'Tune the key choices: the number of clusters k, the feature set, and the scaling method. Test whether dropping a noisy feature or adding a category-preference feature changes the segments. Record which choices the solution is sensitive to.',
        deliverable: 'A sensitivity note: which choices change the segments and which do not.',
      },
      {
        title: 'Error Analysis',
        guidance:
          'Examine customers with low or negative silhouette scores — the ones sitting between clusters — and check for outliers distorting centroids. Decide whether borderline customers need a "mixed" treatment or a nearest-centroid assignment rule.',
        deliverable: 'A written note on borderline customers, outliers, and the assignment rule for new customers.',
      },
      {
        title: 'Explainability',
        guidance:
          'Profile each segment on the original business variables: average spend, order frequency, recency, favourite categories, and discount usage. Give every segment a plain-language name, like "Loyal Big Spenders" or "At-Risk Occasionals", that marketing can use directly.',
        deliverable: 'A segment profile table with names, sizes, and defining characteristics for each segment.',
      },
      {
        title: 'Business Recommendations',
        guidance:
          'Recommend one concrete action per segment: retention offers for at-risk high-value customers, loyalty rewards for champions, reactivation campaigns for lapsed buyers. Estimate the revenue at stake in each segment and suggest the channel and timing for each action.',
        deliverable: 'A one-page recommendation memo with one action, channel, and revenue estimate per segment.',
      },
      {
        title: 'Limitations & Future Improvements',
        guidance:
          'Document that segments are descriptive, not causal — they show who behaves similarly, not why. Note that behaviour drifts, so segments need periodic refresh, and that a purely behavioural view misses attitudes and demographics. Propose adding survey or browsing data next.',
        deliverable: 'A limitations list with one proposed improvement per limitation.',
      },
      {
        title: 'Deployment Plan',
        guidance:
          'Describe how segments reach marketing: a monthly batch job that re-scores customers and writes segment labels to the CRM, with a rule for assigning new customers to the nearest centroid. Plan monitoring for segment size drift and a quarterly re-clustering review.',
        deliverable: 'A deployment sketch: scoring cadence, new-customer assignment rule, monitoring, and refresh schedule.',
      },
    ],
    modelsToTry: ['K-Means', 'Hierarchical Clustering', 'DBSCAN', 'Gaussian Mixture Models'],
    metrics: [
      'Silhouette score — cohesion within segments versus separation between them',
      'Davies-Bouldin index — lower means better-separated, tighter clusters',
      'Stability across subsamples — segments should reappear when re-run on held-out data',
      'Business distinctness — segments must differ meaningfully on revenue, frequency, and behaviour',
    ],
    prerequisites: [
      { skill: 'Python', threshold: 50 },
      { skill: 'Statistics', threshold: 40 },
      { skill: 'Preprocessing', threshold: 45 },
      { skill: 'Algorithms', threshold: 45 },
      { skill: 'Evaluation', threshold: 40 },
      { skill: 'Problem Solving', threshold: 40 },
    ],
    pitch30s:
      'I segmented an e-commerce company\'s customers into five behaviour-based groups using RFM features and k-means. Each segment got a different marketing action — the at-risk high-value group alone was worth a large share of revenue, and they had been getting the same generic emails as everyone else.',
    pitch1min:
      'I built a customer segmentation for an e-commerce company that was sending the same promotion to everyone. I aggregated transactions into RFM features — recency, frequency, and monetary value — plus category diversity and discount usage, then used k-means clustering. I chose five segments using the elbow method and silhouette scores, and validated them with a stability check on a held-out subsample. The segments ranged from loyal big spenders to at-risk occasionals, and I recommended a specific action per segment. The key insight was that about 4% of customers drove a large share of revenue and were at risk of churning with no targeted retention effort.',
    pitch3min:
      'I built a customer segmentation for an e-commerce company. The business problem was that marketing sent identical promotions to every customer, so loyal high-value customers got discounts they did not need while at-risk customers got nothing. I framed it as unsupervised learning: there is no label, so success meant segments that are distinct, stable, interpretable, and actionable. I aggregated 150,000 orders into one row per customer with RFM features — recency, frequency, monetary value — plus category diversity, discount share, and average days between orders. I log-transformed the skewed spend features and scaled everything before clustering, since k-means uses Euclidean distance. I ran k-means for k from 2 to 10 and combined the elbow method with silhouette scores to pick five clusters, then validated stability by re-running on a held-out subsample. The segments told a clear story: loyal big spenders, frequent small-basket buyers, new customers, at-risk occasionals, and lapsed one-time buyers. The most valuable finding was the at-risk group — high past spend, no recent orders — which was a small share of customers but a large share of revenue, and they had received no targeted outreach. I recommended a specific action per segment, from loyalty rewards to reactivation campaigns, and a monthly re-scoring job so segments stay fresh. The main lesson was that the best statistical k is not always the best business k: I picked five over six because the sixth split produced two segments marketing could not treat differently.',
    deepDive: [
      'RFM features: recency, frequency, and monetary value summarize a customer\'s whole relationship in three numbers.',
      'Scaling is mandatory: k-means uses Euclidean distance, so unscaled spend would dominate recency.',
      'Choosing k: elbow method plus silhouette score, then a business sanity check on whether segments justify different actions.',
      'Stability validation: re-clustering a held-out subsample to confirm segments are real, not random-seed artefacts.',
      'Baseline comparison: RFM quartiles as a rule-based baseline, so clustering has to earn its complexity.',
      'Segment naming: plain-language names like "Loyal Big Spenders" make the output usable by marketing directly.',
      'New-customer assignment: nearest-centroid rule so the segmentation works in production, not just in a notebook.',
    ],
    toughFollowUps: [
      {
        question: 'Why didn\'t you use DBSCAN or hierarchical clustering instead of k-means?',
        guidance:
          'K-means is fast, scales to 20,000 customers, and produces the roughly spherical, similarly sized segments marketing can act on. Hierarchical clustering is too slow at this scale for full data, and DBSCAN struggled because customer density varies hugely. Mention you ran hierarchical on a sample as a cross-check.',
      },
      {
        question: 'What would happen if the dataset doubled?',
        guidance:
          'K-means scales well, so runtime is not the issue. The segments might shift if the new customers are a different mix — for example, a new region. You would re-run the stability check and re-validate k rather than assuming five clusters still fits.',
      },
      {
        question: 'How would you explain this to a non-technical manager?',
        guidance:
          'Skip the algorithm entirely: show the five segments as customer personas with size, spend, and one recommended action each. Lead with the money — how much revenue sits in the at-risk segment — and show that the segments are stable, not a one-off artefact.',
      },
      {
        question: 'How do you know five segments is right and not four or six?',
        guidance:
          'Combine evidence: elbow and silhouette scores pointed to the 4–6 range, stability checks held for five, and the business test decided it — with six, two segments were too similar to treat differently; with four, the at-risk high-value group was buried inside a larger segment.',
      },
      {
        question: 'A new customer joins tomorrow. Which segment are they in?',
        guidance:
          'Use the nearest-centroid rule: compute their RFM features, scale them with the saved scaler, and assign the closest centroid. Note that brand-new customers with one order have unreliable RFM values, so they start in a "new customer" segment until they build history.',
      },
      {
        question: 'How would you prove this segmentation actually improved marketing results?',
        guidance:
          'Run an A/B test: target the at-risk segment with a retention offer and compare reactivation against a holdout group that gets the generic campaign. Measure incremental revenue and reactivation rate, not just open rates.',
      },
    ],
  },
  {
    id: 'sales-forecasting',
    title: 'Sales Forecasting',
    level: 4,
    levelLabel: 'Interview project',
    problemType: 'Forecasting',
    businessProblem:
      'A retail chain plans inventory, staffing, and promotions weeks ahead, but its forecasts come from gut feel and last-year comparisons. Over-forecasting ties up cash in unsold stock; under-forecasting causes stockouts and lost sales. The business needs a systematic forecast it can plan against — with an honest sense of how wrong it might be.',
    businessObjective:
      'Forecast weekly sales for the next 4 weeks at store and category level, with accuracy good enough to drive inventory ordering, and with uncertainty ranges so planners know when to hold safety stock.',
    targetDefinition:
      'Continuous target: total sales revenue per store per week, forecast 1–4 weeks ahead. The forecast origin rolls forward weekly. Success is measured on held-out recent weeks using time-based validation, never a random split.',
    datasetDescription:
      'A multi-year retail sales dataset with weekly sales by store and category, plus promotional calendars, holiday flags, store size, and local events. Roughly 3 years of history across 20 stores, with strong weekly seasonality, festival-season spikes, and a growth trend. Learners source a comparable public dataset (e.g. a retail sales dataset with store, date, and sales columns) and adapt the steps to its schema.',
    steps: [
      {
        title: 'Business Problem',
        guidance:
          'Write the business problem from the planner\'s perspective: what decisions depend on the forecast, what over- and under-forecasting each cost, and what horizon matters. Note that a forecast without an uncertainty range is only half a deliverable.',
        deliverable: 'A problem statement naming the planning decisions, error costs, and required horizon.',
      },
      {
        title: 'Problem Framing',
        guidance:
          'Frame sales forecasting as a time-series regression problem: predict weekly sales 1–4 weeks ahead, per store and category. Define the forecast origin, the horizon, and the aggregation level. Decide whether to model revenue directly or units sold.',
        deliverable: 'Written framing: target, horizon, aggregation level, and forecast origin rules.',
      },
      {
        title: 'Data Understanding',
        guidance:
          'Inspect the sales history: date range, stores, categories, and the grain (one row per store-week-category). Check for missing weeks, store closures, and data gaps. Confirm the calendar of promotions and holidays is complete for the full history.',
        deliverable: 'A data dictionary plus notes on grain, date coverage, gaps, and calendar completeness.',
      },
      {
        title: 'EDA',
        guidance:
          'Plot sales over time to see trend, weekly seasonality, and festival spikes. Decompose the series into trend, seasonal, and residual components. Compare stores and categories, and check how promotions and holidays move sales.',
        deliverable: 'Time-series plots, a decomposition, and a summary of trend, seasonality, and promotion effects.',
      },
      {
        title: 'Data Cleaning',
        guidance:
          'Handle missing weeks by distinguishing true zero sales (closed store) from missing data. Treat one-off anomalies like a bulk corporate order explicitly — flag them rather than silently deleting them. Build a complete calendar grid so every store-week exists.',
        deliverable: 'A cleaning log with the treatment of missing weeks and anomalies, and a complete calendar grid.',
      },
      {
        title: 'Feature Engineering',
        guidance:
          'Build time features: week of year, month, holiday and festival flags, and days since the last promotion. Add lag features (sales 1, 2, 4, and 52 weeks ago) and rolling means, computed strictly from past data. Add store-level features like size and category mix.',
        deliverable: 'A feature list with lag and rolling definitions, and a note confirming no future data is used.',
      },
      {
        title: 'Train/Test Split',
        guidance:
          'Use a time-based split: train on the earlier period, validate on the most recent weeks. Never shuffle time-series data. Use an expanding-window or rolling-origin setup so the validation mimics how the forecast will actually be used.',
        deliverable: 'A time-based split with the cutoff date documented and a rolling-origin validation plan.',
      },
      {
        title: 'Baseline',
        guidance:
          'Build two baselines: the naive forecast (next week equals last week) and the seasonal naive forecast (next week equals the same week last year). Record MAE, RMSE, and MAPE for both. Any model must beat seasonal naive to be worth deploying.',
        deliverable: 'Baseline metrics table with interpretation of what seasonal naive proves.',
      },
      {
        title: 'Model Selection',
        guidance:
          'Shortlist a time-series model (Holt-Winters or SARIMA-style), a regression with time features, and a gradient boosting model on lag features. Decide the selection metric up front — MAPE for planner-friendly percentages, MAE for absolute error — and note the interpretability needs of planners.',
        deliverable: 'A shortlist of models with the selection metric and the reasoning behind it.',
      },
      {
        title: 'Model Training',
        guidance:
          'Train each candidate on the training window, respecting the time order. For the ML models, build features inside a pipeline so lag computation is reproducible. Use rolling-origin cross-validation with multiple origins to get a stable estimate.',
        deliverable: 'Trained models for all candidates with rolling-origin validation scores.',
      },
      {
        title: 'Evaluation',
        guidance:
          'Evaluate on the held-out recent weeks with MAE, RMSE, and MAPE, broken down by horizon (week 1 versus week 4) and by store. Plot forecast versus actual for the test period and check whether errors spike around festivals or promotions.',
        deliverable: 'A test-period evaluation report with metrics by horizon and store, plus forecast-vs-actual plots.',
      },
      {
        title: 'Model Comparison',
        guidance:
          'Compare candidates on the same rolling origins and metric. Check whether the winner beats seasonal naive by a margin that matters for ordering decisions, and whether accuracy degrades gracefully with horizon before choosing.',
        deliverable: 'A comparison table with the chosen model and a justification covering accuracy and horizon behaviour.',
      },
      {
        title: 'Hyperparameter Tuning',
        guidance:
          'Tune the chosen model with time-series-aware validation — never random folds. For gradient boosting, tune learning rate, depth, and number of trees; for Holt-Winters, tune smoothing parameters. Record the best configuration and its gain.',
        deliverable: 'Best hyperparameters, the time-aware validation setup, and the gain over defaults.',
      },
      {
        title: 'Error Analysis',
        guidance:
          'Find the weeks and stores with the largest errors and look for patterns: festival weeks, promotion weeks, or new stores with short history. Check whether the model systematically over- or under-forecasts, and hypothesize a missing feature for each pattern.',
        deliverable: 'A written error profile with the worst-error periods and one hypothesis per pattern.',
      },
      {
        title: 'Explainability',
        guidance:
          'Identify the top drivers of the forecast — lags, seasonality, promotions — with feature importance or decomposition plots. Produce a worked explanation for one store-week: why the forecast is high or low, in language a planner can act on.',
        deliverable: 'A top-drivers summary plus a worked explanation for one store-week forecast.',
      },
      {
        title: 'Business Recommendations',
        guidance:
          'Recommend how planners should use the forecast: order to the point forecast, hold safety stock from the prediction interval, and treat festival weeks with extra caution. Estimate the stockout and overstock reduction versus the current gut-feel process.',
        deliverable: 'A one-page recommendation memo with ordering guidance, safety-stock logic, and estimated impact.',
      },
      {
        title: 'Limitations & Future Improvements',
        guidance:
          'Document what the model cannot predict: competitor actions, weather shocks, and one-off events. Note that accuracy degrades with horizon and that new stores have no history. Propose adding external data like weather or promotions calendars, and a hierarchical forecast that reconciles store and total levels.',
        deliverable: 'A limitations list with one proposed improvement per limitation.',
      },
      {
        title: 'Deployment Plan',
        guidance:
          'Describe production use: a weekly batch job that refits or updates the model and writes 4-week forecasts to the planning system. Plan monitoring for forecast error by week, drift in sales patterns, and a retraining trigger after major regime changes, with seasonal naive as the fallback.',
        deliverable: 'A deployment sketch: refresh cadence, monitoring metrics, retraining trigger, and fallback.',
      },
    ],
    modelsToTry: ['Seasonal Naive (baseline)', 'Holt-Winters Exponential Smoothing', 'Linear Regression with Time Features', 'Gradient Boosting on Lag Features', 'Prophet / SARIMA (optional stretch)'],
    metrics: [
      'MAPE — percentage error, the metric planners understand and compare across stores',
      'MAE — typical error in currency units, easy to translate into stock decisions',
      'RMSE — penalizes large misses, which cause the worst stockouts',
      'Bias (mean error) — detects systematic over- or under-forecasting',
    ],
    prerequisites: [
      { skill: 'Python', threshold: 60 },
      { skill: 'Statistics', threshold: 55 },
      { skill: 'Preprocessing', threshold: 50 },
      { skill: 'Algorithms', threshold: 55 },
      { skill: 'Evaluation', threshold: 55 },
      { skill: 'Feature Engineering', threshold: 55 },
      { skill: 'Model Selection', threshold: 50 },
    ],
    pitch30s:
      'I built a sales forecasting model for a retail chain that predicts weekly sales four weeks ahead per store. It beats the seasonal naive baseline by about 25% on MAPE, and it gives planners a range, not just a single number, so they know when to hold safety stock.',
    pitch1min:
      'I built a sales forecasting model for a retail chain that was planning inventory on gut feel. I framed it as a time-series problem: predict weekly sales one to four weeks ahead per store. I engineered lag features, rolling means, and holiday and promotion flags, and I validated with rolling-origin cross-validation because random splits leak future information in time series. I compared seasonal naive, Holt-Winters, and gradient boosting on lag features; gradient boosting won with a MAPE of about 9% versus 12% for seasonal naive. The biggest lesson was that forecast accuracy degrades fast with horizon, so I reported errors separately for each week ahead instead of hiding behind one overall number.',
    pitch3min:
      'I built a sales forecasting model for a retail chain. The business problem was that inventory planning ran on gut feel and last-year comparisons, so the chain alternated between overstock and stockouts. I framed it as a time-series regression: predict weekly sales one to four weeks ahead, per store and category. The first real decision was validation: I used a time-based split and rolling-origin cross-validation, because shuffling time-series data leaks the future into training and produces fantasy scores. My features were lag sales at one, two, four, and fifty-two weeks, rolling means, week-of-year seasonality, and holiday and promotion flags — all computed strictly from past data. I started with seasonal naive as the baseline, which is surprisingly hard to beat, then compared Holt-Winters and gradient boosting on lag features. Gradient boosting won with a MAPE of about 9% versus 12% for seasonal naive, and I reported the error separately by horizon, since week-four forecasts are much less accurate than week-one. Error analysis showed the worst misses clustered around festival weeks, which suggests adding festival-specific features next. I recommended planners order to the point forecast but hold safety stock based on the prediction interval, and I documented that the model cannot foresee competitor moves or weather shocks. The main lesson was that in forecasting, the validation design matters more than the algorithm — a random split would have made any model look brilliant and useless.',
    deepDive: [
      'Validation design: time-based split plus rolling-origin cross-validation; random splits leak the future in time series.',
      'Lag features: sales at 1, 2, 4, and 52 weeks ago, plus rolling means — all computed strictly from past data.',
      'Baseline discipline: seasonal naive is a strong baseline, and any model must beat it to justify deployment.',
      'Horizon reporting: errors reported separately for week 1 through week 4, since accuracy degrades with horizon.',
      'Seasonality: week-of-year and festival flags capture the strong seasonal pattern in retail sales.',
      'Uncertainty: prediction intervals, not just point forecasts, so planners can size safety stock.',
      'Error pattern: worst misses cluster around festival weeks, pointing to festival-specific features as the next improvement.',
    ],
    toughFollowUps: [
      {
        question: 'Why didn\'t you use a deep learning model like an LSTM?',
        guidance:
          'Three years of weekly data across 20 stores is too little for an LSTM to shine, and gradient boosting on lag features is stronger, faster, and explainable at this scale. Mention you would consider deep learning only with much longer history or many more series.',
      },
      {
        question: 'What would happen if the dataset doubled?',
        guidance:
          'More history would help most for long lags and seasonal patterns — a second or third year of festival data would sharpen the seasonal estimates. The validation design and model choice would stay the same. Note that more stores would add value only if they behave similarly.',
      },
      {
        question: 'How would you explain this forecast to a non-technical manager?',
        guidance:
          'Lead with the planning decision: how much to order each week and how much safety stock to hold. Show the forecast as a range, explain the typical error in plain language, and be honest that week-four forecasts are less reliable than week-one.',
      },
      {
        question: 'A festival week is coming and your model has only seen two similar festivals. What do you do?',
        guidance:
          'Flag the forecast as high-uncertainty and widen the prediction interval. Use the seasonal naive value as a sanity check and involve planners, who have judgement the model lacks. Suggest adding festival-specific features once more festival history accumulates.',
      },
      {
        question: 'How would you know if this forecast stops working in production?',
        guidance:
          'Track realized MAPE weekly against the validation baseline, and monitor for drift in sales patterns. A sustained rise in error triggers investigation — first the data pipeline, then behaviour change — before retraining.',
      },
      {
        question: 'Why is a random train-test split wrong for this project?',
        guidance:
          'Shuffling mixes past and future, so the model trains on data from after the test period — leakage. The validation score looks great but the live forecast fails. Time-based splits and rolling origins are the honest setup because they mimic real forecasting.',
      },
    ],
  },
];




