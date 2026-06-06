export interface Lecture {
  id: string;
  title: string;
  duration: string;
  description: string;
  codeExamples?: { title: string; code: string }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
}

export interface Exercise {
  task: string;
  dataset: string;
  starterCode: string;
  solutionCode: string;
}

export interface Module {
  id: string;
  number: string;
  title: string;
  badge: 'Foundational' | 'Intermediate' | 'Advanced' | 'DB Objects' | 'AI-Assisted' | 'Capstone';
  meta: { lectureCount: number; duration: string };
  lectures: Lecture[];
  quiz: QuizQuestion[];
  exercise: Exercise;
}

export interface Part {
  id: string;
  number: string;
  title: string;
  modules: Module[];
}

export const curriculum: Part[] = [
  {
    id: 'part-1',
    number: 'I',
    title: 'Foundations',
    modules: [
      {
        id: 'mod-01',
        number: '01',
        title: 'Introduction to SQL for Actuaries',
        badge: 'Foundational',
        meta: { lectureCount: 4, duration: '45 min' },
        lectures: [
          {
            id: 'l-01-01',
            title: 'Why SQL Matters in Actuarial Work',
            duration: '10 min',
            description: 'Understand how SQL underpins actuarial data pipelines — from reserving databases to experience studies and IFRS 17 data marts.',
            codeExamples: [
              {
                title: 'Your First Actuarial Query',
                code: `-- Retrieve basic policy data from a life insurance portfolio
SELECT 
    policy_id,
    insured_name,
    date_of_birth,
    sum_assured,
    premium_frequency
FROM policy_master
WHERE policy_status = 'ACTIVE'
ORDER BY date_of_birth ASC
LIMIT 10;`,
              },
            ],
          },
          {
            id: 'l-01-02',
            title: 'Relational Database Concepts',
            duration: '12 min',
            description: 'Tables, rows, columns, primary keys, foreign keys — the building blocks of every actuarial data warehouse.',
            codeExamples: [
              {
                title: 'Exploring Table Relationships',
                code: `-- Understanding how actuarial tables relate
-- policy_master → claims_fact via policy_id
-- claims_fact → claimant_dim via claimant_id

SELECT 
    pm.policy_id,
    pm.product_code,
    cf.claim_id,
    cf.claim_amount,
    cf.claim_date
FROM policy_master pm
INNER JOIN claims_fact cf ON pm.policy_id = cf.policy_id
WHERE pm.policy_status = 'ACTIVE'
  AND cf.claim_date >= '2023-01-01';`,
              },
            ],
          },
          {
            id: 'l-01-03',
            title: 'SQL Execution Order',
            duration: '12 min',
            description: 'Master the logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Critical for writing correct queries.',
            codeExamples: [
              {
                title: 'Logical Query Execution Demo',
                code: `-- Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
SELECT 
    product_code,                          -- 5. SELECT
    COUNT(*) AS claim_count,               -- 5. aggregation
    SUM(claim_amount) AS total_claims,
    AVG(claim_amount) AS avg_claim
FROM claims_fact                           -- 1. FROM
WHERE claim_date BETWEEN '2023-01-01' 
                      AND '2023-12-31'     -- 2. WHERE (pre-aggregation filter)
GROUP BY product_code                      -- 3. GROUP BY
HAVING COUNT(*) > 50                       -- 4. HAVING (post-aggregation filter)
ORDER BY total_claims DESC                 -- 6. ORDER BY
LIMIT 5;                                   -- 7. LIMIT`,
              },
            ],
          },
          {
            id: 'l-01-04',
            title: 'Actuarial Data Architecture Overview',
            duration: '11 min',
            description: 'Common actuarial database schemas: policy-level, claim-level, exposure tables, and how IFRS 17 data marts are structured.',
          },
        ],
        quiz: [
          {
            id: 'q-01-01',
            question: 'In SQL execution order, which clause is processed BEFORE GROUP BY?',
            options: ['SELECT', 'HAVING', 'WHERE', 'ORDER BY'],
            answer: 2,
          },
          {
            id: 'q-01-02',
            question: 'A foreign key in the claims table references:',
            options: ['Another claims record', 'The primary key in the policy table', 'The column data type', 'The database schema'],
            answer: 1,
          },
        ],
        exercise: {
          task: 'Write a query to retrieve all active motor insurance policies issued in the last 3 years, showing policy ID, insured name, sum assured, and annual premium, ordered by sum assured descending.',
          dataset: 'policy_master (policy_id, insured_name, product_code, policy_status, sum_assured, annual_premium, inception_date)',
          starterCode: `SELECT 
    -- TODO: Add the required columns
FROM policy_master
WHERE -- TODO: Add filters
ORDER BY -- TODO: Add ordering;`,
          solutionCode: `SELECT 
    policy_id,
    insured_name,
    sum_assured,
    annual_premium
FROM policy_master
WHERE policy_status = 'ACTIVE'
  AND product_code = 'MOTOR'
  AND inception_date >= DATEADD(YEAR, -3, GETDATE())
ORDER BY sum_assured DESC;`,
        },
      },
      {
        id: 'mod-02',
        number: '02',
        title: 'SELECT Fundamentals',
        badge: 'Foundational',
        meta: { lectureCount: 5, duration: '60 min' },
        lectures: [
          {
            id: 'l-02-01',
            title: 'SELECT, FROM, WHERE',
            duration: '15 min',
            description: 'The core triad of every SQL query. Writing precise WHERE conditions for actuarial data filtering.',
            codeExamples: [
              {
                title: 'Filtering Mortality Experience Data',
                code: `-- Filter mortality claims for experience study
SELECT 
    policy_id,
    insured_age_at_inception,
    gender,
    smoker_status,
    sum_assured,
    date_of_death,
    cause_of_death_code
FROM mortality_claims
WHERE date_of_death BETWEEN '2019-01-01' AND '2023-12-31'
  AND sum_assured >= 100000
  AND smoker_status IN ('S', 'N')   -- Smoker / Non-smoker
  AND cause_of_death_code != 'EXC'; -- Exclude accidental`,
              },
              {
                title: 'DISTINCT and Aliases',
                code: `-- Using DISTINCT and column aliases in actuarial context
SELECT DISTINCT
    product_code                    AS product,
    coverage_type                   AS cover,
    reinsurance_treaty_id           AS treaty
FROM policy_master
WHERE product_code LIKE 'LIFE%'
ORDER BY product, cover;`,
              },
            ],
          },
          {
            id: 'l-02-02',
            title: 'Arithmetic in SELECT',
            duration: '12 min',
            description: 'Computing derived columns: loss ratios, expense ratios, exposure, claim frequencies directly in SQL.',
            codeExamples: [
              {
                title: 'Computing Loss Ratios',
                code: `-- Calculate key actuarial metrics directly in SELECT
SELECT 
    product_code,
    SUM(gross_premium)                              AS earned_premium,
    SUM(incurred_claims)                            AS incurred_claims,
    SUM(incurred_claims) / SUM(gross_premium) * 100 AS loss_ratio_pct,
    SUM(expenses) / SUM(gross_premium) * 100        AS expense_ratio_pct,
    (SUM(incurred_claims) + SUM(expenses)) 
        / SUM(gross_premium) * 100                  AS combined_ratio_pct
FROM underwriting_results
WHERE underwriting_year = 2023
GROUP BY product_code
ORDER BY combined_ratio_pct DESC;`,
              },
            ],
          },
          {
            id: 'l-02-03',
            title: 'ORDER BY and LIMIT',
            duration: '10 min',
            description: 'Sorting actuarial output correctly. Ascending vs descending, multiple columns, TOP/LIMIT for large datasets.',
          },
          {
            id: 'l-02-04',
            title: 'BETWEEN, IN, LIKE, IS NULL',
            duration: '13 min',
            description: 'Practical filtering operators for actuarial datasets: age bands, product lists, code patterns.',
            codeExamples: [
              {
                title: 'Age Band Filtering',
                code: `-- Filter by age bands for mortality study
SELECT 
    policy_id,
    age_at_entry,
    CASE 
        WHEN age_at_entry BETWEEN 18 AND 29 THEN '18-29'
        WHEN age_at_entry BETWEEN 30 AND 44 THEN '30-44'
        WHEN age_at_entry BETWEEN 45 AND 59 THEN '45-59'
        WHEN age_at_entry >= 60 THEN '60+'
    END AS age_band,
    sum_assured
FROM life_policies
WHERE product_code IN ('TERM', 'WHOLE', 'ENDOW')
  AND underwriter_notes IS NULL       -- No flagged risks
ORDER BY age_at_entry;`,
              },
            ],
          },
          {
            id: 'l-02-05',
            title: 'SELECT * vs Column Lists',
            duration: '10 min',
            description: 'Performance and maintainability implications. Best practices for production actuarial code.',
          },
        ],
        quiz: [
          {
            id: 'q-02-01',
            question: 'Which operator tests if a value falls within an inclusive range?',
            options: ['IN', 'LIKE', 'BETWEEN', 'IS NULL'],
            answer: 2,
          },
          {
            id: 'q-02-02',
            question: 'To find policies where the underwriter note starts with "FLAG", you would use:',
            options: ['= "FLAG"', 'IN ("FLAG")', 'LIKE "FLAG%"', 'BETWEEN "FLAG"'],
            answer: 2,
          },
        ],
        exercise: {
          task: 'Calculate the loss ratio, expense ratio, and combined ratio for each product line for underwriting year 2023. Filter out any products with fewer than 100 policies. Order by combined ratio descending.',
          dataset: 'underwriting_results (product_code, underwriting_year, policy_count, gross_premium, incurred_claims, expenses)',
          starterCode: `SELECT 
    product_code,
    -- TODO: Calculate the three ratios
FROM underwriting_results
WHERE -- TODO: Filter by year
GROUP BY product_code
HAVING -- TODO: Minimum policy count
ORDER BY combined_ratio_pct DESC;`,
          solutionCode: `SELECT 
    product_code,
    SUM(incurred_claims) / SUM(gross_premium) * 100  AS loss_ratio_pct,
    SUM(expenses) / SUM(gross_premium) * 100          AS expense_ratio_pct,
    (SUM(incurred_claims) + SUM(expenses)) 
        / SUM(gross_premium) * 100                    AS combined_ratio_pct
FROM underwriting_results
WHERE underwriting_year = 2023
GROUP BY product_code
HAVING SUM(policy_count) >= 100
ORDER BY combined_ratio_pct DESC;`,
        },
      },
      {
        id: 'mod-03',
        number: '03',
        title: 'DDL — Data Definition Language',
        badge: 'Foundational',
        meta: { lectureCount: 4, duration: '50 min' },
        lectures: [
          {
            id: 'l-03-01',
            title: 'CREATE TABLE',
            duration: '15 min',
            description: 'Designing actuarial tables with proper data types, constraints, and naming conventions.',
            codeExamples: [
              {
                title: 'Creating a Claims Fact Table',
                code: `-- Build a claims fact table for a GI portfolio
CREATE TABLE claims_fact (
    claim_id          VARCHAR(20)      PRIMARY KEY,
    policy_id         VARCHAR(20)      NOT NULL,
    claimant_id       INT              NOT NULL,
    claim_date        DATE             NOT NULL,
    report_date       DATE             NOT NULL,
    settlement_date   DATE,
    claim_amount      DECIMAL(15, 2)   NOT NULL CHECK (claim_amount >= 0),
    incurred_amount   DECIMAL(15, 2)   DEFAULT 0,
    paid_amount       DECIMAL(15, 2)   DEFAULT 0,
    ibnr_amount       DECIMAL(15, 2)   DEFAULT 0,
    claim_status      VARCHAR(10)      NOT NULL 
                        CHECK (claim_status IN ('OPEN','CLOSED','REOPENED')),
    cause_code        CHAR(3),
    created_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policy_master(policy_id)
);`,
              },
            ],
          },
          {
            id: 'l-03-02',
            title: 'ALTER TABLE',
            duration: '12 min',
            description: 'Adding columns, modifying constraints, and evolving schemas as actuarial requirements change.',
            codeExamples: [
              {
                title: 'Adding IFRS 17 Columns',
                code: `-- Evolve the policy table for IFRS 17 compliance
ALTER TABLE policy_master
    ADD COLUMN gmm_group_id         VARCHAR(20),
    ADD COLUMN coverage_unit        DECIMAL(10, 4),
    ADD COLUMN csm_allocation_pct   DECIMAL(5, 4),
    ADD COLUMN risk_adjustment      DECIMAL(12, 2),
    ADD COLUMN insurance_contract_revenue DECIMAL(12, 2);

-- Add a check constraint
ALTER TABLE policy_master
    ADD CONSTRAINT chk_csm_pct 
        CHECK (csm_allocation_pct BETWEEN 0 AND 1);`,
              },
            ],
          },
          {
            id: 'l-03-03',
            title: 'DROP, TRUNCATE, and Schema Management',
            duration: '10 min',
            description: 'Safe schema cleanup. TRUNCATE vs DROP. Managing actuarial staging tables.',
          },
          {
            id: 'l-03-04',
            title: 'Data Types for Actuarial Work',
            duration: '13 min',
            description: 'DECIMAL vs FLOAT for financial precision, DATE types, VARCHAR for codes. Avoiding precision errors in claim calculations.',
          },
        ],
        quiz: [
          { id: 'q-03-01', question: 'Which command removes all rows from a table without logging individual row deletions?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], answer: 2 },
          { id: 'q-03-02', question: 'For storing monetary claim amounts, the best data type is:', options: ['FLOAT', 'REAL', 'DECIMAL(15,2)', 'INT'], answer: 2 },
        ],
        exercise: {
          task: 'Design and create a pension liability table to store IAS 19 defined benefit obligation calculations by company, plan, and valuation date.',
          dataset: 'New table: pension_liability_fact',
          starterCode: `CREATE TABLE pension_liability_fact (
    -- TODO: Define primary key
    -- TODO: Add company and plan identifiers
    -- TODO: Add valuation date
    -- TODO: Add DBO, current service cost, interest cost fields
    -- TODO: Add actuarial assumptions (discount rate, salary growth, mortality table)
    -- TODO: Add constraints
);`,
          solutionCode: `CREATE TABLE pension_liability_fact (
    liability_id        BIGINT          PRIMARY KEY IDENTITY(1,1),
    company_id          VARCHAR(10)     NOT NULL,
    plan_id             VARCHAR(20)     NOT NULL,
    valuation_date      DATE            NOT NULL,
    defined_benefit_obligation DECIMAL(18,2) NOT NULL,
    plan_assets         DECIMAL(18,2)   DEFAULT 0,
    funded_status       DECIMAL(18,2) GENERATED ALWAYS AS (plan_assets - defined_benefit_obligation),
    current_service_cost DECIMAL(18,2),
    interest_cost       DECIMAL(18,2),
    remeasurement_gains  DECIMAL(18,2)  DEFAULT 0,
    discount_rate        DECIMAL(6,4)   NOT NULL,
    salary_growth_rate   DECIMAL(6,4),
    mortality_table      VARCHAR(20),
    created_at           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (company_id, plan_id, valuation_date)
);`,
        },
      },
      {
        id: 'mod-04',
        number: '04',
        title: 'DML — Data Manipulation Language',
        badge: 'Foundational',
        meta: { lectureCount: 4, duration: '55 min' },
        lectures: [
          {
            id: 'l-04-01',
            title: 'INSERT — Loading Actuarial Data',
            duration: '15 min',
            description: 'Single-row, multi-row, and INSERT INTO SELECT patterns for loading claims, premiums, and exposure data.',
            codeExamples: [
              {
                title: 'INSERT INTO SELECT — Loading Monthly Exposure',
                code: `-- Load monthly exposure from staging into fact table
INSERT INTO exposure_fact 
    (policy_id, exposure_month, exposure_days, exposed_to_risk, risk_class)
SELECT 
    s.policy_id,
    s.exposure_month,
    DATEDIFF(day, s.period_start, s.period_end) AS exposure_days,
    DATEDIFF(day, s.period_start, s.period_end) / 365.25 AS exposed_to_risk,
    pm.risk_class
FROM staging_exposure s
INNER JOIN policy_master pm ON s.policy_id = pm.policy_id
WHERE s.load_status = 'PENDING'
  AND s.exposure_month = '2024-01-01';`,
              },
            ],
          },
          {
            id: 'l-04-02',
            title: 'UPDATE — Maintaining Data Quality',
            duration: '15 min',
            description: 'Updating claim reserves, correcting coding errors, and IBNR adjustments in actuarial databases.',
            codeExamples: [
              {
                title: 'Updating Reserve Estimates',
                code: `-- Update IBNR estimates after quarterly review
UPDATE claims_fact
SET 
    ibnr_amount     = r.revised_ibnr,
    incurred_amount = paid_amount + r.revised_ibnr,
    updated_at      = CURRENT_TIMESTAMP,
    reviewed_by     = 'FCH_ACTUARIAL_Q4_2023'
FROM claims_fact cf
INNER JOIN ibnr_review r 
    ON cf.claim_id = r.claim_id
   AND r.review_date = '2023-12-31'
WHERE cf.claim_status = 'OPEN'
  AND cf.claim_date >= '2020-01-01';`,
              },
            ],
          },
          {
            id: 'l-04-03',
            title: 'DELETE and Safe Data Removal',
            duration: '12 min',
            description: 'Deleting stale records, purging test data, and the critical importance of WHERE clauses.',
          },
          {
            id: 'l-04-04',
            title: 'MERGE / UPSERT Patterns',
            duration: '13 min',
            description: 'The MERGE statement for actuarial data loads: update if exists, insert if new. Essential for monthly experience data pipelines.',
            codeExamples: [
              {
                title: 'MERGE for Monthly Premium Load',
                code: `-- Upsert monthly premium data into summary table
MERGE INTO premium_summary AS target
USING monthly_premium_staging AS source
    ON target.policy_id = source.policy_id
    AND target.premium_month = source.premium_month
WHEN MATCHED THEN
    UPDATE SET 
        gross_premium   = source.gross_premium,
        net_premium     = source.net_premium,
        ri_premium      = source.ri_premium,
        updated_at      = CURRENT_TIMESTAMP
WHEN NOT MATCHED BY TARGET THEN
    INSERT (policy_id, premium_month, gross_premium, net_premium, ri_premium)
    VALUES (source.policy_id, source.premium_month, 
            source.gross_premium, source.net_premium, source.ri_premium);`,
              },
            ],
          },
        ],
        quiz: [
          { id: 'q-04-01', question: 'A MERGE statement performs what operations?', options: ['Only INSERT', 'Only UPDATE', 'INSERT and UPDATE based on match conditions', 'Only DELETE'], answer: 2 },
          { id: 'q-04-02', question: 'What happens if you run DELETE without a WHERE clause?', options: ['An error is thrown', 'Only the first row is deleted', 'All rows in the table are deleted', 'Nothing happens'], answer: 2 },
        ],
        exercise: {
          task: 'Write a MERGE statement to load monthly claim development data from a staging table into the claims_development fact table, updating existing records if development month already exists.',
          dataset: 'claims_development (claim_id, development_month, cumulative_paid, case_reserve, ibnr), staging_claim_dev (same columns)',
          starterCode: `MERGE INTO claims_development AS target
USING staging_claim_dev AS source
    ON -- TODO: Match condition
WHEN MATCHED THEN
    UPDATE SET -- TODO
WHEN NOT MATCHED THEN
    INSERT -- TODO;`,
          solutionCode: `MERGE INTO claims_development AS target
USING staging_claim_dev AS source
    ON target.claim_id = source.claim_id
   AND target.development_month = source.development_month
WHEN MATCHED THEN
    UPDATE SET 
        cumulative_paid  = source.cumulative_paid,
        case_reserve     = source.case_reserve,
        ibnr             = source.ibnr,
        updated_at       = CURRENT_TIMESTAMP
WHEN NOT MATCHED BY TARGET THEN
    INSERT (claim_id, development_month, cumulative_paid, case_reserve, ibnr)
    VALUES (source.claim_id, source.development_month, 
            source.cumulative_paid, source.case_reserve, source.ibnr);`,
        },
      },
      {
        id: 'mod-05',
        number: '05',
        title: 'Filtering & Logical Operators',
        badge: 'Foundational',
        meta: { lectureCount: 4, duration: '50 min' },
        lectures: [
          {
            id: 'l-05-01',
            title: 'AND, OR, NOT Logic',
            duration: '12 min',
            description: 'Combining conditions correctly in actuarial WHERE clauses. Operator precedence traps.',
            codeExamples: [
              {
                title: 'Complex Actuarial Filtering',
                code: `-- Find high-risk policies for retention review
SELECT policy_id, product_code, sum_assured, risk_score
FROM policy_master
WHERE 
    (product_code IN ('TERM', 'WHOLE') AND sum_assured > 5000000)
    OR (risk_score >= 8 AND policy_status = 'ACTIVE')
    AND NOT underwriting_basis = 'NON_STANDARD'
ORDER BY risk_score DESC, sum_assured DESC;`,
              },
            ],
          },
          {
            id: 'l-05-02',
            title: 'NULL Semantics in Actuarial Data',
            duration: '14 min',
            description: 'Why NULL ≠ zero matters enormously in claim amounts. IS NULL, IS NOT NULL, COALESCE, NULLIF.',
            codeExamples: [
              {
                title: 'NULL-Safe Actuarial Calculations',
                code: `-- Safe handling of NULLs in claims analysis
SELECT 
    claim_id,
    COALESCE(paid_amount, 0)                          AS paid_safe,
    COALESCE(ibnr_amount, 0)                          AS ibnr_safe,
    COALESCE(paid_amount, 0) + COALESCE(ibnr_amount, 0) AS total_incurred,
    NULLIF(reserve_estimate, 0)                        AS reserve_nonzero,
    CASE 
        WHEN settlement_date IS NULL THEN 'OPEN'
        ELSE 'SETTLED'
    END AS claim_stage
FROM claims_fact
WHERE incurred_amount IS NOT NULL;`,
              },
            ],
          },
          {
            id: 'l-05-03',
            title: 'CASE WHEN for Actuarial Classification',
            duration: '14 min',
            description: 'The workhorse of actuarial SQL: age bands, benefit classes, rating factors, risk tiers.',
            codeExamples: [
              {
                title: 'Actuarial Age Banding with CASE',
                code: `SELECT 
    policy_id,
    insured_age,
    CASE 
        WHEN insured_age < 25 THEN 'Young Adult (< 25)'
        WHEN insured_age BETWEEN 25 AND 34 THEN 'Early Career (25-34)'
        WHEN insured_age BETWEEN 35 AND 49 THEN 'Mid Career (35-49)'
        WHEN insured_age BETWEEN 50 AND 64 THEN 'Pre-retirement (50-64)'
        ELSE 'Retirement (65+)'
    END AS age_band,
    CASE gender
        WHEN 'M' THEN 'Male'
        WHEN 'F' THEN 'Female'
        ELSE 'Unknown'
    END AS gender_label,
    -- Actuarial risk premium loading
    CASE 
        WHEN insured_age >= 55 AND smoker_status = 'S' 
            THEN sum_assured * 0.0052
        WHEN insured_age >= 55 
            THEN sum_assured * 0.0031
        WHEN smoker_status = 'S' 
            THEN sum_assured * 0.0018
        ELSE sum_assured * 0.0009
    END AS risk_premium_estimate
FROM life_policies
WHERE policy_status = 'ACTIVE';`,
              },
            ],
          },
          {
            id: 'l-05-04',
            title: 'EXISTS and Subquery Filters',
            duration: '10 min',
            description: 'EXISTS vs IN for large actuarial datasets. Correlated subquery filters for exception identification.',
          },
        ],
        quiz: [
          { id: 'q-05-01', question: 'COALESCE(NULL, NULL, 42, NULL) returns:', options: ['NULL', '0', '42', 'Error'], answer: 2 },
          { id: 'q-05-02', question: 'When comparing a column to NULL, you must use:', options: ['= NULL', '!= NULL', 'IS NULL / IS NOT NULL', 'EQUALS(NULL)'], answer: 2 },
        ],
        exercise: {
          task: 'Classify all active life policies into risk tiers (Low/Medium/High/Very High) based on sum assured and smoking status. Count policies and sum assured in each tier.',
          dataset: 'life_policies (policy_id, policy_status, sum_assured, smoker_status, insured_age)',
          starterCode: `SELECT 
    CASE 
        -- TODO: Define risk tiers
    END AS risk_tier,
    COUNT(*) AS policy_count,
    SUM(sum_assured) AS total_sum_assured
FROM life_policies
WHERE -- TODO: Active policies only
GROUP BY risk_tier
ORDER BY risk_tier;`,
          solutionCode: `SELECT 
    CASE 
        WHEN sum_assured < 500000 AND smoker_status = 'N' THEN 'Low'
        WHEN sum_assured < 500000 AND smoker_status = 'S' THEN 'Medium'
        WHEN sum_assured BETWEEN 500000 AND 2000000 THEN 'Medium'
        WHEN sum_assured > 2000000 AND smoker_status = 'N' THEN 'High'
        WHEN sum_assured > 2000000 AND smoker_status = 'S' THEN 'Very High'
        ELSE 'Medium'
    END AS risk_tier,
    COUNT(*) AS policy_count,
    SUM(sum_assured) AS total_sum_assured
FROM life_policies
WHERE policy_status = 'ACTIVE'
GROUP BY 1
ORDER BY 
    CASE risk_tier 
        WHEN 'Low' THEN 1 
        WHEN 'Medium' THEN 2 
        WHEN 'High' THEN 3 
        ELSE 4 
    END;`,
        },
      },
    ],
  },
  {
    id: 'part-2',
    number: 'II',
    title: 'Intermediate SQL',
    modules: [
      {
        id: 'mod-06',
        number: '06',
        title: 'Joins — Connecting Actuarial Tables',
        badge: 'Intermediate',
        meta: { lectureCount: 6, duration: '75 min' },
        lectures: [
          {
            id: 'l-06-01',
            title: 'INNER JOIN',
            duration: '15 min',
            description: 'Joining policy and claims data. Understanding what rows are excluded in an inner join.',
            codeExamples: [
              {
                title: 'Policy + Claims Inner Join',
                code: `-- Join policy master with claims for experience study
SELECT 
    pm.policy_id,
    pm.product_code,
    pm.inception_date,
    pm.sum_assured,
    cf.claim_id,
    cf.claim_date,
    cf.claim_amount,
    DATEDIFF(day, pm.inception_date, cf.claim_date) AS days_to_claim
FROM policy_master pm
INNER JOIN claims_fact cf 
    ON pm.policy_id = cf.policy_id
WHERE pm.product_code = 'TERM'
  AND cf.claim_date BETWEEN '2020-01-01' AND '2023-12-31'
ORDER BY pm.policy_id, cf.claim_date;`,
              },
            ],
          },
          {
            id: 'l-06-02',
            title: 'LEFT JOIN — Keeping All Policies',
            duration: '15 min',
            description: 'The most important join for actuaries: all policies even with no claims, for exposure calculations.',
            codeExamples: [
              {
                title: 'Exposure with Claim Indicator',
                code: `-- All active policies + claims (NULL where no claim occurred)
-- Essential for mortality rate calculation
SELECT 
    pm.policy_id,
    pm.insured_age,
    pm.gender,
    ef.exposed_to_risk,
    cf.claim_id,
    cf.claim_amount,
    CASE WHEN cf.claim_id IS NOT NULL THEN 1 ELSE 0 END AS has_claim,
    CASE WHEN cf.claim_id IS NOT NULL 
        THEN cf.claim_amount ELSE 0 END AS claim_or_zero
FROM policy_master pm
LEFT JOIN exposure_fact ef ON pm.policy_id = ef.policy_id
LEFT JOIN claims_fact cf   ON pm.policy_id = cf.policy_id
                           AND cf.claim_date = ef.exposure_year
WHERE pm.policy_status = 'ACTIVE';`,
              },
            ],
          },
          {
            id: 'l-06-03', title: 'RIGHT JOIN and FULL OUTER JOIN', duration: '10 min',
            description: 'When to use them in actuarial reconciliations. Identifying orphaned claims records.',
          },
          {
            id: 'l-06-04', title: 'Self Joins for Actuarial Data', duration: '10 min',
            description: 'Joining a table to itself: comparing periods, finding duplicate policies, treaty-within-treaty structures.',
            codeExamples: [
              {
                title: 'Year-on-Year Reserve Comparison',
                code: `-- Compare claim reserves year-on-year using self join
SELECT 
    cy.claim_id,
    cy.valuation_date AS current_year,
    cy.case_reserve   AS current_reserve,
    py.valuation_date AS prior_year,
    py.case_reserve   AS prior_reserve,
    cy.case_reserve - py.case_reserve AS reserve_movement
FROM claim_valuations cy
INNER JOIN claim_valuations py 
    ON cy.claim_id = py.claim_id
   AND py.valuation_date = DATEADD(YEAR, -1, cy.valuation_date)
WHERE cy.valuation_date = '2023-12-31';`,
              },
            ],
          },
          {
            id: 'l-06-05', title: 'CROSS JOIN for Actuarial Grids', duration: '10 min',
            description: 'Generating all combinations: age × duration × gender tables for pricing grids.',
          },
          {
            id: 'l-06-06', title: 'Multi-table Joins in Practice', duration: '15 min',
            description: 'Joining 4+ tables for full IFRS 17 data extraction queries. Performance considerations.',
          },
        ],
        quiz: [
          { id: 'q-06-01', question: 'A LEFT JOIN keeps all rows from:', options: ['The right table', 'Both tables', 'The left table', 'Only matching rows'], answer: 2 },
          { id: 'q-06-02', question: 'For an exposure study requiring all policies even with no claims, you use:', options: ['INNER JOIN', 'LEFT JOIN from policy to claims', 'RIGHT JOIN from claims to policy', 'FULL OUTER JOIN'], answer: 1 },
        ],
        exercise: {
          task: 'Build a mortality experience query showing all active life policies from 2019-2023, their exposure in years, any claims (including policies with no claims), age band, and raw mortality rate per 1000 exposed years.',
          dataset: 'policy_master, exposure_fact, mortality_claims',
          starterCode: `-- Join the three tables and compute mortality rate
SELECT 
    -- TODO
FROM policy_master pm
-- TODO: Join exposure and claims
GROUP BY age_band
ORDER BY age_band;`,
          solutionCode: `SELECT 
    CASE 
        WHEN pm.insured_age BETWEEN 25 AND 34 THEN '25-34'
        WHEN pm.insured_age BETWEEN 35 AND 44 THEN '35-44'
        WHEN pm.insured_age BETWEEN 45 AND 54 THEN '45-54'
        WHEN pm.insured_age BETWEEN 55 AND 64 THEN '55-64'
        ELSE 'Other'
    END AS age_band,
    pm.gender,
    SUM(ef.exposed_to_risk)                         AS total_exposure_years,
    COUNT(mc.claim_id)                              AS death_count,
    COUNT(mc.claim_id) / SUM(ef.exposed_to_risk) * 1000 AS q_x_per_1000
FROM policy_master pm
LEFT JOIN exposure_fact ef     ON pm.policy_id = ef.policy_id
LEFT JOIN mortality_claims mc  ON pm.policy_id = mc.policy_id
                               AND mc.claim_date BETWEEN '2019-01-01' AND '2023-12-31'
WHERE pm.product_code IN ('TERM', 'WHOLE')
GROUP BY age_band, pm.gender
ORDER BY age_band, pm.gender;`,
        },
      },
      {
        id: 'mod-07', number: '07', title: 'SET Operators', badge: 'Intermediate',
        meta: { lectureCount: 3, duration: '35 min' },
        lectures: [
          { id: 'l-07-01', title: 'UNION and UNION ALL', duration: '15 min', description: 'Combining results from multiple product lines, subsidiaries, or treaty segments.', codeExamples: [{ title: 'Combining Product Lines', code: `-- Consolidate claims from two product lines\nSELECT claim_id, policy_id, claim_amount, 'MOTOR' AS product FROM motor_claims\nUNION ALL\nSELECT claim_id, policy_id, claim_amount, 'LIFE'  AS product FROM life_claims\nORDER BY claim_amount DESC;` }] },
          { id: 'l-07-02', title: 'INTERSECT and EXCEPT', duration: '10 min', description: 'Finding policies in both systems (INTERSECT) or identifying orphaned records (EXCEPT) for data reconciliation.' },
          { id: 'l-07-03', title: 'Combining SET Operators', duration: '10 min', description: 'Building complex reconciliation queries that span multiple actuarial systems.' },
        ],
        quiz: [
          { id: 'q-07-01', question: 'UNION vs UNION ALL: UNION ALL is preferred when:', options: ['You want distinct rows', 'Duplicates are expected and acceptable for performance', 'You need sorted output', 'The tables have different columns'], answer: 1 },
        ],
        exercise: {
          task: 'Identify all policy IDs that appear in the policy_master table but NOT in the exposure_fact table (missing exposure records). Also find policies in both tables for reconciliation.',
          dataset: 'policy_master (policy_id), exposure_fact (policy_id)',
          starterCode: `-- Missing exposure\nSELECT policy_id FROM policy_master\n-- TODO\n;\n\n-- Both tables\nSELECT policy_id FROM policy_master\n-- TODO\n;`,
          solutionCode: `-- Policies missing from exposure\nSELECT policy_id FROM policy_master\nEXCEPT\nSELECT policy_id FROM exposure_fact;\n\n-- Policies in both (reconciliation)\nSELECT policy_id FROM policy_master\nINTERSECT\nSELECT policy_id FROM exposure_fact;`,
        },
      },
      {
        id: 'mod-08', number: '08', title: 'String Functions', badge: 'Intermediate',
        meta: { lectureCount: 4, duration: '45 min' },
        lectures: [
          { id: 'l-08-01', title: 'Core String Functions', duration: '15 min', description: 'UPPER, LOWER, TRIM, LTRIM, RTRIM for data cleaning. Essential for policy code standardisation.', codeExamples: [{ title: 'Data Cleaning Pipeline', code: `SELECT policy_id,\n    UPPER(TRIM(product_code))    AS product_code_clean,\n    LOWER(TRIM(insured_email))   AS email_clean,\n    REPLACE(phone_number, ' ', '') AS phone_clean\nFROM policy_master\nWHERE TRIM(product_code) IS NOT NULL;` }] },
          { id: 'l-08-02', title: 'SUBSTRING, LEFT, RIGHT, LEN', duration: '12 min', description: 'Extracting policy series codes, region prefixes, and claim type from compound identifiers.' },
          { id: 'l-08-03', title: 'CONCAT and String Building', duration: '10 min', description: 'Building report labels, reference codes, and composite keys from multiple columns.' },
          { id: 'l-08-04', title: 'LIKE and Pattern Matching', duration: '8 min', description: 'Searching actuarial codes, ISIN patterns, and product family prefixes.' },
        ],
        quiz: [{ id: 'q-08-01', question: 'LEFT(\'LIFE-TERM-2024\', 4) returns:', options: ['TERM', 'LIFE', '2024', 'LIFE-'], answer: 1 }],
        exercise: {
          task: 'Clean and standardise the policy_master table: uppercase product codes, trim whitespace from all text fields, and extract the product family (first 4 characters of product code).',
          dataset: 'policy_master (policy_id, product_code, insured_name, broker_code)',
          starterCode: `SELECT\n    policy_id,\n    -- TODO: Clean product_code\n    -- TODO: Clean insured_name\n    -- TODO: Extract product family\nFROM policy_master;`,
          solutionCode: `SELECT\n    policy_id,\n    UPPER(TRIM(product_code))         AS product_code,\n    INITCAP(TRIM(insured_name))       AS insured_name,\n    UPPER(TRIM(broker_code))          AS broker_code,\n    LEFT(UPPER(TRIM(product_code)), 4) AS product_family\nFROM policy_master\nWHERE policy_id IS NOT NULL;`,
        },
      },
      {
        id: 'mod-09', number: '09', title: 'Date Functions', badge: 'Intermediate',
        meta: { lectureCount: 5, duration: '60 min' },
        lectures: [
          { id: 'l-09-01', title: 'Date Arithmetic', duration: '15 min', description: 'DATEDIFF, DATEADD, date subtraction for calculating policy durations, waiting periods, and claim delays.', codeExamples: [{ title: 'Actuarial Date Calculations', code: `SELECT\n    policy_id,\n    inception_date,\n    expiry_date,\n    DATEDIFF(year, date_of_birth, inception_date)        AS age_at_entry,\n    DATEDIFF(day, inception_date, CURRENT_DATE)          AS policy_age_days,\n    DATEDIFF(day, inception_date, expiry_date) / 365.25  AS policy_term_years,\n    DATEADD(year, 1, inception_date)                     AS first_anniversary\nFROM policy_master;` }] },
          { id: 'l-09-02', title: 'Date Extraction — YEAR, MONTH, DAY', duration: '10 min', description: 'Grouping claims by accident year, underwriting year, calendar quarter for triangulation work.' },
          { id: 'l-09-03', title: 'Accounting Period Logic', duration: '15 min', description: 'Year-end dates, quarter starts, financial year boundaries. Building the calendar for actuarial reporting.', codeExamples: [{ title: 'Underwriting Year Assignment', code: `SELECT\n    claim_id,\n    loss_date,\n    YEAR(loss_date)                                           AS accident_year,\n    YEAR(report_date)                                         AS report_year,\n    CONCAT(YEAR(loss_date), 'Q', DATEPART(quarter, loss_date)) AS accident_quarter,\n    -- Development period (months from accident year to valuation)\n    DATEDIFF(month, DATEFROMPARTS(YEAR(loss_date), 1, 1), \n             '2023-12-31')                                    AS development_months\nFROM claims_fact\nORDER BY accident_year, development_months;` }] },
          { id: 'l-09-04', title: 'Working with Timestamps', duration: '10 min', description: 'Created_at, updated_at patterns. Extracting time components for intra-day analysis.' },
          { id: 'l-09-05', title: 'Age Calculation Pitfalls', duration: '10 min', description: 'Correct age next birthday, age last birthday, and exact age calculations — critical for mortality tables.' },
        ],
        quiz: [{ id: 'q-09-01', question: 'To find the number of complete years between two dates (age last birthday), you use:', options: ['DATEDIFF(day) / 365', 'DATEDIFF(year) adjusted for birthday', 'YEAR(date2) - YEAR(date1)', 'DATEPART(year)'], answer: 1 }],
        exercise: {
          task: 'Build a claims development triangle data set: for each accident year (2018-2023), show cumulative paid claims at each development year (1-6), using the claims_fact table.',
          dataset: 'claims_fact (claim_id, loss_date, valuation_date, cumulative_paid)',
          starterCode: `SELECT\n    YEAR(loss_date)                                        AS accident_year,\n    DATEDIFF(year, \n        DATEFROMPARTS(YEAR(loss_date), 1, 1),\n        valuation_date) + 1                                AS dev_year,\n    -- TODO: Sum cumulative paid\nFROM claims_fact\nWHERE -- TODO\nGROUP BY accident_year, dev_year\nORDER BY accident_year, dev_year;`,
          solutionCode: `SELECT\n    YEAR(loss_date)                                        AS accident_year,\n    DATEDIFF(year,\n        DATEFROMPARTS(YEAR(loss_date), 1, 1),\n        valuation_date) + 1                                AS dev_year,\n    SUM(cumulative_paid)                                   AS cum_paid\nFROM claims_fact\nWHERE YEAR(loss_date) BETWEEN 2018 AND 2023\nGROUP BY YEAR(loss_date), \n         DATEDIFF(year, DATEFROMPARTS(YEAR(loss_date), 1, 1), valuation_date) + 1\nORDER BY accident_year, dev_year;`,
        },
      },
      {
        id: 'mod-10', number: '10', title: 'NULL Handling', badge: 'Intermediate',
        meta: { lectureCount: 3, duration: '35 min' },
        lectures: [
          { id: 'l-10-01', title: 'NULL Propagation Rules', duration: '12 min', description: 'How NULL spreads through arithmetic and comparisons. The danger of NULL in claim amount sums.' },
          { id: 'l-10-02', title: 'COALESCE, ISNULL, NULLIF, NVL', duration: '13 min', description: 'Choosing the right function. COALESCE for portable code, NULLIF for zero-division protection in ratio calculations.', codeExamples: [{ title: 'Safe Division for Ratios', code: `SELECT\n    product_code,\n    SUM(incurred_claims)                                               AS claims,\n    SUM(gross_premium)                                                 AS premium,\n    SUM(incurred_claims) / NULLIF(SUM(gross_premium), 0) * 100         AS loss_ratio,\n    COALESCE(SUM(reinsurance_recovery), 0)                             AS ri_recovery\nFROM underwriting_results\nGROUP BY product_code;` }] },
          { id: 'l-10-03', title: 'NULL in GROUP BY and ORDER BY', duration: '10 min', description: 'How databases treat NULL grouping. NULLS FIRST/LAST in ORDER BY.' },
        ],
        quiz: [{ id: 'q-10-01', question: 'NULLIF(100, 100) returns:', options: ['100', '0', 'NULL', 'Error'], answer: 2 }],
        exercise: {
          task: 'Calculate the net claim ratio by product, safely handling products with no premium or claims (avoid division by zero), treating NULL RI recoveries as zero.',
          dataset: 'underwriting_results (product_code, gross_premium, incurred_claims, reinsurance_recovery)',
          starterCode: `SELECT product_code,\n    -- TODO: Safe loss ratio\nFROM underwriting_results\nGROUP BY product_code;`,
          solutionCode: `SELECT product_code,\n    COALESCE(SUM(incurred_claims), 0)                                      AS gross_claims,\n    COALESCE(SUM(reinsurance_recovery), 0)                                 AS ri_recovery,\n    COALESCE(SUM(incurred_claims), 0) - COALESCE(SUM(reinsurance_recovery),0) AS net_claims,\n    (COALESCE(SUM(incurred_claims), 0) - COALESCE(SUM(reinsurance_recovery), 0))\n        / NULLIF(SUM(gross_premium), 0) * 100                              AS net_loss_ratio\nFROM underwriting_results\nGROUP BY product_code\nORDER BY net_loss_ratio DESC NULLS LAST;`,
        },
      },
      {
        id: 'mod-11', number: '11', title: 'CASE WHEN — Advanced', badge: 'Intermediate',
        meta: { lectureCount: 4, duration: '50 min' },
        lectures: [
          { id: 'l-11-01', title: 'Searched vs Simple CASE', duration: '12 min', description: 'When to use each form. Complex actuarial condition trees.' },
          { id: 'l-11-02', title: 'CASE in Aggregations', duration: '14 min', description: 'Conditional counting and summing: pivot tables, split by claim type, smoker vs non-smoker totals.', codeExamples: [{ title: 'Conditional Aggregation Pivot', code: `-- Pivot claims by claim type without a PIVOT function\nSELECT\n    product_code,\n    COUNT(*)                                               AS total_claims,\n    SUM(CASE WHEN claim_type = 'DEATH'    THEN 1 ELSE 0 END) AS death_count,\n    SUM(CASE WHEN claim_type = 'DISABILITY' THEN 1 ELSE 0 END) AS disability_count,\n    SUM(CASE WHEN claim_type = 'CRITICAL_ILLNESS' THEN 1 ELSE 0 END) AS ci_count,\n    SUM(CASE WHEN claim_type = 'DEATH' THEN claim_amount ELSE 0 END) AS death_amount,\n    SUM(CASE WHEN claim_type = 'DISABILITY' THEN claim_amount ELSE 0 END) AS disability_amount\nFROM claims_fact\nGROUP BY product_code;` }] },
          { id: 'l-11-03', title: 'CASE for Data Quality Flags', duration: '12 min', description: 'Tagging records for review: extreme outliers, data inconsistencies, missing fields.' },
          { id: 'l-11-04', title: 'Nested CASE Expressions', duration: '12 min', description: 'Multi-dimensional classification: risk class by age + smoker + sum assured. Performance and readability.' },
        ],
        quiz: [{ id: 'q-11-01', question: 'SUM(CASE WHEN status = \'OPEN\' THEN claim_amount ELSE 0 END) calculates:', options: ['Count of open claims', 'Total amount for all claims', 'Total amount for open claims only', 'Average open claim'], answer: 2 }],
        exercise: {
          task: 'Create a product profitability pivot: for each product, show total policies, total premium, and breakout of claims by type (Death, Disability, CI, Other) in a single row per product.',
          dataset: 'policy_master, claims_fact',
          starterCode: `SELECT pm.product_code,\n    COUNT(DISTINCT pm.policy_id) AS policies,\n    -- TODO: Premium sum\n    -- TODO: Claim breakouts by type\nFROM policy_master pm\nLEFT JOIN claims_fact cf ON pm.policy_id = cf.policy_id\nGROUP BY pm.product_code;`,
          solutionCode: `SELECT pm.product_code,\n    COUNT(DISTINCT pm.policy_id)                                      AS policies,\n    SUM(pm.annual_premium)                                            AS total_premium,\n    SUM(CASE WHEN cf.claim_type = 'DEATH' THEN cf.claim_amount ELSE 0 END)    AS death_claims,\n    SUM(CASE WHEN cf.claim_type = 'DISABILITY' THEN cf.claim_amount ELSE 0 END) AS disability_claims,\n    SUM(CASE WHEN cf.claim_type = 'CI' THEN cf.claim_amount ELSE 0 END)       AS ci_claims,\n    SUM(CASE WHEN cf.claim_type NOT IN ('DEATH','DISABILITY','CI') AND cf.claim_id IS NOT NULL\n        THEN cf.claim_amount ELSE 0 END)                              AS other_claims,\n    SUM(COALESCE(cf.claim_amount, 0))                                 AS total_claims,\n    SUM(COALESCE(cf.claim_amount, 0)) / NULLIF(SUM(pm.annual_premium), 0) * 100 AS loss_ratio\nFROM policy_master pm\nLEFT JOIN claims_fact cf ON pm.policy_id = cf.policy_id\nGROUP BY pm.product_code\nORDER BY total_premium DESC;`,
        },
      },
    ],
  },
  {
    id: 'part-3',
    number: 'III',
    title: 'Advanced Analytics',
    modules: [
      {
        id: 'mod-12', number: '12', title: 'Aggregates & GROUP BY', badge: 'Advanced',
        meta: { lectureCount: 5, duration: '65 min' },
        lectures: [
          { id: 'l-12-01', title: 'Aggregate Functions Deep Dive', duration: '15 min', description: 'COUNT, SUM, AVG, MIN, MAX, STDEV — with actuarial context for claims severity and frequency analysis.', codeExamples: [{ title: 'Claims Statistics', code: `SELECT\n    product_code,\n    COUNT(claim_id)                           AS claim_count,\n    SUM(claim_amount)                         AS total_incurred,\n    AVG(claim_amount)                         AS avg_severity,\n    PERCENTILE_CONT(0.5) WITHIN GROUP\n        (ORDER BY claim_amount)               AS median_severity,\n    PERCENTILE_CONT(0.95) WITHIN GROUP\n        (ORDER BY claim_amount)               AS p95_severity,\n    STDDEV(claim_amount)                      AS severity_stddev,\n    MIN(claim_amount)                         AS min_claim,\n    MAX(claim_amount)                         AS max_claim\nFROM claims_fact\nGROUP BY product_code;` }] },
          { id: 'l-12-02', title: 'HAVING Clause', duration: '12 min', description: 'Filtering aggregated results. Finding products with abnormal loss ratios, large claims portfolios.' },
          { id: 'l-12-03', title: 'GROUPING SETS, ROLLUP, CUBE', duration: '18 min', description: 'Multi-level aggregation for actuarial reports: totals by product AND by year AND grand total in one query.', codeExamples: [{ title: 'ROLLUP for Actuarial Report', code: `SELECT\n    COALESCE(product_code, 'TOTAL')  AS product,\n    COALESCE(CAST(YEAR(claim_date) AS VARCHAR), 'ALL YEARS') AS year,\n    SUM(claim_amount)                AS total_claims,\n    COUNT(*)                         AS claim_count\nFROM claims_fact\nGROUP BY ROLLUP(product_code, YEAR(claim_date))\nORDER BY product, year;` }] },
          { id: 'l-12-04', title: 'COUNT DISTINCT and Approximate Counts', duration: '10 min', description: 'Counting unique policies, unique claimants, unique events in large datasets.' },
          { id: 'l-12-05', title: 'Aggregate Performance', duration: '10 min', description: 'Indexing strategies for GROUP BY queries on large claims tables (10M+ rows).' },
        ],
        quiz: [{ id: 'q-12-01', question: 'ROLLUP(product_code, year) generates subtotals for:', options: ['Only year', 'Only product_code', 'Each product+year, each product, and grand total', 'Only grand total'], answer: 2 }],
        exercise: {
          task: 'Create a full profitability report using ROLLUP to show claim statistics at: (1) product + year level, (2) product total, (3) grand total.',
          dataset: 'claims_fact (claim_id, product_code, claim_date, claim_amount), underwriting_results (product_code, year, gross_premium)',
          starterCode: `-- Build ROLLUP report\nSELECT\n    COALESCE(product_code, 'GRAND TOTAL') AS product,\n    -- TODO\nFROM claims_fact\nGROUP BY ROLLUP(product_code, YEAR(claim_date));`,
          solutionCode: `SELECT\n    COALESCE(cf.product_code, 'GRAND TOTAL')              AS product,\n    COALESCE(CAST(YEAR(cf.claim_date) AS VARCHAR), 'ALL') AS yr,\n    COUNT(cf.claim_id)                                    AS claim_count,\n    SUM(cf.claim_amount)                                  AS total_claims,\n    AVG(cf.claim_amount)                                  AS avg_severity\nFROM claims_fact cf\nGROUP BY ROLLUP(cf.product_code, YEAR(cf.claim_date))\nORDER BY GROUPING(cf.product_code), cf.product_code, GROUPING(YEAR(cf.claim_date));`,
        },
      },
      {
        id: 'mod-13', number: '13', title: 'Window Functions — Basics', badge: 'Advanced',
        meta: { lectureCount: 4, duration: '60 min' },
        lectures: [
          { id: 'l-13-01', title: 'OVER() Clause Anatomy', duration: '18 min', description: 'PARTITION BY, ORDER BY, frame specification. Why window functions don\'t collapse rows like GROUP BY.', codeExamples: [{ title: 'Running Total of Paid Claims', code: `SELECT\n    claim_id,\n    claim_date,\n    product_code,\n    claim_amount,\n    SUM(claim_amount) OVER (\n        PARTITION BY product_code\n        ORDER BY claim_date\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS running_total_by_product,\n    SUM(claim_amount) OVER (PARTITION BY product_code) AS product_total,\n    claim_amount / SUM(claim_amount) OVER (PARTITION BY product_code) * 100 AS pct_of_product\nFROM claims_fact\nORDER BY product_code, claim_date;` }] },
          { id: 'l-13-02', title: 'Frame Clauses', duration: '14 min', description: 'ROWS vs RANGE. Moving averages for loss development, rolling 12-month premiums.' },
          { id: 'l-13-03', title: 'PARTITION BY for Actuarial Segmentation', duration: '14 min', description: 'Partitioning by product, region, underwriting year — the building block of within-group analytics.' },
          { id: 'l-13-04', title: 'Named Windows', duration: '14 min', description: 'WINDOW clause for reusing window definitions across multiple functions in the same query.' },
        ],
        quiz: [{ id: 'q-13-01', question: 'A window function with no PARTITION BY clause:', options: ['Throws an error', 'Uses the entire result set as one partition', 'Runs per row independently', 'Requires ORDER BY'], answer: 1 }],
        exercise: {
          task: 'For each accident year and product, compute: total incurred, running cumulative incurred (ordered by development year), and each year\'s percentage of the product grand total.',
          dataset: 'loss_triangle (accident_year, development_year, product_code, incremental_paid)',
          starterCode: `SELECT\n    accident_year, development_year, product_code, incremental_paid,\n    -- TODO: Running cumulative\n    -- TODO: % of product total\nFROM loss_triangle\nORDER BY product_code, accident_year, development_year;`,
          solutionCode: `SELECT\n    accident_year,\n    development_year,\n    product_code,\n    incremental_paid,\n    SUM(incremental_paid) OVER (\n        PARTITION BY product_code, accident_year\n        ORDER BY development_year\n        ROWS UNBOUNDED PRECEDING\n    )                                                       AS cumulative_paid,\n    SUM(incremental_paid) OVER (PARTITION BY product_code)  AS product_grand_total,\n    incremental_paid / SUM(incremental_paid) OVER (PARTITION BY product_code) * 100 AS pct_of_total\nFROM loss_triangle\nORDER BY product_code, accident_year, development_year;`,
        },
      },
      {
        id: 'mod-14', number: '14', title: 'Window Aggregates', badge: 'Advanced',
        meta: { lectureCount: 4, duration: '55 min' },
        lectures: [
          { id: 'l-14-01', title: 'Moving Averages in Claims Analysis', duration: '15 min', description: '3-month, 12-month rolling averages for loss ratio trends and smoothing seasonal effects.', codeExamples: [{ title: '12-Month Rolling Loss Ratio', code: `SELECT\n    report_month,\n    product_code,\n    monthly_claims,\n    monthly_premium,\n    AVG(monthly_claims / NULLIF(monthly_premium, 0) * 100)\n        OVER (\n            PARTITION BY product_code\n            ORDER BY report_month\n            ROWS BETWEEN 11 PRECEDING AND CURRENT ROW\n        ) AS rolling_12m_loss_ratio\nFROM monthly_results\nORDER BY product_code, report_month;` }] },
          { id: 'l-14-02', title: 'Running Totals and Cumulative Sums', duration: '15 min', description: 'Chain-ladder cumulative paid construction. Year-to-date premium accumulation.' },
          { id: 'l-14-03', title: 'MAX/MIN Over Windows', duration: '12 min', description: 'Finding the maximum claim in a period, the minimum premium rate by segment.' },
          { id: 'l-14-04', title: 'COUNT OVER for Frequency Analysis', duration: '13 min', description: 'Claims frequency per exposure year, incident rates within policy groups.' },
        ],
        quiz: [{ id: 'q-14-01', question: 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW creates a:', options: ['2-row window', '3-row window', 'Unbounded window', '2-month window'], answer: 1 }],
        exercise: {
          task: 'Calculate a 3-month moving average loss ratio, the running year-to-date premium, and cumulative claims for each product.',
          dataset: 'monthly_results (report_month, product_code, monthly_premium, monthly_claims)',
          starterCode: `SELECT report_month, product_code,\n    monthly_premium, monthly_claims,\n    -- TODO: 3m moving avg loss ratio\n    -- TODO: YTD premium\n    -- TODO: YTD claims\nFROM monthly_results\nORDER BY product_code, report_month;`,
          solutionCode: `SELECT report_month, product_code,\n    monthly_premium,\n    monthly_claims,\n    AVG(monthly_claims / NULLIF(monthly_premium,0) * 100)\n        OVER (PARTITION BY product_code, YEAR(report_month)\n              ORDER BY report_month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS ma3_loss_ratio,\n    SUM(monthly_premium)\n        OVER (PARTITION BY product_code, YEAR(report_month)\n              ORDER BY report_month ROWS UNBOUNDED PRECEDING)                 AS ytd_premium,\n    SUM(monthly_claims)\n        OVER (PARTITION BY product_code, YEAR(report_month)\n              ORDER BY report_month ROWS UNBOUNDED PRECEDING)                 AS ytd_claims\nFROM monthly_results\nORDER BY product_code, report_month;`,
        },
      },
      {
        id: 'mod-15', number: '15', title: 'Window Ranking Functions', badge: 'Advanced',
        meta: { lectureCount: 3, duration: '45 min' },
        lectures: [
          { id: 'l-15-01', title: 'ROW_NUMBER, RANK, DENSE_RANK', duration: '18 min', description: 'Ranking claims by severity, policies by premium. Deduplication strategies using ROW_NUMBER.', codeExamples: [{ title: 'Top Claims per Product', code: `-- Find top 3 claims by severity for each product\nWITH ranked_claims AS (\n    SELECT\n        claim_id, product_code, claim_amount,\n        DENSE_RANK() OVER (\n            PARTITION BY product_code\n            ORDER BY claim_amount DESC\n        ) AS severity_rank\n    FROM claims_fact\n    WHERE claim_status = 'SETTLED'\n)\nSELECT * FROM ranked_claims WHERE severity_rank <= 3;` }] },
          { id: 'l-15-02', title: 'NTILE for Percentile Banding', duration: '13 min', description: 'Dividing portfolios into quartiles, deciles for risk stratification and experience study analysis.' },
          { id: 'l-15-03', title: 'PERCENT_RANK and CUME_DIST', duration: '14 min', description: 'Percentile positions for severity distributions. Tail analysis for extreme claims.' },
        ],
        quiz: [{ id: 'q-15-01', question: 'RANK() vs DENSE_RANK(): if two rows tie at rank 2, DENSE_RANK() assigns the next row:', options: ['Rank 3', 'Rank 4', 'Rank 3', 'Error'], answer: 0 }],
        exercise: {
          task: 'Rank all claims by amount within their product, assign severity quartiles using NTILE(4), and identify the top 1% of claims by amount.',
          dataset: 'claims_fact (claim_id, product_code, claim_amount, claim_date)',
          starterCode: `WITH ranked AS (\n    SELECT claim_id, product_code, claim_amount,\n        -- TODO: DENSE_RANK by severity\n        -- TODO: NTILE(4) quartile\n        -- TODO: PERCENT_RANK\n    FROM claims_fact\n)\nSELECT * FROM ranked WHERE -- TODO: top 1%;`,
          solutionCode: `WITH ranked AS (\n    SELECT\n        claim_id, product_code, claim_amount,\n        DENSE_RANK() OVER (PARTITION BY product_code ORDER BY claim_amount DESC) AS severity_rank,\n        NTILE(4)     OVER (PARTITION BY product_code ORDER BY claim_amount)      AS quartile,\n        PERCENT_RANK() OVER (PARTITION BY product_code ORDER BY claim_amount)    AS pct_rank\n    FROM claims_fact\n    WHERE claim_amount IS NOT NULL\n)\nSELECT * FROM ranked WHERE pct_rank >= 0.99\nORDER BY product_code, claim_amount DESC;`,
        },
      },
      {
        id: 'mod-16', number: '16', title: 'Window Values: LAG, LEAD, FIRST, LAST', badge: 'Advanced',
        meta: { lectureCount: 3, duration: '45 min' },
        lectures: [
          { id: 'l-16-01', title: 'LAG and LEAD', duration: '18 min', description: 'Period-over-period comparison. Reserve movements, premium changes, claim development increments.', codeExamples: [{ title: 'Reserve Movement Analysis', code: `SELECT\n    claim_id,\n    valuation_date,\n    case_reserve,\n    LAG(case_reserve, 1) OVER (PARTITION BY claim_id ORDER BY valuation_date) AS prior_reserve,\n    case_reserve - LAG(case_reserve, 1) OVER (PARTITION BY claim_id ORDER BY valuation_date) AS reserve_movement,\n    LEAD(case_reserve, 1) OVER (PARTITION BY claim_id ORDER BY valuation_date) AS next_reserve\nFROM claim_valuations\nORDER BY claim_id, valuation_date;` }] },
          { id: 'l-16-02', title: 'FIRST_VALUE and LAST_VALUE', duration: '14 min', description: 'Initial premium rates, opening reserves, inception conditions. Closing values for period analysis.' },
          { id: 'l-16-03', title: 'NTH_VALUE', duration: '13 min', description: 'Selecting specific development points in loss triangles.' },
        ],
        quiz: [{ id: 'q-16-01', question: 'LAG(amount, 1, 0) OVER (...) when there is no previous row returns:', options: ['NULL', '0', 'Error', 'The current row value'], answer: 1 }],
        exercise: {
          task: 'For each policy, compute month-over-month premium change, the premium at inception (FIRST_VALUE), and flag any month where premium dropped vs prior month.',
          dataset: 'premium_history (policy_id, premium_month, monthly_premium)',
          starterCode: `SELECT policy_id, premium_month, monthly_premium,\n    -- TODO: LAG for prior month\n    -- TODO: MoM change\n    -- TODO: FIRST_VALUE for inception premium\n    -- TODO: Drop flag\nFROM premium_history\nORDER BY policy_id, premium_month;`,
          solutionCode: `SELECT\n    policy_id, premium_month, monthly_premium,\n    LAG(monthly_premium) OVER (PARTITION BY policy_id ORDER BY premium_month)        AS prior_premium,\n    monthly_premium - LAG(monthly_premium) OVER (PARTITION BY policy_id ORDER BY premium_month) AS mom_change,\n    FIRST_VALUE(monthly_premium) OVER (PARTITION BY policy_id ORDER BY premium_month\n        ROWS UNBOUNDED PRECEDING)                                                    AS inception_premium,\n    CASE WHEN monthly_premium < LAG(monthly_premium) OVER (PARTITION BY policy_id ORDER BY premium_month)\n        THEN 1 ELSE 0 END                                                             AS premium_dropped\nFROM premium_history\nORDER BY policy_id, premium_month;`,
        },
      },
      {
        id: 'mod-17', number: '17', title: 'Subqueries', badge: 'Advanced',
        meta: { lectureCount: 4, duration: '55 min' },
        lectures: [
          { id: 'l-17-01', title: 'Inline Subqueries', duration: '14 min', description: 'Scalar subqueries in SELECT for comparison values, averages, and benchmark calculations.', codeExamples: [{ title: 'Comparing to Average', code: `SELECT\n    policy_id, product_code, sum_assured,\n    (SELECT AVG(sum_assured) FROM policy_master WHERE product_code = pm.product_code) AS product_avg_sa,\n    sum_assured - (SELECT AVG(sum_assured) FROM policy_master WHERE product_code = pm.product_code) AS vs_avg\nFROM policy_master pm\nWHERE policy_status = 'ACTIVE'\nORDER BY vs_avg DESC;` }] },
          { id: 'l-17-02', title: 'Subqueries in WHERE', duration: '14 min', description: 'IN, EXISTS, ANY, ALL with subqueries. Finding policies with claims above the 95th percentile.' },
          { id: 'l-17-03', title: 'Derived Tables', duration: '14 min', description: 'FROM clause subqueries for multi-step aggregations. Pre-aggregating before joining.' },
          { id: 'l-17-04', title: 'Correlated Subqueries', duration: '13 min', description: 'Row-by-row subqueries for ranking, duplicate detection, and within-group operations.' },
        ],
        quiz: [{ id: 'q-17-01', question: 'A correlated subquery differs from a regular subquery because:', options: ['It runs once for the whole query', 'It references columns from the outer query', 'It cannot be in the SELECT clause', 'It only works with JOINs'], answer: 1 }],
        exercise: {
          task: 'Find all policies whose sum assured exceeds the 90th percentile for their product. Use a subquery approach.',
          dataset: 'policy_master (policy_id, product_code, sum_assured, policy_status)',
          starterCode: `SELECT policy_id, product_code, sum_assured\nFROM policy_master pm\nWHERE sum_assured > (\n    -- TODO: 90th percentile subquery\n)\nAND policy_status = 'ACTIVE';`,
          solutionCode: `SELECT policy_id, product_code, sum_assured\nFROM policy_master pm\nWHERE sum_assured > (\n    SELECT PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY sum_assured)\n    FROM policy_master p2\n    WHERE p2.product_code = pm.product_code\n      AND p2.policy_status = 'ACTIVE'\n)\nAND pm.policy_status = 'ACTIVE'\nORDER BY product_code, sum_assured DESC;`,
        },
      },
      {
        id: 'mod-18', number: '18', title: 'Common Table Expressions (CTEs)', badge: 'Advanced',
        meta: { lectureCount: 4, duration: '60 min' },
        lectures: [
          { id: 'l-18-01', title: 'Basic CTE Syntax', duration: '14 min', description: 'WITH clause. Single and multiple CTEs. Replacing nested subqueries for readability in actuarial reports.', codeExamples: [{ title: 'Multi-step Loss Analysis with CTEs', code: `WITH exposure AS (\n    SELECT product_code, SUM(exposed_to_risk) AS total_exposure\n    FROM exposure_fact\n    WHERE exposure_year = 2023\n    GROUP BY product_code\n),\nclaims AS (\n    SELECT product_code, COUNT(*) AS claim_count, SUM(claim_amount) AS total_claims\n    FROM claims_fact\n    WHERE YEAR(claim_date) = 2023\n    GROUP BY product_code\n)\nSELECT\n    e.product_code,\n    e.total_exposure,\n    COALESCE(c.claim_count, 0)                               AS claims,\n    COALESCE(c.total_claims, 0)                              AS incurred,\n    COALESCE(c.claim_count, 0) / NULLIF(e.total_exposure, 0) AS frequency_rate,\n    COALESCE(c.total_claims, 0) / NULLIF(e.total_exposure, 0) AS pure_premium\nFROM exposure e\nLEFT JOIN claims c ON e.product_code = c.product_code;` }] },
          { id: 'l-18-02', title: 'Recursive CTEs', duration: '18 min', description: 'Traversing organisational hierarchies, reinsurance trees, and policy series. Generating date series for calendar tables.', codeExamples: [{ title: 'Date Series Generator', code: `-- Generate a calendar of months for actuarial reporting\nWITH RECURSIVE month_series AS (\n    SELECT DATE '2020-01-01' AS month_start\n    UNION ALL\n    SELECT month_start + INTERVAL '1 month'\n    FROM month_series\n    WHERE month_start < DATE '2023-12-01'\n)\nSELECT\n    month_start,\n    YEAR(month_start)  AS yr,\n    MONTH(month_start) AS mo,\n    LAST_DAY(month_start) AS month_end\nFROM month_series;` }] },
          { id: 'l-18-03', title: 'CTEs vs Subqueries vs Temp Tables', duration: '14 min', description: 'When each approach wins on performance and maintainability.' },
          { id: 'l-18-04', title: 'CTEs in Actuarial Pipeline Queries', duration: '14 min', description: 'Building readable 5-CTE queries for IFRS 17 GMM calculations.' },
        ],
        quiz: [{ id: 'q-18-01', question: 'A recursive CTE must contain:', options: ['Only a base case', 'Only a recursive case', 'Both a base case (anchor) and a recursive member', 'An OUTER JOIN'], answer: 2 }],
        exercise: {
          task: 'Rewrite a complex nested-subquery loss ratio query using CTEs: (1) compute exposure, (2) compute incurred claims, (3) compute premium, (4) join and calculate ratios.',
          dataset: 'exposure_fact, claims_fact, premium_fact (all have product_code and year)',
          starterCode: `WITH exposure_cte AS (\n    -- TODO\n),\nclaims_cte AS (\n    -- TODO\n),\npremium_cte AS (\n    -- TODO\n)\nSELECT\n    -- TODO: Final join and ratio calculation\nFROM exposure_cte e\n-- TODO: Joins;`,
          solutionCode: `WITH exposure_cte AS (\n    SELECT product_code, SUM(exposed_to_risk) AS exposure\n    FROM exposure_fact WHERE year = 2023 GROUP BY product_code\n),\nclaims_cte AS (\n    SELECT product_code, SUM(incurred_amount) AS incurred\n    FROM claims_fact WHERE YEAR(claim_date) = 2023 GROUP BY product_code\n),\npremium_cte AS (\n    SELECT product_code, SUM(gross_premium) AS premium\n    FROM premium_fact WHERE year = 2023 GROUP BY product_code\n)\nSELECT\n    e.product_code,\n    e.exposure,\n    COALESCE(c.incurred, 0)                                AS incurred_claims,\n    p.premium,\n    COALESCE(c.incurred, 0) / NULLIF(p.premium, 0) * 100   AS loss_ratio,\n    COALESCE(c.incurred, 0) / NULLIF(e.exposure, 0)         AS pure_premium\nFROM exposure_cte e\nLEFT JOIN claims_cte c   ON e.product_code = c.product_code\nLEFT JOIN premium_cte p  ON e.product_code = p.product_code\nORDER BY loss_ratio DESC NULLS LAST;`,
        },
      },
    ],
  },
  {
    id: 'part-4',
    number: 'IV',
    title: 'DB Objects & Optimisation',
    modules: [
      {
        id: 'mod-19', number: '19', title: 'Views', badge: 'DB Objects',
        meta: { lectureCount: 3, duration: '40 min' },
        lectures: [
          { id: 'l-19-01', title: 'Creating and Using Views', duration: '15 min', description: 'Encapsulating complex actuarial queries as reusable views. IFRS 17 GMM exposure views.', codeExamples: [{ title: 'IFRS 17 Liability View', code: `CREATE OR REPLACE VIEW v_ifrs17_liability AS\nSELECT\n    gmm_group_id,\n    valuation_date,\n    SUM(fulfilment_cashflows) AS fcf,\n    SUM(risk_adjustment)      AS ra,\n    SUM(csm)                  AS csm,\n    SUM(fulfilment_cashflows + risk_adjustment + csm) AS insurance_contract_liability\nFROM ifrs17_measurement\nGROUP BY gmm_group_id, valuation_date;` }] },
          { id: 'l-19-02', title: 'Updatable vs Read-Only Views', duration: '12 min', description: 'Which views can be updated. Materialised views for performance.' },
          { id: 'l-19-03', title: 'View Security in Actuarial Databases', duration: '13 min', description: 'Row-level security using views. Restricting junior actuaries to aggregated data.' },
        ],
        quiz: [{ id: 'q-19-01', question: 'A materialised view differs from a regular view because:', options: ['It cannot be queried', 'It stores the result physically and refreshes on demand', 'It always shows live data', 'It requires a PRIMARY KEY'], answer: 1 }],
        exercise: {
          task: 'Create a view that shows the current reserve position by product and claim status, joining claims_fact with claim_valuations, always showing the most recent valuation per claim.',
          dataset: 'claims_fact, claim_valuations (claim_id, valuation_date, case_reserve)',
          starterCode: `CREATE OR REPLACE VIEW v_current_reserves AS\nWITH latest_val AS (\n    -- TODO: Get most recent valuation per claim\n)\nSELECT\n    -- TODO: product, status, reserve totals\nFROM claims_fact cf\n-- TODO: Join;`,
          solutionCode: `CREATE OR REPLACE VIEW v_current_reserves AS\nWITH latest_val AS (\n    SELECT claim_id, case_reserve,\n           ROW_NUMBER() OVER (PARTITION BY claim_id ORDER BY valuation_date DESC) AS rn\n    FROM claim_valuations\n),\ncurrent_val AS (SELECT * FROM latest_val WHERE rn = 1)\nSELECT\n    cf.product_code,\n    cf.claim_status,\n    COUNT(cf.claim_id)           AS claim_count,\n    SUM(cv.case_reserve)         AS total_reserve,\n    SUM(cf.paid_amount)          AS total_paid,\n    SUM(cv.case_reserve) + SUM(cf.paid_amount) AS total_incurred\nFROM claims_fact cf\nINNER JOIN current_val cv ON cf.claim_id = cv.claim_id\nGROUP BY cf.product_code, cf.claim_status;`,
        },
      },
      {
        id: 'mod-20', number: '20', title: 'Temporary Tables & Table Variables', badge: 'DB Objects',
        meta: { lectureCount: 3, duration: '40 min' },
        lectures: [
          { id: 'l-20-01', title: 'Temp Tables for Multi-step Actuarial Pipelines', duration: '15 min', description: 'Breaking complex reserving queries into staged temp tables. Debugging intermediate results.', codeExamples: [{ title: 'Staged Reserve Calculation', code: `-- Stage 1: Compute exposure\nCREATE TEMPORARY TABLE tmp_exposure AS\nSELECT product_code, accident_year, SUM(exposed_to_risk) AS exposure\nFROM exposure_fact GROUP BY 1, 2;\n\n-- Stage 2: Compute development factors\nCREATE TEMPORARY TABLE tmp_ldfs AS\nSELECT accident_year,\n       SUM(CASE WHEN dev_year = 2 THEN cum_paid END) /\n           NULLIF(SUM(CASE WHEN dev_year = 1 THEN cum_paid END), 0) AS ldf_1_2\nFROM loss_triangle GROUP BY accident_year;\n\n-- Final: Join and apply factors\nSELECT e.*, l.ldf_1_2 FROM tmp_exposure e\nLEFT JOIN tmp_ldfs l ON e.accident_year = l.accident_year;` }] },
          { id: 'l-20-02', title: 'Table Variables vs Temp Tables', duration: '12 min', description: 'Scope, statistics, and performance differences. When to use each in actuarial scripts.' },
          { id: 'l-20-03', title: 'Cleaning Up Temp Objects', duration: '13 min', description: 'DROP IF EXISTS, session cleanup, and managing temp table lifecycles in scheduled jobs.' },
        ],
        quiz: [{ id: 'q-20-01', question: 'A TEMPORARY TABLE is automatically dropped when:', options: ['The query ends', 'The session ends', 'The transaction commits', 'The database restarts'], answer: 1 }],
        exercise: {
          task: 'Build a 3-stage temp table pipeline: (1) load monthly claims into tmp_monthly_claims, (2) compute LDFs into tmp_ldfs, (3) project ultimate losses from the tail.',
          dataset: 'loss_triangle (accident_year, development_year, cumulative_paid)',
          starterCode: `-- Stage 1\nCREATE TEMP TABLE tmp_monthly_claims AS\nSELECT -- TODO;\n\n-- Stage 2  \nCREATE TEMP TABLE tmp_ldfs AS\nSELECT -- TODO;\n\n-- Final projection\nSELECT -- TODO;`,
          solutionCode: `CREATE TEMP TABLE tmp_triangle AS\nSELECT accident_year, development_year, cumulative_paid\nFROM loss_triangle;\n\nCREATE TEMP TABLE tmp_ldfs AS\nSELECT\n    d1.development_year AS from_dev,\n    SUM(d2.cumulative_paid) / NULLIF(SUM(d1.cumulative_paid), 0) AS ldf\nFROM tmp_triangle d1\nINNER JOIN tmp_triangle d2\n    ON d1.accident_year = d2.accident_year\n   AND d2.development_year = d1.development_year + 1\nGROUP BY d1.development_year;\n\nSELECT t.accident_year, t.development_year, t.cumulative_paid,\n    t.cumulative_paid * COALESCE(l.ldf, 1.0) AS projected_next,\n    t.cumulative_paid * COALESCE(l.ldf, 1.0) * 1.05 AS tail_projected\nFROM tmp_triangle t\nLEFT JOIN tmp_ldfs l ON t.development_year = l.from_dev\nORDER BY t.accident_year, t.development_year;`,
        },
      },
      {
        id: 'mod-21', number: '21', title: 'Stored Procedures', badge: 'DB Objects',
        meta: { lectureCount: 3, duration: '45 min' },
        lectures: [
          { id: 'l-21-01', title: 'Creating Parameterised Procedures', duration: '18 min', description: 'Monthly valuation procedures, run parameters for actuarial batch jobs.', codeExamples: [{ title: 'Monthly Reserve Run Procedure', code: `CREATE OR REPLACE PROCEDURE sp_monthly_reserve_run(\n    IN p_valuation_date DATE,\n    IN p_product_code   VARCHAR(20)\n)\nLANGUAGE plpgsql AS $$\nBEGIN\n    -- Step 1: Clear staging\n    DELETE FROM reserve_staging WHERE valuation_date = p_valuation_date\n        AND product_code = p_product_code;\n\n    -- Step 2: Insert new reserve estimates\n    INSERT INTO reserve_staging (claim_id, product_code, valuation_date, reserve_estimate)\n    SELECT cf.claim_id, cf.product_code, p_valuation_date,\n           cf.paid_amount * 1.15  -- simplified IBNR loading\n    FROM claims_fact cf\n    WHERE cf.product_code = p_product_code AND cf.claim_status = 'OPEN';\n\n    RAISE NOTICE 'Reserve run complete for % on %', p_product_code, p_valuation_date;\nEND;\n$$;` }] },
          { id: 'l-21-02', title: 'Error Handling in Procedures', duration: '15 min', description: 'TRY/CATCH, transaction control, and logging for production actuarial jobs.' },
          { id: 'l-21-03', title: 'Scheduling Actuarial Procedures', duration: '12 min', description: 'SQL Agent jobs, cron, and orchestrating monthly runs.' },
        ],
        quiz: [{ id: 'q-21-01', question: 'Parameters in stored procedures allow:', options: ['Dynamic SQL only', 'One fixed value', 'Reusable code with variable inputs', 'Only output values'], answer: 2 }],
        exercise: {
          task: 'Write a stored procedure that accepts a valuation_date and computes the IBNR reserve for all open claims using a simple Bornhuetter-Ferguson approximation, storing results in an ibnr_results table.',
          dataset: 'claims_fact, bf_expected_loss_ratios (product_code, expected_lr)',
          starterCode: `CREATE PROCEDURE sp_compute_ibnr(\n    IN p_val_date DATE\n)\nAS $$\nBEGIN\n    -- TODO: Implement BF IBNR calculation\nEND;\n$$;`,
          solutionCode: `CREATE OR REPLACE PROCEDURE sp_compute_ibnr(IN p_val_date DATE)\nLANGUAGE plpgsql AS $$\nBEGIN\n    DELETE FROM ibnr_results WHERE valuation_date = p_val_date;\n\n    INSERT INTO ibnr_results (product_code, valuation_date, reported_claims, expected_ultimate, ibnr)\n    SELECT\n        cf.product_code,\n        p_val_date,\n        SUM(cf.paid_amount)                                       AS reported_claims,\n        SUM(premium) * bf.expected_lr                             AS expected_ultimate,\n        SUM(premium) * bf.expected_lr * (1 - pct_developed)       AS ibnr\n    FROM claims_fact cf\n    INNER JOIN bf_expected_loss_ratios bf ON cf.product_code = bf.product_code\n    CROSS JOIN (SELECT 0.75 AS pct_developed) params\n    WHERE cf.claim_status = 'OPEN'\n    GROUP BY cf.product_code, bf.expected_lr, pct_developed;\n\n    RAISE NOTICE 'IBNR computed for %', p_val_date;\nEND;\n$$;`,
        },
      },
      {
        id: 'mod-22', number: '22', title: 'Indexes & Query Plans', badge: 'DB Objects',
        meta: { lectureCount: 4, duration: '55 min' },
        lectures: [
          { id: 'l-22-01', title: 'B-Tree Indexes on Actuarial Tables', duration: '15 min', description: 'Creating indexes on policy_id, claim_date, product_code for fast actuarial queries.', codeExamples: [{ title: 'Strategic Index Creation', code: `-- Index for claims queries by date range\nCREATE INDEX idx_claims_date ON claims_fact (claim_date, product_code);\n\n-- Covering index for common actuarial report\nCREATE INDEX idx_claims_cover ON claims_fact \n    (product_code, claim_status)\n    INCLUDE (claim_amount, paid_amount, ibnr_amount);\n\n-- Partial index for open claims only\nCREATE INDEX idx_open_claims ON claims_fact (claim_date, claim_amount)\nWHERE claim_status = 'OPEN';` }] },
          { id: 'l-22-02', title: 'Reading EXPLAIN ANALYZE', duration: '15 min', description: 'Interpreting query plans for slow actuarial queries. Seq Scan vs Index Scan, nested loops.' },
          { id: 'l-22-03', title: 'Composite and Partial Indexes', duration: '13 min', description: 'Multi-column indexes for common WHERE + GROUP BY patterns in reserving queries.' },
          { id: 'l-22-04', title: 'Index Maintenance', duration: '12 min', description: 'ANALYZE, VACUUM, REBUILD for production actuarial databases that receive daily loads.' },
        ],
        quiz: [{ id: 'q-22-01', question: 'A covering index is useful when:', options: ['You want to slow down queries', 'All required columns are in the index, avoiding table lookups', 'Only the primary key is needed', 'The table is small'], answer: 1 }],
        exercise: {
          task: 'Analyse a slow claims query, identify missing indexes, create appropriate indexes, and compare EXPLAIN ANALYZE output before and after.',
          dataset: 'claims_fact (100M rows)',
          starterCode: `-- Before: Check the plan\nEXPLAIN ANALYZE\nSELECT product_code, SUM(claim_amount)\nFROM claims_fact\nWHERE claim_date >= '2023-01-01' AND claim_status = 'OPEN'\nGROUP BY product_code;\n\n-- TODO: Create appropriate indexes\n\n-- After: Re-check the plan\n-- TODO;`,
          solutionCode: `-- Before plan\nEXPLAIN ANALYZE\nSELECT product_code, SUM(claim_amount) FROM claims_fact\nWHERE claim_date >= '2023-01-01' AND claim_status = 'OPEN'\nGROUP BY product_code;\n\n-- Create optimized partial covering index\nCREATE INDEX idx_claims_open_date ON claims_fact (claim_date, product_code)\n    INCLUDE (claim_amount)\n    WHERE claim_status = 'OPEN';\n\nANALYZE claims_fact;\n\n-- After plan — should show Index Scan\nEXPLAIN ANALYZE\nSELECT product_code, SUM(claim_amount) FROM claims_fact\nWHERE claim_date >= '2023-01-01' AND claim_status = 'OPEN'\nGROUP BY product_code;`,
        },
      },
      {
        id: 'mod-23', number: '23', title: 'Partitioning', badge: 'DB Objects',
        meta: { lectureCount: 3, duration: '40 min' },
        lectures: [
          { id: 'l-23-01', title: 'Range Partitioning by Year', duration: '15 min', description: 'Partitioning the claims table by accident year for faster triangle queries and data archival.', codeExamples: [{ title: 'Partitioned Claims Table', code: `CREATE TABLE claims_fact_partitioned (\n    claim_id      VARCHAR(20),\n    accident_year INT,\n    claim_amount  DECIMAL(15,2),\n    claim_date    DATE,\n    product_code  VARCHAR(20)\n) PARTITION BY RANGE (accident_year);\n\nCREATE TABLE claims_2020 PARTITION OF claims_fact_partitioned\n    FOR VALUES FROM (2020) TO (2021);\nCREATE TABLE claims_2021 PARTITION OF claims_fact_partitioned\n    FOR VALUES FROM (2021) TO (2022);\nCREATE TABLE claims_2022 PARTITION OF claims_fact_partitioned\n    FOR VALUES FROM (2022) TO (2023);\nCREATE TABLE claims_2023 PARTITION OF claims_fact_partitioned\n    FOR VALUES FROM (2023) TO (2024);` }] },
          { id: 'l-23-02', title: 'List and Hash Partitioning', duration: '12 min', description: 'List partitioning by product line. Hash partitioning for even distribution of policy data.' },
          { id: 'l-23-03', title: 'Partition Pruning and Performance', duration: '13 min', description: 'How the query planner skips irrelevant partitions. Measuring the speedup on large actuarial tables.' },
        ],
        quiz: [{ id: 'q-23-01', question: 'Partition pruning occurs when:', options: ['All partitions are scanned', 'The query includes a filter on the partition key, allowing the DB to skip irrelevant partitions', 'Indexes are disabled', 'NULL values are present'], answer: 1 }],
        exercise: {
          task: 'Design and create a partitioned loss triangle table, partitioned by accident year (2015-2024), with appropriate indexes on each partition.',
          dataset: 'New table: loss_triangle_partitioned',
          starterCode: `CREATE TABLE loss_triangle_partitioned (\n    -- TODO: columns\n) PARTITION BY RANGE (accident_year);\n\n-- TODO: Create partitions for 2015-2024`,
          solutionCode: `CREATE TABLE loss_triangle_partitioned (\n    id BIGSERIAL,\n    accident_year INT NOT NULL,\n    development_year INT NOT NULL,\n    product_code VARCHAR(20),\n    cumulative_paid DECIMAL(15,2),\n    case_reserve DECIMAL(15,2),\n    UNIQUE (accident_year, development_year, product_code)\n) PARTITION BY RANGE (accident_year);\n\nDO $$\nDECLARE yr INT;\nBEGIN\n    FOR yr IN 2015..2024 LOOP\n        EXECUTE format(\n            'CREATE TABLE loss_tri_%s PARTITION OF loss_triangle_partitioned FOR VALUES FROM (%s) TO (%s)',\n            yr, yr, yr+1\n        );\n        EXECUTE format(\n            'CREATE INDEX idx_tri_%s_dev ON loss_tri_%s (development_year, product_code)',\n            yr, yr\n        );\n    END LOOP;\nEND;\n$$;`,
        },
      },
      {
        id: 'mod-24', number: '24', title: 'Query Performance Tuning', badge: 'DB Objects',
        meta: { lectureCount: 4, duration: '55 min' },
        lectures: [
          { id: 'l-24-01', title: 'Query Rewriting Techniques', duration: '18 min', description: 'Converting correlated subqueries to window functions, EXISTS vs IN, join order.' },
          { id: 'l-24-02', title: 'Statistics and the Query Planner', duration: '14 min', description: 'How table statistics affect plans. ANALYZE, sample rates, and stale statistics causing bad plans.' },
          { id: 'l-24-03', title: 'Materialization and Caching', duration: '12 min', description: 'Materialised CTEs, result caching, and managing expensive actuarial aggregation queries.' },
          { id: 'l-24-04', title: 'Parallel Query Execution', duration: '11 min', description: 'Enabling parallelism for large GROUP BY on claims tables. Worker configuration.' },
        ],
        quiz: [{ id: 'q-24-01', question: 'A correlated subquery in a SELECT clause that runs 10M times per query is best replaced with:', options: ['A larger index', 'A window function or a JOIN', 'A stored procedure', 'A view'], answer: 1 }],
        exercise: {
          task: 'Take a slow 8-second actuarial report query and rewrite it for sub-second performance using CTEs, window functions, and appropriate indexes.',
          dataset: 'All previous tables',
          starterCode: `-- SLOW: Correlated subquery approach (avoid)\nSELECT policy_id,\n    (SELECT SUM(claim_amount) FROM claims_fact c WHERE c.policy_id = pm.policy_id) AS total_claims,\n    (SELECT COUNT(*) FROM claims_fact c WHERE c.policy_id = pm.policy_id) AS claim_count\nFROM policy_master pm;\n\n-- TODO: Rewrite as a fast JOIN or CTE approach`,
          solutionCode: `-- FAST: Single pass with JOIN\nWITH claim_summary AS (\n    SELECT policy_id, SUM(claim_amount) AS total_claims, COUNT(*) AS claim_count\n    FROM claims_fact\n    GROUP BY policy_id\n)\nSELECT pm.policy_id, pm.product_code,\n    COALESCE(cs.total_claims, 0)  AS total_claims,\n    COALESCE(cs.claim_count, 0)   AS claim_count\nFROM policy_master pm\nLEFT JOIN claim_summary cs ON pm.policy_id = cs.policy_id;`,
        },
      },
    ],
  },
  {
    id: 'part-5',
    number: 'V',
    title: 'AI-Assisted SQL',
    modules: [
      {
        id: 'mod-25', number: '25', title: 'Using AI Tools for Actuarial SQL', badge: 'AI-Assisted',
        meta: { lectureCount: 4, duration: '50 min' },
        lectures: [
          { id: 'l-25-01', title: 'Prompting AI for SQL Generation', duration: '14 min', description: 'Writing effective prompts for Claude, GPT-4, and Copilot to generate actuarial SQL. Schema context, business context, and output format specifications.' },
          { id: 'l-25-02', title: 'AI-Assisted Query Debugging', duration: '12 min', description: 'Using AI to diagnose wrong results in reserving queries. Explaining error messages and plan outputs to AI.' },
          { id: 'l-25-03', title: 'Validating AI-Generated SQL', duration: '14 min', description: 'Why AI SQL must be validated. Common failure modes: wrong joins, NULL handling errors, aggregation mistakes.' },
          { id: 'l-25-04', title: 'AI for Documentation and Code Review', duration: '10 min', description: 'Auto-generating SQL comments, data dictionaries, and query documentation using AI.' },
        ],
        quiz: [{ id: 'q-25-01', question: 'When prompting AI for SQL, the most important context to provide is:', options: ['Your name', 'Table schema, business context, and expected output format', 'The database vendor only', 'The number of rows'], answer: 1 }],
        exercise: {
          task: 'Use an AI tool to generate a chain-ladder loss development factor query, then critically review and correct the output.',
          dataset: 'loss_triangle (accident_year, development_year, cumulative_paid)',
          starterCode: `-- Prompt to use: "Write a SQL query to calculate volume-weighted loss\n-- development factors (LDFs) from a loss triangle table with columns:\n-- accident_year, development_year, cumulative_paid. Calculate LDF for\n-- each development period from 12 to 120 months."\n\n-- TODO: Paste AI output here, then critically review and fix it`,
          solutionCode: `-- Reviewed and corrected LDF calculation\nSELECT\n    d1.development_year                                          AS from_period,\n    d1.development_year + 1                                      AS to_period,\n    SUM(d2.cumulative_paid) / NULLIF(SUM(d1.cumulative_paid), 0) AS ldf,\n    COUNT(*)                                                     AS observations\nFROM loss_triangle d1\nINNER JOIN loss_triangle d2\n    ON  d1.accident_year    = d2.accident_year\n    AND d2.development_year = d1.development_year + 1\nWHERE d1.cumulative_paid > 0\nGROUP BY d1.development_year\nORDER BY d1.development_year;`,
        },
      },
    ],
  },
  {
    id: 'part-6',
    number: 'VI',
    title: 'Capstone Projects',
    modules: [
      {
        id: 'mod-26', number: '26', title: 'Data Warehouse Build', badge: 'Capstone',
        meta: { lectureCount: 4, duration: '90 min' },
        lectures: [
          { id: 'l-26-01', title: 'Star Schema Design for Actuarial DW', duration: '25 min', description: 'Designing a fact + dimension star schema for a GI actuarial data warehouse. Policy_fact, Claims_fact, Exposure_fact with shared dimensions.' },
          { id: 'l-26-02', title: 'ETL Pipeline in SQL', duration: '25 min', description: 'Extract from source systems, transform with business rules, load into DW using stored procedures.' },
          { id: 'l-26-03', title: 'SCD Type 2 for Policy History', duration: '20 min', description: 'Slowly changing dimensions for tracking policy amendments, endorsements, and coverage changes over time.', codeExamples: [{ title: 'SCD Type 2 Implementation', code: `-- Implement SCD Type 2 for policy dimension\nMERGE INTO dim_policy AS target\nUSING policy_updates AS source ON target.policy_id = source.policy_id\n    AND target.is_current = 1\nWHEN MATCHED AND (\n    target.sum_assured != source.sum_assured\n    OR target.product_code != source.product_code\n) THEN\n    UPDATE SET\n        target.is_current    = 0,\n        target.effective_end = source.change_date - 1\nWHEN NOT MATCHED BY TARGET THEN\n    INSERT (policy_id, sum_assured, product_code, \n            effective_start, effective_end, is_current)\n    VALUES (source.policy_id, source.sum_assured, source.product_code,\n            source.change_date, NULL, 1);` }] },
          { id: 'l-26-04', title: 'Reporting Layer Queries', duration: '20 min', description: 'Building the final reporting queries on top of the DW for management reports.' },
        ],
        quiz: [{ id: 'q-26-01', question: 'SCD Type 2 tracks historical changes by:', options: ['Overwriting old values', 'Adding new rows for each change with effective dates', 'Storing only the latest version', 'Using update logs'], answer: 1 }],
        exercise: {
          task: 'Build a complete 3-table star schema for a GI portfolio: fact_claims, dim_policy, dim_date. Load sample data and write 3 management report queries.',
          dataset: 'Provided CSV files: policies.csv, claims.csv',
          starterCode: `-- 1. Create dimension tables\n-- TODO: dim_policy\n-- TODO: dim_date\n\n-- 2. Create fact table\n-- TODO: fact_claims\n\n-- 3. Load data\n-- TODO\n\n-- 4. Write report queries\n-- TODO: Loss ratio by product and year\n-- TODO: Top 10 claim months\n-- TODO: Year-over-year growth`,
          solutionCode: `CREATE TABLE dim_date (date_id INT PRIMARY KEY, full_date DATE, year INT, quarter INT, month INT, month_name VARCHAR(10));\nCREATE TABLE dim_policy (policy_sk BIGINT PRIMARY KEY IDENTITY, policy_id VARCHAR(20), product_code VARCHAR(20), sum_assured DECIMAL(15,2), effective_start DATE, effective_end DATE, is_current BIT DEFAULT 1);\nCREATE TABLE fact_claims (claim_sk BIGINT PRIMARY KEY IDENTITY, policy_sk BIGINT REFERENCES dim_policy, loss_date_id INT REFERENCES dim_date, report_date_id INT REFERENCES dim_date, claim_amount DECIMAL(15,2), paid_amount DECIMAL(15,2), ibnr DECIMAL(15,2), claim_status VARCHAR(10));\n\n-- Report 1: Loss ratio\nSELECT dd.year, dp.product_code, SUM(fc.claim_amount) AS incurred, SUM(pm.annual_premium) AS premium, SUM(fc.claim_amount)/NULLIF(SUM(pm.annual_premium),0)*100 AS loss_ratio\nFROM fact_claims fc JOIN dim_policy dp ON fc.policy_sk = dp.policy_sk JOIN dim_date dd ON fc.loss_date_id = dd.date_id JOIN policy_master pm ON dp.policy_id = pm.policy_id\nGROUP BY dd.year, dp.product_code ORDER BY dd.year, loss_ratio DESC;`,
        },
      },
      {
        id: 'mod-27', number: '27', title: 'Loss Triangle & Chain-Ladder Reserving', badge: 'Capstone',
        meta: { lectureCount: 4, duration: '90 min' },
        lectures: [
          { id: 'l-27-01', title: 'Building the Loss Triangle in SQL', duration: '22 min', description: 'Constructing an incurred and paid loss triangle entirely in SQL using window functions and CASE WHEN pivoting.', codeExamples: [{ title: 'Loss Triangle SQL', code: `-- Build incurred loss triangle (10 accident years x 10 development years)\nSELECT\n    accident_year,\n    SUM(CASE WHEN development_year = 1  THEN cumulative_incurred END) AS dev_1,\n    SUM(CASE WHEN development_year = 2  THEN cumulative_incurred END) AS dev_2,\n    SUM(CASE WHEN development_year = 3  THEN cumulative_incurred END) AS dev_3,\n    SUM(CASE WHEN development_year = 4  THEN cumulative_incurred END) AS dev_4,\n    SUM(CASE WHEN development_year = 5  THEN cumulative_incurred END) AS dev_5\nFROM loss_triangle\nGROUP BY accident_year\nORDER BY accident_year;` }] },
          { id: 'l-27-02', title: 'Chain-Ladder LDFs in SQL', duration: '22 min', description: 'Volume-weighted LDF calculation for each development period. Tail factors.' },
          { id: 'l-27-03', title: 'Ultimate Loss Projection', duration: '23 min', description: 'Applying LDFs to produce ultimates. IBNR = Ultimate - Reported. All in SQL.' },
          { id: 'l-27-04', title: 'Bornhuetter-Ferguson in SQL', duration: '23 min', description: 'BF method: credibility-weighting expected and chain-ladder ultimates using SQL.' },
        ],
        quiz: [{ id: 'q-27-01', question: 'In the chain-ladder method, the loss development factor (LDF) at development year k is:', options: ['Cumulative paid at k / cumulative paid at k-1', 'Sum of all LDFs', 'Average incurred / premium', 'IBNR / reported'], answer: 0 }],
        exercise: {
          task: 'Complete end-to-end chain-ladder reserving: build the triangle, compute LDFs, project ultimates, and compute IBNR for each accident year.',
          dataset: 'loss_triangle (accident_year, development_year, cumulative_paid)',
          starterCode: `-- Step 1: LDFs\n-- Step 2: Tail factor (assume 1.05)\n-- Step 3: Cumulative LDF\n-- Step 4: Current diagonal\n-- Step 5: Ultimate = Current * CumLDF\n-- Step 6: IBNR = Ultimate - Reported`,
          solutionCode: `WITH ldfs AS (\n    SELECT d1.development_year AS dev,\n        SUM(d2.cumulative_paid) / NULLIF(SUM(d1.cumulative_paid), 0) AS ldf\n    FROM loss_triangle d1 JOIN loss_triangle d2\n        ON d1.accident_year = d2.accident_year AND d2.development_year = d1.development_year + 1\n    GROUP BY d1.development_year\n),\ncum_ldfs AS (\n    SELECT dev,\n        EXP(SUM(LN(ldf)) OVER (ORDER BY dev DESC ROWS UNBOUNDED PRECEDING)) * 1.05 AS cum_ldf\n    FROM ldfs\n),\ndiagonal AS (\n    SELECT accident_year, MAX(development_year) AS max_dev,\n        MAX(cumulative_paid) AS current_paid\n    FROM loss_triangle GROUP BY accident_year\n)\nSELECT d.accident_year, d.current_paid,\n    cl.cum_ldf,\n    d.current_paid * cl.cum_ldf AS ultimate,\n    d.current_paid * cl.cum_ldf - d.current_paid AS ibnr\nFROM diagonal d\nLEFT JOIN cum_ldfs cl ON d.max_dev = cl.dev\nORDER BY d.accident_year;`,
        },
      },
      {
        id: 'mod-28', number: '28', title: 'Pension Fund Analysis (IAS 19)', badge: 'Capstone',
        meta: { lectureCount: 3, duration: '70 min' },
        lectures: [
          { id: 'l-28-01', title: 'DBO Roll-Forward in SQL', duration: '25 min', description: 'Building the IAS 19 defined benefit obligation roll-forward: opening DBO + current service cost + interest - benefits paid ± remeasurements = closing DBO.', codeExamples: [{ title: 'IAS 19 DBO Roll-Forward', code: `SELECT\n    plan_id,\n    opening_dbo,\n    current_service_cost,\n    interest_cost,\n    benefits_paid,\n    actuarial_gains_losses,\n    opening_dbo\n        + current_service_cost\n        + interest_cost\n        - benefits_paid\n        + actuarial_gains_losses AS closing_dbo,\n    plan_assets,\n    opening_dbo + current_service_cost + interest_cost\n        - benefits_paid + actuarial_gains_losses - plan_assets AS net_liability\nFROM ias19_pension_fact\nWHERE valuation_date = '2023-12-31';` }] },
          { id: 'l-28-02', title: 'Active Member Demographics', duration: '22 min', description: 'Member counts, average ages, salary distributions, and projection of retirement timelines from member data.' },
          { id: 'l-28-03', title: 'Sensitivity Analysis Queries', duration: '23 min', description: 'Computing the impact of a 100bps discount rate change, 1% salary increase, and mortality improvement on DBO.' },
        ],
        quiz: [{ id: 'q-28-01', question: 'The IAS 19 net defined benefit liability equals:', options: ['DBO only', 'Plan assets only', 'DBO minus plan assets', 'Current service cost + interest cost'], answer: 2 }],
        exercise: {
          task: 'Write a complete IAS 19 disclosure note query showing: DBO roll-forward, plan asset movement, net liability, and sensitivity analysis for ±100bps discount rate.',
          dataset: 'ias19_pension_fact, plan_asset_movements, sensitivity_assumptions',
          starterCode: `-- IAS 19 Roll-Forward\nSELECT -- TODO;\n\n-- Sensitivity: -100bps\nSELECT -- TODO;\n\n-- Sensitivity: +100bps\nSELECT -- TODO;`,
          solutionCode: `-- DBO Roll-Forward\nSELECT plan_id, 'DBO Roll-Forward' AS section,\n    opening_dbo, current_service_cost, interest_cost,\n    benefits_paid * -1 AS benefits_paid_out,\n    actuarial_gains_losses,\n    opening_dbo + current_service_cost + interest_cost - benefits_paid + actuarial_gains_losses AS closing_dbo\nFROM ias19_pension_fact WHERE valuation_date = '2023-12-31'\nUNION ALL\n-- Sensitivity\nSELECT plan_id, CONCAT('Sensitivity ', scenario) AS section,\n    NULL, NULL, NULL, NULL, NULL, sensitivity_dbo\nFROM dbo_sensitivity\nWHERE valuation_date = '2023-12-31' AND scenario IN ('-100bps', '+100bps')\nORDER BY plan_id, section;`,
        },
      },
      {
        id: 'mod-29', number: '29', title: 'Portfolio Exploratory Data Analysis', badge: 'Capstone',
        meta: { lectureCount: 3, duration: '65 min' },
        lectures: [
          { id: 'l-29-01', title: 'Descriptive Statistics on Policy Portfolio', duration: '22 min', description: 'Full EDA on a GI portfolio: distributions of sum assured, age, gender, regional spread, premium bands.', codeExamples: [{ title: 'Portfolio EDA', code: `SELECT\n    COUNT(*)                              AS policy_count,\n    AVG(sum_assured)                      AS mean_sa,\n    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sum_assured) AS median_sa,\n    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY sum_assured) AS p25_sa,\n    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY sum_assured) AS p75_sa,\n    STDDEV(sum_assured)                   AS stddev_sa,\n    MIN(sum_assured)                      AS min_sa,\n    MAX(sum_assured)                      AS max_sa,\n    SUM(sum_assured)                      AS total_sa\nFROM policy_master WHERE policy_status = 'ACTIVE';` }] },
          { id: 'l-29-02', title: 'Correlation and Distribution Analysis', duration: '21 min', description: 'Finding relationships between age, sum assured, and claims frequency. Outlier detection in SQL.' },
          { id: 'l-29-03', title: 'Time-Series Trends', duration: '22 min', description: 'New business trends, lapse rates, claims emergence patterns over time using window functions.' },
        ],
        quiz: [{ id: 'q-29-01', question: 'In EDA, PERCENTILE_CONT(0.75) computes:', options: ['75% of mean', 'The median', 'The 75th percentile (Q3)', 'The top 25% of data'], answer: 2 }],
        exercise: {
          task: 'Conduct a full portfolio EDA: summary statistics, age distribution, sum assured decile analysis, premium concentration, and lapse rate by product and age band.',
          dataset: 'policy_master, lapse_data',
          starterCode: `-- 1. Summary stats\n-- 2. Age distribution histogram (10-year bands)\n-- 3. SA decile analysis\n-- 4. Premium concentration (Lorenz curve data)\n-- 5. Lapse rates by product x age`,
          solutionCode: `-- Summary stats\nSELECT COUNT(*) AS n, AVG(sum_assured) AS mean_sa,\n    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sum_assured) AS p50,\n    STDDEV(sum_assured) AS sd\nFROM policy_master WHERE policy_status = 'ACTIVE';\n\n-- Age histogram\nSELECT FLOOR(insured_age/10)*10 AS age_band_start, COUNT(*) AS count\nFROM policy_master GROUP BY 1 ORDER BY 1;\n\n-- SA deciles\nSELECT NTILE(10) OVER (ORDER BY sum_assured) AS decile,\n    MIN(sum_assured) AS band_min, MAX(sum_assured) AS band_max,\n    COUNT(*) AS policies, SUM(sum_assured) AS total_sa\nFROM policy_master GROUP BY decile ORDER BY decile;\n\n-- Lapse rates\nSELECT pm.product_code,\n    FLOOR(pm.insured_age/10)*10 AS age_band,\n    COUNT(*) AS in_force,\n    SUM(CASE WHEN l.lapse_date IS NOT NULL THEN 1 ELSE 0 END) AS lapses,\n    SUM(CASE WHEN l.lapse_date IS NOT NULL THEN 1 ELSE 0 END)*1.0/COUNT(*) AS lapse_rate\nFROM policy_master pm LEFT JOIN lapse_data l ON pm.policy_id = l.policy_id\nGROUP BY pm.product_code, age_band ORDER BY lapse_rate DESC;`,
        },
      },
      {
        id: 'mod-30', number: '30', title: 'Advanced Analytics — Final Project', badge: 'Capstone',
        meta: { lectureCount: 3, duration: '90 min' },
        lectures: [
          { id: 'l-30-01', title: 'Mortality Rate Graduation', duration: '30 min', description: 'Computng crude qx rates by age, gender, and smoker status. Comparing to industry tables (A2000). Standardised mortality ratios (SMR).' },
          { id: 'l-30-02', title: 'Expense Analysis and IFRS 17 Attribution', duration: '30 min', description: 'Allocating expenses to insurance service result components. Attribution of IFRS 17 P&L movement.' },
          { id: 'l-30-03', title: 'Predictive Modelling Feature Engineering', duration: '30 min', description: 'Creating ML-ready feature tables from raw actuarial data: lag features, aggregated risk indicators, normalised variables.' },
        ],
        quiz: [{ id: 'q-30-01', question: 'The Standardised Mortality Ratio (SMR) compares:', options: ['Two years of experience', 'Actual to expected deaths', 'Male to female mortality', 'Young to old mortality'], answer: 1 }],
        exercise: {
          task: 'Final capstone: compute SMRs by age band and gender compared to A2000 standard table, build IFRS 17 insurance revenue attribution, and create a feature table for a claims prediction model.',
          dataset: 'All tables from the course',
          starterCode: `-- 1. Actual vs Expected Deaths (SMR)\nWITH actual AS (\n    -- TODO\n),\nexpected AS (\n    -- TODO: apply A2000 qx rates to exposure\n)\nSELECT -- TODO SMR;\n\n-- 2. IFRS 17 Attribution\nSELECT -- TODO;\n\n-- 3. ML Feature Table\nSELECT -- TODO;`,
          solutionCode: `-- 1. SMR\nWITH actual AS (\n    SELECT insured_age AS age, gender,\n        SUM(exposed_to_risk) AS exposure,\n        COUNT(mc.claim_id) AS actual_deaths\n    FROM policy_master pm\n    LEFT JOIN exposure_fact ef ON pm.policy_id = ef.policy_id\n    LEFT JOIN mortality_claims mc ON pm.policy_id = mc.policy_id\n    GROUP BY insured_age, gender\n),\nexpected AS (\n    SELECT a.age, a.gender, a.exposure,\n        a.exposure * s.qx AS expected_deaths, a.actual_deaths\n    FROM actual a\n    INNER JOIN a2000_standard s ON a.age = s.age AND a.gender = s.gender\n)\nSELECT age, gender, actual_deaths,\n    ROUND(expected_deaths, 2) AS expected_deaths,\n    actual_deaths / NULLIF(expected_deaths, 0) AS smr\nFROM expected ORDER BY smr DESC;\n\n-- 2. IFRS 17 (simplified)\nSELECT gmm_group_id, valuation_date,\n    insurance_revenue, insurance_service_expenses,\n    insurance_revenue - insurance_service_expenses AS insurance_service_result,\n    net_finance_income, csm_release\nFROM ifrs17_pnl WHERE valuation_date = '2023-12-31';\n\n-- 3. ML Features\nSELECT pm.policy_id, pm.insured_age, pm.gender, pm.smoker_status,\n    pm.sum_assured, pm.annual_premium,\n    COALESCE(cs.claim_count, 0) AS prior_claims,\n    COALESCE(cs.total_paid, 0) AS prior_paid,\n    DATEDIFF(year, pm.inception_date, CURRENT_DATE) AS policy_duration_years\nFROM policy_master pm\nLEFT JOIN (SELECT policy_id, COUNT(*) AS claim_count, SUM(paid_amount) AS total_paid FROM claims_fact GROUP BY policy_id) cs\n    ON pm.policy_id = cs.policy_id\nWHERE pm.policy_status = 'ACTIVE';`,
        },
      },
    ],
  },
];

export const getAllModules = (): Module[] =>
  curriculum.flatMap(part => part.modules);

export const getModuleById = (id: string): Module | undefined =>
  getAllModules().find(m => m.id === id);

export const getPartByModuleId = (moduleId: string): Part | undefined =>
  curriculum.find(part => part.modules.some(m => m.id === moduleId));
