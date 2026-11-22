// Business cases — end-to-end ML reasoning, no code execution.
// Companies are fictional. Each decision has one best option and,
// where a second option is genuinely defensible, an acceptable one.
import type { BusinessCase } from '../types';

export const BUSINESS_CASES: BusinessCase[] = [
  {
    id: 'case-churn',
    title: 'Churn Is Up 12% — Find the Levers',
    company: 'KartLane (fictional Indian e-commerce company)',
    scenario:
      'KartLane, a mid-sized e-commerce company with 400,000 active customers, has watched its quarterly churn rate climb from 18% to 30% over two quarters — up 12 points. Leadership wants a churn model that identifies at-risk customers early enough for the retention team to act, and they want to know WHY customers leave, not just WHO. You are the analyst owning the project end to end.',
    context: [
      'Churn rate rose from 18% to 30% in two quarters; leadership wants early warning plus reasons, not just a score.',
      'Data available: 3 years of orders, app sessions, support tickets, returns, and discount usage; no exit surveys.',
      'Median customer orders every 45 days; 60% of revenue comes from repeat buyers.',
      'The "income" column is missing for 40% of customers; support-ticket text is unstructured.',
      'Retention budget covers a meaningful offer to at most 10% of customers per month.',
      'A previous churn model (built by an intern, accuracy 82%) was never used — nobody trusted it or knew what it measured.',
    ],
    decisions: [
      {
        id: 'case-churn-target',
        label: 'Target definition',
        prompt: 'How should "churned" be defined for the model?',
        options: [
          'No order in the last 30 days.',
          'No order in the last 90 days.',
          'Account deleted.',
          'App uninstalled.',
        ],
        bestIndex: 1,
        acceptableIndex: 0,
        rationale:
          'With a median order gap of 45 days, 30 days of inactivity is mostly normal behaviour — too noisy as a label. 90 days (two missed cycles) is a stable, observable definition that still leaves time to intervene. Account deletion and uninstalls happen too late and miss the large group that quietly stops ordering. 30 days is defensible only for high-frequency segments (e.g. grocery buyers ordering weekly), where it can be used as a segment-specific definition.',
      },
      {
        id: 'case-churn-features',
        label: 'Features and data',
        prompt: 'Which feature set should the first version use?',
        options: [
          'Demographics only: age, city, income, gender.',
          'RFM (recency, frequency, monetary) plus app engagement, support tickets, returns and discount dependence.',
          'Raw clickstream: every tap and scroll, unaggregated.',
          'Last order value only — the simplest possible signal.',
        ],
        bestIndex: 1,
        rationale:
          'Churn is a behaviour problem, so behaviour features win: RFM captures the customer\'s trajectory, engagement shows fading interest, support tickets and returns capture frustration, and discount dependence flags customers who only buy on offer. Demographics barely move churn and risk unfair targeting; raw clickstream is noisy and high-dimensional for a first version; last order value alone throws away the whole customer history.',
      },
      {
        id: 'case-churn-preprocessing',
        label: 'Preprocessing',
        prompt: 'The "income" column is missing for 40% of customers. What do you do?',
        options: [
          'Drop the income column entirely.',
          'Fill missing incomes with the median income.',
          'Add a "income_missing" indicator and fill the missing values with the median.',
          'Drop all rows with missing income.',
        ],
        bestIndex: 2,
        acceptableIndex: 0,
        rationale:
          'Missingness is often informative — customers who withhold income may behave differently, and the indicator lets the model learn that. Median imputation keeps the rows and gives the model a neutral value. Dropping the column is acceptable (income is a weak churn signal anyway), but dropping 40% of rows would bias the training data toward customers who share income, and plain median imputation without the indicator hides the missingness signal.',
      },
      {
        id: 'case-churn-model',
        label: 'Model choice',
        prompt: 'Which modelling approach for the first version?',
        options: [
          'Logistic regression as an interpretable baseline, then compare against gradient boosting.',
          'Gradient boosting straight away — highest accuracy wins.',
          'K-nearest neighbours on the raw features.',
          'A deep neural network — the data is large enough.',
        ],
        bestIndex: 0,
        acceptableIndex: 1,
        rationale:
          'Leadership explicitly wants to know WHY customers leave, and the last model failed because nobody trusted it. Logistic regression gives coefficients the retention team can read ("each support ticket raises churn odds by ~30%"), which builds trust and directly suggests interventions. Gradient boosting is a strong second step to compare against — if it beats the baseline meaningfully, ship it with explanation tooling. KNN scales badly and is uninterpretable; a neural network is overkill for tabular churn data and the least explainable option.',
      },
      {
        id: 'case-churn-metric',
        label: 'Metric choice',
        prompt: 'How should the model be evaluated?',
        options: [
          'Accuracy — the previous model used it and reached 82%.',
          'Recall on churners at a fixed precision, plus AUC-PR; accuracy as a secondary check.',
          'RMSE on predicted churn probability.',
          'F1 score alone.',
        ],
        bestIndex: 1,
        acceptableIndex: 3,
        rationale:
          'With 30% churners, accuracy is misleading — and the previous model\'s 82% accuracy proved it, since nobody could act on it. The business question is "of the customers who will churn, how many do we catch (recall), and how many of the customers we target are actually at risk (precision)?" AUC-PR summarizes that tradeoff on imbalanced data. F1 is acceptable as a single summary but hides the precision/recall tradeoff the retention team needs to set its targeting threshold. RMSE measures probability calibration, not the ranking quality the team acts on.',
      },
      {
        id: 'case-churn-validation',
        label: 'Validation strategy',
        prompt: 'How should the model be validated?',
        options: [
          'Random 80/20 split — standard practice.',
          'Time-based split: train on earlier quarters, test on the most recent quarter.',
          'No holdout — train on everything and trust cross-validation.',
          'Shuffled 5-fold cross-validation.',
        ],
        bestIndex: 1,
        rationale:
          'Churn behaviour drifts — the rate itself rose 12 points in two quarters — so a random split mixes past and future and overstates how well the model will do next quarter. A time-based split tests exactly what the business needs: predicting churn in a future period from past behaviour. Random splits and shuffled KFold both leak future behaviour patterns into training; skipping a holdout removes any honest check before the retention team acts on the scores.',
      },
      {
        id: 'case-churn-tradeoff',
        label: 'Business tradeoff',
        prompt: 'The retention budget covers offers to 10% of customers per month. How should it be spent?',
        options: [
          'Send an offer to every customer the model flags as at-risk.',
          'Target the top 10% highest-risk customers with a capped offer, and run a holdout group to measure uplift.',
          'Blanket discount to all customers — simpler and fair.',
          'Wait until the model is perfect before acting.',
        ],
        bestIndex: 1,
        rationale:
          'The budget constraint is the decision: rank customers by risk and spend where the model is most confident, which maximizes churners reached per rupee. The holdout group is what makes this a learning system — without it, the team can never tell whether the offers worked or the customers would have stayed anyway. Flagging everyone ignores the budget; blanket discounts subsidize customers who were never leaving; waiting for perfection means churning customers leave while the team polishes a model.',
      },
      {
        id: 'case-churn-deployment',
        label: 'Deployment and monitoring',
        prompt: 'After launch, how should the model be maintained?',
        options: [
          'Deploy once; revisit in a year.',
          'Monthly retraining on the latest data, with a dashboard tracking predicted vs actual churn, feature drift, and offer uplift.',
          'Retrain daily on all data including the most recent day.',
          'No monitoring — the model scored well at launch.',
        ],
        bestIndex: 1,
        rationale:
          'Churn drivers change (the 12-point rise proves it), so the model needs scheduled retraining and monitoring of both the model (drift in features and predictions) and the business outcome (is the actual churn rate falling? are offers working?). Monthly retraining matches the quarterly churn cadence without chasing noise. Daily retraining on fresh data risks leaking the target window and reacting to noise; deploy-and-forget guarantees a slow, silent decay in usefulness.',
      },
    ],
    debrief:
      'Good churn work is defined by the decisions around the model, not the model itself. The target definition (90 days) determines what "churn" even means; the time-based split determines whether the score is honest; the metric (recall at fixed precision) determines whether the retention team can act; and the holdout group determines whether anyone ever learns if the offers worked. The previous model failed on trust, not accuracy — so interpretability and honest evaluation are not nice-to-haves, they are the project. Notice also how many decisions are about what NOT to do: don\'t drop 40% of rows, don\'t shuffle time-ordered data, don\'t spend budget on customers who were never leaving.',
    skills: ['Problem Solving', 'Evaluation', 'Model Selection', 'Feature Engineering', 'Deployment'],
  },
  {
    id: 'case-fraud',
    title: 'Stop the Fraud Without Blocking Good Customers',
    company: 'PaySwift (fictional payments fintech)',
    scenario:
      'PaySwift processes 2 million transactions a day. Fraud losses have doubled in six months, but the current rule-based system blocks 3% of genuine transactions — and every blocked payment risks losing a customer forever. You are building the first ML fraud model. It must score transactions in under 100 milliseconds, catch fraud the rules miss, and keep false positives low enough that support is not flooded.',
    context: [
      '2 million transactions/day; fraud is 0.3% of volume but losses doubled in 6 months.',
      'Current rule-based system blocks 3% of genuine transactions; support tickets about blocked payments are rising.',
      'Fraud labels arrive late: confirmed fraud is known only after chargebacks, typically 30-60 days later.',
      'Scoring latency budget is 100 ms per transaction at peak load.',
      'Features available: amount, merchant, device fingerprint, location, time, and 90 days of per-user history.',
      'Regulators require an explanation for every blocked transaction.',
    ],
    decisions: [
      {
        id: 'case-fraud-target',
        label: 'Target definition',
        prompt: 'How should the fraud label be defined?',
        options: [
          'Chargeback-confirmed fraud within a fixed 60-day observation window.',
          'Any transaction the current rules flag.',
          'Any transaction a user reports as suspicious.',
          'Transactions above Rs. 50,000.',
        ],
        bestIndex: 0,
        acceptableIndex: 2,
        rationale:
          'The label must be ground truth, not a copy of the old system: chargeback-confirmed fraud is the only verified outcome, and a fixed 60-day window keeps the label definition consistent across training examples (otherwise recent transactions look "clean" only because their chargebacks have not arrived yet). Rule flags as labels would just teach the model to imitate the rules it is meant to replace. User reports are acceptable as a supplementary signal but are noisy and incomplete — most fraud is never reported by users. Amount alone is not fraud.',
      },
      {
        id: 'case-fraud-features',
        label: 'Features and data',
        prompt: 'Which features matter most for the first version?',
        options: [
          'Transaction amount and merchant category only.',
          'Velocity features (transactions in the last hour/day), device fingerprint, location mismatch, and user history vs current behaviour.',
          'User age, gender and signup date.',
          'The raw transaction JSON, unprocessed.',
        ],
        bestIndex: 1,
        rationale:
          'Fraud is a behaviour anomaly: a genuine user suddenly transacting 5x their normal velocity, from a new device, in a new city, at 3 AM. Velocity, device, geo-mismatch and deviation-from-history features capture exactly that. Amount and merchant alone cannot separate a fraudster from a genuine big spender; demographics are weak and raise fairness concerns; raw JSON is unusable without feature engineering.',
      },
      {
        id: 'case-fraud-preprocessing',
        label: 'Preprocessing',
        prompt: 'Fraud is 0.3% of transactions. How do you handle the imbalance?',
        options: [
          'Do nothing — the model will figure it out.',
          'Generate synthetic fraud examples with SMOTE until the classes are 50/50.',
          'Use class weights so fraud errors cost more, keep the real distribution, and tune the decision threshold on precision-recall.',
          'Downsample genuine transactions to 1% for training and deploy as-is.',
        ],
        bestIndex: 2,
        acceptableIndex: 3,
        rationale:
          'Doing nothing lets the model optimize for the 99.7% majority and ignore fraud entirely (the accuracy trap). Class weights keep the real distribution — so predicted probabilities stay meaningful — while forcing the model to care about fraud errors, and threshold tuning converts the ranking into a business decision. SMOTE on tabular transaction data creates unrealistic synthetic fraud that can distort the boundary. Downsampling is acceptable for training speed, but the model must then be recalibrated before deployment because its probabilities will be systematically too high.',
      },
      {
        id: 'case-fraud-model',
        label: 'Model choice',
        prompt: 'Which model for the first version?',
        options: [
          'Rules only — keep the current system and add more rules.',
          'Logistic regression — simple and fast.',
          'Gradient boosting with calibrated probabilities, benchmarked against logistic regression.',
          'A deep neural network on raw sequences.',
        ],
        bestIndex: 2,
        acceptableIndex: 1,
        rationale:
          'Gradient boosting handles the tabular, non-linear fraud patterns (velocity x device x amount interactions) and is fast enough for the 100 ms budget, while probability calibration keeps the scores meaningful for thresholding. Logistic regression is a fine baseline and genuinely acceptable as a first version — it is fast and explainable — but it will miss interaction effects the boosting model catches. Rules alone are what is already failing; a neural network adds latency, opacity and training complexity for no proven gain on this kind of tabular data.',
      },
      {
        id: 'case-fraud-metric',
        label: 'Metric choice',
        prompt: 'How should the model be evaluated?',
        options: [
          'Accuracy.',
          'AUC-ROC alone.',
          'Recall on fraud at a fixed 1% false-positive rate, plus precision-recall AUC.',
          'F1 score at the default 0.5 threshold.',
        ],
        bestIndex: 2,
        rationale:
          'The business lives on the tradeoff: every point of fraud recall costs false positives (blocked genuine customers). Fixing the false-positive rate at 1% and measuring recall there turns the metric into the actual business decision — "at the false-positive budget we can afford, how much fraud do we catch?" PR-AUC summarizes the tradeoff across thresholds. Accuracy is meaningless at 0.3% fraud; AUC-ROC is optimistic on imbalanced data because true negatives dominate it; F1 at an arbitrary 0.5 threshold ignores that the threshold is the most important business lever in the system.',
      },
      {
        id: 'case-fraud-validation',
        label: 'Validation strategy',
        prompt: 'How should the model be validated?',
        options: [
          'Random split — fraud patterns are stable.',
          'Time-based split: train on earlier months, validate on the most recent month.',
          'Cross-validation with shuffled folds.',
          'Validate on the same data used for training, since fraud is rare.',
        ],
        bestIndex: 1,
        rationale:
          'Fraudsters adapt — attack patterns this month differ from last month\'s, which is why losses doubled. Only a time-based split measures whether the model catches fraud it has not seen yet, in the form it takes now. Random splits and shuffled folds leak future fraud patterns into training and flatter the score. Validating on training data is not validation at all.',
      },
      {
        id: 'case-fraud-tradeoff',
        label: 'Business tradeoff',
        prompt: 'The model outputs a risk score. What action should each score trigger?',
        options: [
          'Block everything above 0.5, allow everything below.',
          'Risk-tiered actions: block high risk, step-up authentication (OTP/biometric) for medium risk, allow low risk.',
          'Allow everything and rely on chargeback insurance.',
          'Block the top 10% riskiest transactions outright.',
        ],
        bestIndex: 1,
        rationale:
          'A single block/allow threshold wastes the middle of the distribution: medium-risk transactions are mostly genuine customers who would be furious at a block, but they are also where most fraud hides. Step-up authentication resolves the uncertainty cheaply — a genuine user passes an OTP in seconds, a fraudster usually cannot. Blocking a fixed top 10% ignores the actual score distribution, and allowing everything abandons the entire point of the model.',
      },
      {
        id: 'case-fraud-deployment',
        label: 'Deployment and monitoring',
        prompt: 'How should the model run in production?',
        options: [
          'Batch scoring once a day — simpler infrastructure.',
          'Real-time scoring under 100 ms, with daily monitoring of approval rate, fraud rate and score drift, plus weekly retraining on newly confirmed labels.',
          'Real-time scoring with no monitoring — the model was validated.',
          'Retrain on every single new transaction.',
        ],
        bestIndex: 1,
        rationale:
          'Fraud decisions happen at payment time, so scoring must be real-time within the latency budget — batch scoring would approve fraud hours before the model sees it. Daily monitoring catches both model decay (score drift, falling fraud recall) and business problems (approval rate dropping means genuine customers are being blocked). Weekly retraining keeps up with adapting fraudsters while respecting the 60-day label delay. No monitoring guarantees silent failure; retraining per transaction is unstable and operationally absurd.',
      },
    ],
    debrief:
      'Fraud is the case where every textbook shortcut fails at once: accuracy lies, random splits lie, the labels arrive two months late, and the "model" is really a decision system (score → block / step-up / allow) wrapped in a latency budget and an explainability requirement. The strongest reasoning here treats the threshold as a business decision, not a model default; treats the 60-day label delay as a first-class design constraint; and never confuses a good offline score with a good production outcome. If you picked the risk-tiered actions and the time-based split, you were thinking like a fraud team, not a Kaggle leaderboard.',
    skills: ['Problem Solving', 'Evaluation', 'Model Selection', 'Deployment', 'Explainability'],
  },
  {
    id: 'case-demand',
    title: 'Forecast Demand After a 20% Sales Drop',
    company: 'MetroFresh Retail (fictional retail chain, 120 stores)',
    scenario:
      'MetroFresh, a 120-store retail chain, saw sales fall 20% year-on-year last quarter — yet stores simultaneously suffer stockouts on some products and overstock on others. The planning team currently orders using last year\'s sales plus gut feel. You are building the first demand forecast to drive weekly replenishment, and the buyers need to trust it enough to actually order from it.',
    context: [
      'Sales down 20% YoY, but stockouts and overstock happen at the same time — the problem is allocation, not just volume.',
      'Data: 3 years of daily sales per SKU per store, prices, promotions, local holiday calendar, and weather.',
      '5,000 SKUs per store; the top 200 SKUs drive 65% of revenue.',
      'Promotions cause 3-5x sales spikes that distort any naive trend.',
      'Buyers order weekly, with a 1-week supplier lead time.',
      'A 1% improvement in forecast accuracy is worth roughly Rs. 40 lakh a year in reduced waste and lost sales.',
    ],
    decisions: [
      {
        id: 'case-demand-target',
        label: 'Target definition',
        prompt: 'What exactly should the model predict?',
        options: [
          'Total company revenue next month.',
          'Units sold per SKU per store per week.',
          'Daily revenue per store.',
          'Monthly sales per product category.',
        ],
        bestIndex: 1,
        acceptableIndex: 2,
        rationale:
          'Replenishment decisions are made in units, per product, per store, per week — so the forecast must be at exactly that grain or the buyers cannot use it. Company revenue and monthly category totals are too coarse to tell any store what to order. Daily store revenue is acceptable as a secondary forecast (useful for staffing), but it cannot drive SKU-level ordering, which is where the stockout/overstock problem lives.',
      },
      {
        id: 'case-demand-features',
        label: 'Features and data',
        prompt: 'Which features should drive the forecast?',
        options: [
          'Last year\'s sales for the same week only.',
          'Price, promotions, seasonality (week of year, festivals), holidays, local events, and recent sales trend.',
          'Store size and city only.',
          'Weather alone — it drives footfall.',
        ],
        bestIndex: 1,
        rationale:
          'Demand is driven by price and promotion (the 3-5x spikes), by calendar (festivals, holidays, weekends) and by momentum (recent trend). A model with all of these can separate a genuine demand drop from a calendar effect — which matters when sales are down 20% and everyone is arguing about why. Last year\'s sales alone cannot see price changes or promotions; store attributes are static and cannot explain weekly movement; weather is a minor driver, not the main one.',
      },
      {
        id: 'case-demand-preprocessing',
        label: 'Preprocessing',
        prompt: 'Promotions cause 3-5x sales spikes. How should they be handled?',
        options: [
          'Delete promotion weeks from the training data — they are outliers.',
          'Keep the data and add promotion indicators and price/discount features so the model learns the spike pattern.',
          'Cap all sales at 2x the median — the spikes are noise.',
          'Ignore promotions entirely; the model will average them out.',
        ],
        bestIndex: 1,
        rationale:
          'Promotion spikes are not noise — they are the most predictable part of the data, and future promotions are known in advance, so the model can and must forecast their effect. Deleting those weeks throws away the signal and biases the model toward non-promotion baselines; capping distorts the true volumes buyers need to order; ignoring promotions leaves the model confused by unexplained spikes. With promo flags and discount depth as features, the model learns "this SKU sells 4x during a 30% off week" — exactly what replenishment needs.',
      },
      {
        id: 'case-demand-model',
        label: 'Model choice',
        prompt: 'Which modelling approach?',
        options: [
          'Seasonal naive baseline first (same week last year, adjusted for trend), then a regression/gradient-boosting model with seasonal and promo features, compared per-SKU vs pooled.',
          'One global deep-learning model for all SKUs and stores.',
          'A separate ARIMA model hand-tuned for each of the 5,000 SKUs.',
          'Linear regression on time alone.',
        ],
        bestIndex: 0,
        rationale:
          'The seasonal naive baseline is the honesty check — if a fancy model cannot beat "same week last year", it is not worth shipping, and buyers understand the baseline instantly. Regression/boosting with seasonal and promo features then captures what the baseline cannot (price changes, promotions, trend breaks), and comparing per-SKU vs pooled models answers the real design question (pooled models borrow strength for slow SKUs). A single global deep model is opaque to buyers and hard to debug per SKU; 5,000 hand-tuned ARIMA models are unmaintainable; time-only regression misses every driver that matters.',
      },
      {
        id: 'case-demand-metric',
        label: 'Metric choice',
        prompt: 'How should forecast accuracy be measured?',
        options: [
          'RMSE on revenue.',
          'WAPE (weighted absolute percentage error) on units, reported per category and for the top 200 SKUs.',
          'R² of the model fit.',
          'MAPE on all SKUs equally weighted.',
        ],
        bestIndex: 1,
        acceptableIndex: 3,
        rationale:
          'Buyers care about units, not rupees — a 10% error on a high-volume SKU costs far more than a 10% error on a slow one, so the metric must weight by volume (WAPE does this; MAPE does not, and it explodes on low-volume SKUs with intermittent sales). Reporting per category and for the top 200 SKUs shows where the forecast is trustworthy. RMSE on revenue mixes price effects into a volume question; R² measures fit on training data, not forecast quality on future weeks.',
      },
      {
        id: 'case-demand-validation',
        label: 'Validation strategy',
        prompt: 'How should the forecast be validated?',
        options: [
          'Random KFold cross-validation.',
          'A single 80/20 random split.',
          'Rolling-origin backtesting: train on data up to week T, forecast weeks T+1 to T+4, roll T forward, repeat.',
          'No validation — compare against last year\'s numbers directly.',
        ],
        bestIndex: 2,
        rationale:
          'Forecasting must be validated the way it will be used: training only on the past and predicting the future, repeatedly, across different seasons. Rolling-origin backtesting does exactly that and gives an honest error distribution across many forecast origins. Random splits and shuffled KFold leak future information into training (the model sees December while "predicting" November). A single split tests one season only; skipping validation leaves buyers with no evidence at all.',
      },
      {
        id: 'case-demand-tradeoff',
        label: 'Business tradeoff',
        prompt: 'Forecasts are uncertain. How much safety stock should stores hold?',
        options: [
          '99% service level on everything — never stock out.',
          '95% service level on A-items (top sellers), lower on B/C items, sized from the forecast error distribution.',
          'No safety stock — order exactly the forecast.',
          'Double every order — better safe than sorry.',
        ],
        bestIndex: 1,
        rationale:
          'Safety stock is insurance, and insurance should be sized by what a stockout costs: a stockout on a top-200 SKU loses real revenue and customers, while overstocking slow C-items ties up capital and creates waste. ABC-differentiated service levels sized from the measured forecast error turn the model\'s uncertainty into an explicit, defensible inventory policy. 99% on everything is unaffordable overstock; zero safety stock guarantees stockouts half the time (forecasts are wrong in both directions); doubling orders is not a policy, it is panic.',
      },
      {
        id: 'case-demand-deployment',
        label: 'Deployment and monitoring',
        prompt: 'How should the forecast run in production?',
        options: [
          'One forecast per quarter, emailed as a spreadsheet.',
          'Weekly forecast refresh aligned to the ordering cycle, with a dashboard tracking forecast error by category and store, and alerts when error drifts.',
          'Daily reforecasting of all 5,000 SKUs with hourly retraining.',
          'Deploy once and let buyers adjust by feel.',
        ],
        bestIndex: 1,
        rationale:
          'The forecast must refresh on the buyers\' weekly ordering cadence — that is the only rhythm that matters — and the error dashboard is what builds trust: buyers can see which categories the model forecasts well and where to override it. Alerts on drift catch regime changes (like the 20% drop) early. Quarterly spreadsheets go stale before the next order; daily retraining adds noise and cost for a weekly decision; deploy-and-forget leaves buyers with no reason to trust the numbers.',
      },
    ],
    debrief:
      'Demand forecasting rewards boring discipline over clever modelling. The highest-value moves are all about alignment: the target grain matches the ordering decision (SKU-store-week), the validation matches the use (rolling-origin backtests), the metric matches the cost (volume-weighted unit error), and the refresh cadence matches the buyers\' week. The 20% sales drop is a trap for anyone who reaches for a fancier model — the real question is whether the drop is a trend, a calendar effect, or an allocation failure, and only a forecast with promo, price and seasonality features can separate those. And the safety-stock decision shows the pattern that runs through all three cases: the model\'s uncertainty is not a flaw to hide, it is an input to a business decision.',
    skills: ['Problem Solving', 'Evaluation', 'Model Selection', 'Feature Engineering', 'Deployment'],
  },
];
