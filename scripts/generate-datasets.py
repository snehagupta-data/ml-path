#!/usr/bin/env python3
"""
SYNTHETIC DATA GENERATOR — ML LEARNING PLATFORM
================================================
All data produced by this script is SYNTHETIC, generated for learning
purposes only. It is NOT real customer data: names, ids, amounts and
behaviours are invented by a seeded random generator and must never be
treated as real-world facts.

Deterministic: `random.Random(42)` seeds every draw, so re-running this
script reproduces byte-identical CSVs.

Standard library only — run from the project root with:
    python3 scripts/generate-datasets.py

Outputs (into public/data/):
    churn.csv     200 rows — telecom-style customer churn (classification)
    loan.csv      200 rows — loan default prediction (classification)
    housing.csv   200 rows — Mumbai housing prices (regression)
    ecommerce.csv 300 rows — online orders (EDA / aggregation practice)

Intentional data-quality quirks (for preprocessing practice):
    * churn.csv:   ~5% of total_charges values are missing (empty cells)
    * loan.csv:    ~5% of employment_years values are missing (empty cells)

Target-rate calibration: for the two classification datasets, each row gets
a risk score from a logistic-style formula over its features (plus noise),
and the top-K highest-risk rows are labelled positive. That guarantees the
stated class balance exactly while keeping the intended correlations
(month-to-month contract / support calls / low tenure -> churn;
low credit score / high DTI -> default).
"""

import csv
import random
from datetime import date, timedelta
from pathlib import Path

SEED = 42
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "data"

rng = random.Random(SEED)


def write_csv(filename, fieldnames, rows):
    path = OUT_DIR / filename
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    return path


def mean(values):
    return sum(values) / len(values) if values else 0.0


# ─── churn.csv ──────────────────────────────────────────────────────────────

def gen_churn(n=200):
    contracts = ["Month-to-month", "One year", "Two year"]
    payments = [
        "Electronic check",
        "Mailed check",
        "Bank transfer (automatic)",
        "Credit card (automatic)",
    ]
    internet = ["DSL", "Fiber optic", "No"]
    rows = []
    for i in range(n):
        contract = rng.choices(contracts, weights=[55, 25, 20])[0]
        # Tenure depends on contract: month-to-month customers skew newer.
        if contract == "Month-to-month":
            tenure = rng.randint(1, 36)
        elif contract == "One year":
            tenure = rng.randint(6, 48)
        else:
            tenure = rng.randint(12, 72)
        internet_service = rng.choices(internet, weights=[35, 45, 20])[0]
        if internet_service == "Fiber optic":
            monthly = round(rng.uniform(65, 120), 2)
        elif internet_service == "DSL":
            monthly = round(rng.uniform(30, 70), 2)
        else:
            monthly = round(rng.uniform(20, 45), 2)
        total = round(monthly * tenure * rng.uniform(0.9, 1.05), 2)
        # Support calls: unhappy customers call more; also slightly higher
        # for fiber ( pricier service, higher expectations).
        lam = 1.2 + (0.8 if internet_service == "Fiber optic" else 0.0)
        calls = min(12, int(rng.expovariate(1 / lam)))
        rows.append(
            {
                "customer_id": f"C{1000 + i}",
                "age": rng.randint(19, 75),
                "tenure_months": tenure,
                "monthly_charges": monthly,
                "total_charges": total,
                "contract_type": contract,
                "payment_method": rng.choice(payments),
                "internet_service": internet_service,
                "num_support_calls": calls,
                "_risk": 0.0,  # internal only, dropped before writing
            }
        )

    # Risk score: month-to-month + high support calls + low tenure -> churn.
    for r in rows:
        score = -1.0
        if r["contract_type"] == "Month-to-month":
            score += 1.6
        elif r["contract_type"] == "One year":
            score += 0.4
        score += 0.45 * r["num_support_calls"]
        score -= 0.045 * r["tenure_months"]
        score += 0.008 * r["monthly_charges"]
        score += rng.gauss(0, 0.9)  # noise: correlation is strong, not perfect
        r["_risk"] = score

    k = int(round(n * 0.25))  # 50 positives -> exactly 25%
    top = sorted(rows, key=lambda r: r["_risk"], reverse=True)[:k]
    top_ids = {id(r) for r in top}
    for r in rows:
        r["churn"] = 1 if id(r) in top_ids else 0

    # ~5% missing total_charges (10 rows), chosen at random.
    for r in rng.sample(rows, int(round(n * 0.05))):
        r["total_charges"] = ""

    for r in rows:
        del r["_risk"]
    return rows


# ─── loan.csv ───────────────────────────────────────────────────────────────

def gen_loan(n=200):
    ownership = ["RENT", "OWN", "MORTGAGE"]
    purposes = [
        "debt_consolidation",
        "home_improvement",
        "business",
        "education",
        "medical",
        "car",
        "personal",
    ]
    rows = []
    for i in range(n):
        credit = int(min(850, max(300, rng.gauss(660, 85))))
        income = round(rng.lognormvariate(10.6, 0.55))  # ~$40k median
        income = min(max(income, 15_000), 250_000)
        loan_amount = round(rng.uniform(2_000, 45_000), 2)
        # DTI loosely tied to credit: weaker borrowers carry higher DTI.
        dti = round(min(0.55, max(0.05, rng.gauss(0.28, 0.10)
                                  + (650 - credit) * 0.0004)), 2)
        rows.append(
            {
                "loan_id": f"L{2000 + i}",
                "age": rng.randint(21, 68),
                "income": income,
                "loan_amount": loan_amount,
                "loan_term_months": rng.choice([12, 24, 36, 48, 60]),
                "credit_score": credit,
                "employment_years": round(rng.uniform(0, 30), 1),
                "home_ownership": rng.choices(ownership, weights=[45, 30, 25])[0],
                "loan_purpose": rng.choice(purposes),
                "dti_ratio": dti,
                "_risk": 0.0,
            }
        )

    # Risk score: low credit score + high DTI -> default.
    for r in rows:
        score = -1.0
        score += (650 - r["credit_score"]) * 0.012
        score += 6.0 * r["dti_ratio"]
        score += 0.00002 * r["loan_amount"]
        score -= 0.03 * r["employment_years"]
        score += rng.gauss(0, 0.9)
        r["_risk"] = score

    k = int(round(n * 0.18))  # 36 positives -> exactly 18%
    top = sorted(rows, key=lambda r: r["_risk"], reverse=True)[:k]
    top_ids = {id(r) for r in top}
    for r in rows:
        r["default"] = 1 if id(r) in top_ids else 0

    # ~5% missing employment_years (10 rows), chosen at random.
    for r in rng.sample(rows, int(round(n * 0.05))):
        r["employment_years"] = ""

    for r in rows:
        del r["_risk"]
    return rows


# ─── housing.csv ────────────────────────────────────────────────────────────

# Indicative ₹/sqft by location (Mumbai Metropolitan Region, 2025-ish).
RATE_PER_SQFT = {
    "Bandra": 38000,
    "Andheri": 24000,
    "Mulund": 16000,
    "Thane": 13500,
    "Vasai": 8000,
}


def gen_housing(n=200):
    locations = list(RATE_PER_SQFT)
    rows = []
    for i in range(n):
        location = rng.choice(locations)
        area = rng.randint(450, 2200)
        bedrooms = 1 if area < 650 else 2 if area < 1100 else 3 if area < 1700 else 4
        bathrooms = min(bedrooms, rng.randint(1, 3)) if bedrooms <= 2 else rng.randint(2, 4)
        age_years = rng.randint(0, 35)
        floor = rng.randint(0, 28)
        parking = rng.choice(["Yes", "No"])
        rate = RATE_PER_SQFT[location] * rng.uniform(0.85, 1.15)
        price = area * rate
        price *= 1 + 0.04 * (bedrooms - 2)          # extra bedrooms add value
        price *= 1 + (0.03 if parking == "Yes" else 0)
        price *= 1 + min(floor, 15) * 0.004         # higher floors, small premium
        price *= max(0.55, 1 - age_years * 0.008)   # age depreciation
        price *= rng.uniform(0.92, 1.08)            # market noise
        rows.append(
            {
                "id": i + 1,
                "area_sqft": area,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "age_years": age_years,
                "location": location,
                "has_parking": parking,
                "floor": floor,
                "price": int(round(price / 1000) * 1000),  # nearest ₹1,000
            }
        )
    return rows


# ─── ecommerce.csv ──────────────────────────────────────────────────────────

def gen_ecommerce(n=300):
    categories = {
        "Electronics": (499, 49999),
        "Clothing": (299, 4999),
        "Home & Kitchen": (199, 9999),
        "Beauty": (149, 2999),
        "Sports": (399, 14999),
        "Books": (99, 1499),
    }
    payments = ["UPI", "Credit Card", "Debit Card", "Net Banking", "COD", "Wallet"]
    cities = ["Mumbai", "Thane", "Navi Mumbai", "Vasai", "Kalyan", "Pune",
              "Delhi", "Bengaluru", "Hyderabad", "Chennai"]
    start = date(2025, 1, 1)
    rows = []
    for i in range(n):
        category = rng.choice(list(categories))
        lo, hi = categories[category]
        unit_price = round(rng.uniform(lo, hi), 2)
        quantity = rng.choices([1, 2, 3, 4, 5], weights=[55, 25, 10, 6, 4])[0]
        discount = rng.choice([0, 0, 0, 5, 10, 10, 15, 20, 25, 30, 40])
        total = round(quantity * unit_price * (1 - discount / 100), 2)
        rows.append(
            {
                "order_id": f"ORD{5000 + i}",
                "customer_id": f"CUST{rng.randint(100, 399)}",
                "order_date": (start + timedelta(days=rng.randint(0, 364))).isoformat(),
                "category": category,
                "quantity": quantity,
                "unit_price": unit_price,
                "discount_pct": discount,
                "payment_method": rng.choices(
                    payments, weights=[35, 20, 15, 10, 12, 8])[0],
                "city": rng.choices(
                    cities, weights=[25, 12, 10, 6, 6, 10, 10, 10, 6, 5])[0],
                "total_amount": total,
            }
        )
    return rows


# ─── main ───────────────────────────────────────────────────────────────────

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    churn = gen_churn()
    write_csv("churn.csv", [
        "customer_id", "age", "tenure_months", "monthly_charges",
        "total_charges", "contract_type", "payment_method",
        "internet_service", "num_support_calls", "churn",
    ], churn)

    loan = gen_loan()
    write_csv("loan.csv", [
        "loan_id", "age", "income", "loan_amount", "loan_term_months",
        "credit_score", "employment_years", "home_ownership",
        "loan_purpose", "dti_ratio", "default",
    ], loan)

    housing = gen_housing()
    write_csv("housing.csv", [
        "id", "area_sqft", "bedrooms", "bathrooms", "age_years",
        "location", "has_parking", "floor", "price",
    ], housing)

    ecommerce = gen_ecommerce()
    write_csv("ecommerce.csv", [
        "order_id", "customer_id", "order_date", "category", "quantity",
        "unit_price", "discount_pct", "payment_method", "city",
        "total_amount",
    ], ecommerce)

    # ── Verified summary stats (printed, and used in datasets.ts facts) ──
    print(f"churn.csv:     {len(churn)} rows")
    churn_rate = mean([r["churn"] for r in churn]) * 100
    print(f"  churn rate: {churn_rate:.1f}%")
    for contract in ["Month-to-month", "One year", "Two year"]:
        subset = [r for r in churn if r["contract_type"] == contract]
        print(f"  churn rate ({contract:14s}): "
              f"{mean([r['churn'] for r in subset]) * 100:5.1f}%  (n={len(subset)})")
    missing_tc = sum(1 for r in churn if r["total_charges"] == "")
    print(f"  missing total_charges: {missing_tc} rows")
    print(f"  mean tenure: {mean([r['tenure_months'] for r in churn]):.1f} months; "
          f"mean monthly charges: ${mean([r['monthly_charges'] for r in churn]):.2f}")
    print(f"  mean support calls — churned: "
          f"{mean([r['num_support_calls'] for r in churn if r['churn'] == 1]):.2f}, "
          f"retained: "
          f"{mean([r['num_support_calls'] for r in churn if r['churn'] == 0]):.2f}")

    print(f"loan.csv:      {len(loan)} rows")
    default_rate = mean([r["default"] for r in loan]) * 100
    print(f"  default rate: {default_rate:.1f}%")
    for label, lo, hi in [("<600", 0, 599), ("600-699", 600, 699), ("700+", 700, 850)]:
        subset = [r for r in loan if lo <= r["credit_score"] <= hi]
        print(f"  default rate (credit {label:8s}): "
              f"{mean([r['default'] for r in subset]) * 100:5.1f}%  (n={len(subset)})")
    missing_ey = sum(1 for r in loan if r["employment_years"] == "")
    print(f"  missing employment_years: {missing_ey} rows")
    print(f"  mean credit score — defaulted: "
          f"{mean([r['credit_score'] for r in loan if r['default'] == 1]):.0f}, "
          f"repaid: "
          f"{mean([r['credit_score'] for r in loan if r['default'] == 0]):.0f}")
    print(f"  mean DTI — defaulted: "
          f"{mean([r['dti_ratio'] for r in loan if r['default'] == 1]):.2f}, "
          f"repaid: "
          f"{mean([r['dti_ratio'] for r in loan if r['default'] == 0]):.2f}")

    print(f"housing.csv:   {len(housing)} rows")
    prices = [r["price"] for r in housing]
    print(f"  mean price: ₹{mean(prices):,.0f}; "
          f"min ₹{min(prices):,.0f}; max ₹{max(prices):,.0f}")
    for loc in sorted(RATE_PER_SQFT, key=RATE_PER_SQFT.get, reverse=True):
        subset = [r for r in housing if r["location"] == loc]
        print(f"  mean price ({loc:8s}): ₹{mean([r['price'] for r in subset]):,.0f}  "
              f"(n={len(subset)})")
    areas = [r["area_sqft"] for r in housing]
    print(f"  area range: {min(areas)}–{max(areas)} sqft; "
          f"mean {mean(areas):.0f} sqft")

    print(f"ecommerce.csv: {len(ecommerce)} rows")
    totals = [r["total_amount"] for r in ecommerce]
    print(f"  total revenue: ₹{sum(totals):,.2f}; "
          f"mean order value: ₹{mean(totals):,.2f}")
    print(f"  unique customers: {len({r['customer_id'] for r in ecommerce})}; "
          f"date range: {min(r['order_date'] for r in ecommerce)} to "
          f"{max(r['order_date'] for r in ecommerce)}")
    top_cat = max(
        {c: sum(r["total_amount"] for r in ecommerce if r["category"] == c)
         for c in {r["category"] for r in ecommerce}},
        key=lambda c: sum(r["total_amount"] for r in ecommerce if r["category"] == c),
    )
    print(f"  top category by revenue: {top_cat}")
    print("Done. All data is synthetic — generated for learning only.")


if __name__ == "__main__":
    main()
