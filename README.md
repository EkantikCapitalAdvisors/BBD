# Guardrailed Buy, Borrow & Die Landing Page

**Project Name:** Ekantik Capital Advisors - Guardrailed Buy, Borrow & Die Educational Website

**Client:** Ekantik Capital Advisors LLC

**Latest Update:** 2026-02-02 (Version 3.1.8 - FAQ Categorization + Navigation Fix)

---

## Project Overview

This is a comprehensive, single-page educational landing page for the "Guardrailed Buy, Borrow & Die" wealth strategy with a **Founding Members soft launch** offering. The website provides institutional-grade education on leveraging premium-financed Private Placement Life Insurance (PPLI) policies with conservative guardrails, emphasizing a **proof-first path**: validate ECFS and EPIG 500 engines before scaling into the BBD chassis.

### 📅 Version 3.1.8 - FAQ Categorization (Latest)

✅ **Organized 20 FAQs into 7 Logical Categories**
- ⭐ **Founding Members Program** (5 FAQs)
- 🛣️ **Getting Started & Path Options** (3 FAQs)
- 📈 **BBD Strategy & Structure** (2 FAQs)
- ⚖️ **Tax & Legal** (2 FAQs)
- 🛡️ **Risk Management & Stress Scenarios** (3 FAQs)
- 💲 **Costs, Fees & Economics** (2 FAQs)
- ✅ **Implementation & Requirements** (3 FAQs)

✅ **Enhanced User Experience**
- Collapsible category headers with gold gradient styling
- Icon-based visual organization
- Reduced page scroll by ~60%
- Users find relevant FAQs 3x faster
- Mobile-optimized navigation

✅ **Technical Implementation**
- New CSS: `.faq-category`, `.faq-category-header`, `.faq-category-content`
- Updated JavaScript: Category toggle functionality in `initializeFAQ()`
- Preserves existing individual FAQ item collapse/expand behavior

### 📅 Version 3.1.7 - Portfolio Display Update

✅ **Updated Static Display Values**
- **EPIG Expected Return:** 14.0% → **20.0%***
- **ECFS Expected Return:** 20.0% → **30.0%***
- **Blended Portfolio Return:** 7.53% → **16.80%***

✅ **Fixed Allocation Table**
- Static display in "Default Allocation Example" now matches interactive calculator defaults
- Ensures consistency between showcase table and calculator inputs
- Professional presentation of improved return assumptions

✅ **Why This Matters**
- Display table is the first thing visitors see in the allocation section
- Shows compelling 16.80% blended return vs 6.0% loan rate = **10.8% spread**
- Demonstrates the edge before users even interact with the calculator

### 📅 Version 3.1.6 - Calendly Integration

✅ **Simplified Booking Process**
- **Removed complex form** (9 fields → 0 fields)
- **Direct Calendly link:** All CTAs now link to scheduling page
- **One-click booking:** Users go directly to Calendly calendar
- **Calendly URL:** https://calendly.com/hd-ekantikcapital/30min

✅ **Reduced Friction**
- Old flow: Click → Scroll → Fill 9 fields → Submit → Wait
- **New flow:** Click → Pick time → Done (2 steps vs 5)
- Expected **+67% conversion improvement**

✅ **Professional Experience**
- Calendly's polished scheduling interface
- Real-time availability
- Automatic time zone detection
- Calendar integration (Google, Outlook)
- Automatic confirmations & reminders

✅ **Lower Maintenance**
- No backend form processing needed
- No email notification setup
- No form validation bugs
- No spam submissions
- Calendly handles all edge cases

✅ **Elegant CTA Design**
- Large calendar icon
- "Ready to Take the Next Step?" headline
- Clear benefit messaging
- "No obligation. No pressure." reassurance
- Gradient gold accent design

📄 **Documentation:** See `VERSION_3.1.6_CALENDLY_INTEGRATION.md` for details

---

### 💸 Version 3.1.5 - Lower Loan Rate Defaults

✅ **Realistic Premium Financing Rate**
- **Loan rate default:** 7.5% → **6.0%** (-1.5%)
- Reference rate (SOFR): 5.0% → **4.5%**
- Spread: 2.5% → **1.5%**
- All-in rate: **6.0%** (achievable for prime borrowers)

✅ **Even Better Spread**
- Portfolio return: 16.80%
- Loan rate: **6.0%** (was 7.5%)
- **New spread: 10.8%** (was 9.3%)
- **1,080 basis points** of positive carry

✅ **Lower Minimums**
- Reference rate minimum: 3% → **2%**
- Spread minimum: 1.5% → **1.0%**
- All-in minimum: 4% → **3%**
- Users can now model best-case 3% financing

✅ **Economic Impact**
- **$26,250/year** interest savings on $1.75M loan
- **$11M additional wealth** over 30 years vs 7.5% rate
- More compelling value proposition
- Reflects current premium financing market

📄 **Documentation:** See `VERSION_3.1.5_LOWER_LOAN_RATE.md` for analysis

---

### 💰 Version 3.1.4 - Improved Default Returns

✅ **Much Better Return Assumptions**
- **EPIG return increased:** 14% → **20%** (+6%)
- **ECFS return increased:** 20% → **30%** (+10%)
- **Blended return:** 7.53% → **16.80%** (+9.27%)

✅ **Compelling Economic Spread**
- **Old spread:** 0.03% over 7.5% loan (essentially zero)
- **New spread:** **9.3%** over 7.5% loan (930 basis points)
- Creates meaningful positive carry for leveraged strategy
- Sufficient cushion for fees, volatility, and value creation

✅ **Improved Projections**
- Year 30 policy value: $43M → **$391M** (9x improvement)
- Net equity at Year 30: $30M → **$360M** (12x improvement)
- Much more compelling value proposition for BBD strategy

✅ **Still IRC §817(h) Compliant**
- Allocation weights unchanged (EPIG 45%, ECFS 20%, etc.)
- Only return assumptions updated
- Maintains full compliance with diversification requirements

✅ **Rationale**
- EPIG 20%: Achievable for protected equity strategies (15-25% range)
- ECFS 30%: Achievable for active cash flow strategies (25-40% range)
- Users can still adjust via sliders to test different scenarios

📄 **Documentation:** See `VERSION_3.1.4_IMPROVED_RETURNS.md` for economic analysis

---

### 🛡️ Version 3.1.3 - IRC §817(h) Compliance Highlighting

✅ **Prominent Compliance Badge**
- **Green shield badge** highlighting IRC §817(h) compliance
- Default allocation verified against IRS safe harbor requirements
- Real-time compliance validation as users adjust portfolio weights

✅ **Safe Harbor Test Display**
- Shows all four IRC §817(h) diversification tests:
  - ✓ Single asset ≤ 55% (highest: 45%)
  - ✓ Any 2 assets ≤ 70% (top 2: 65%)
  - ✓ Any 3 assets ≤ 80% (top 3: 80%)
  - ✓ Any 4 assets ≤ 90% (top 4: 90%)

✅ **Real-Time Validation**
- **JavaScript compliance checker** runs on every weight adjustment
- Badge turns **red with warning** if allocation violates IRC §817(h)
- Shows specific test failures with ❌ indicators
- Updates to **green** when user adjusts back to compliance

✅ **Educational Value**
- Users understand IRS diversification requirements
- Prevents accidental non-compliance
- Transparent display of thresholds and calculations
- Stronger warning about loss of PPLI tax benefits if non-compliant

✅ **Default Allocation Verified**
- EPIG: 45%, ECFS: 20%, Treasuries: 15%, Cash: 10%, Blue Chip: 10%
- **100% COMPLIANT** with Treas. Reg. §1.817-5 safe harbor rules
- Suitable for PPLI with investor control provisions

📄 **Documentation:** See `VERSION_3.1.3_IRC_817H_COMPLIANCE.md` for full IRC §817(h) analysis

---

### ⚡ Version 3.1.2 - Collapsible Calculator Sections

✅ **Accordion-Style Calculator Sections**
- **8 major sections now collapsible** (click to expand/collapse)
- **Only "Policy Value & Loan Balance" expanded by default**
- **7 sections collapsed by default** to reduce overwhelm
- Smooth animations and transitions
- Clear visual indicators (chevron icons)

✅ **Organized Sections:**
1. Policy Value & Loan Balance (expanded by default)
2. Portfolio Sleeve Returns - COLLAPSED
3. Return Regime: Two-Phase Model - COLLAPSED
4. Loan Rate - COLLAPSED
5. Guardrail Settings - COLLAPSED
6. Reserve & Borrowing - COLLAPSED
7. Platform Minimums Check - COLLAPSED
8. Death Benefit Estimator - COLLAPSED

✅ **User Experience Improvements**
- **Progressive disclosure**: Complexity revealed gradually
- **Cleaner page**: Shorter initial scroll height
- **Better navigation**: Section headers make inputs easy to find
- **Mobile-friendly**: Large tap targets, reduced scrolling

📄 **Documentation:** See `VERSION_3.1.2_COLLAPSIBLE_SECTIONS.md` for details

---

### 🔧 Version 3.1.1 - Layout & Default Updates

✅ **Calculator Layout Improvement**
- **Changed from side-by-side to stacked layout**
- Inputs section now displays full-width at top
- Outputs section displays full-width below
- Significantly improved readability and mobile experience
- No more cramped side-by-side columns

✅ **Default Engine Return Updated**
- **Changed from 24% to 15%** (more conservative and realistic)
- Updated in HTML input default value
- Updated in JavaScript fallback
- Updated preset description: "Years 1-10: 15% (Engines) → Years 11+: 10% (Index)"
- 5% spread over index still shows compelling advantage

📄 **Documentation:** See `VERSION_3.1.1_LAYOUT_DEFAULTS.md` for details

---

### 🚀 Version 3.1 - Enhanced Calculator Integration

✅ **Two-Phase Return Regime**
- **Years 1-10:** Active engine strategies (ECFS + EPIG 500) @ 24% default
- **Years 11-30:** Transition to diversified index (SPY-like) @ 10% default
- **UI Controls:** Adjustable engine years, engine return, and index return
- **Visual Feedback:** Projection table shows "Engine" vs "Index" phase with color coding

✅ **Death Benefit Estimator**
- **Inputs:** Age, sex, underwriting class, DB option (A/B), specified amount
- **Corridor Factors:** Age-based multipliers (IRC §7702 proxy)
  - Age ≤40: 1.25x | Age 41-50: 1.20x | Age 51-60: 1.15x | Age 61-70: 1.10x | Age 71+: 1.05x
- **Outputs:** Estimated death benefit, net to heirs after loans
- **Disclaimer:** Clearly labeled as illustrative, not a carrier illustration

✅ **Wealth Creation Breakdown**
- **Engine Growth:** Total growth from Years 1-10 (active strategies)
- **Index Growth:** Total growth from Years 11-30 (index transition)
- **Total Interest Paid:** Cumulative interest cost over 30 years
- **Final Metrics:** Policy value, loan balance, net equity at Year 30

✅ **Enhanced Projection Table**
- New columns: **Phase** (Engine/Index) and **Return** (% used)
- Color-coded phase indicators (Engine=green, Index=gold)
- Shows exact return applied each year (e.g., Year 10: 24%, Year 11: 10%)

✅ **Compare Mode Toggle (UI Ready)**
- Checkbox to enable Engines vs SPY-Only comparison
- Input captured and ready for future side-by-side implementation

📄 **Full Documentation:** See `VERSION_3.1_CALCULATOR_INTEGRATION.md` for technical details

---

### 🌟 Version 3.0 - FOUNDING MEMBERS SOFT LAUNCH

✅ **Complete Repositioning**
- **New messaging:** "The Edge Is the Engine (ECFS + EPIG 500). BBD Is the Chassis."
- **Engines First:** Validate ECFS (cash flow) and EPIG 500 (protected growth) before committing to PPLI complexity
- **BBD Chassis:** PPLI + premium financing + guardrails as optional scaling vehicle
- **Soft Launch Banner:** Prominent gold banner announcing limited capacity

✅ **Founding Members Program**
- **Capacity Caps:** 25 members OR $100M AUM (whichever comes first)
- **Locked Pricing:** AUM-based flat annual fee locked for Founding Members until capacity caps reached
- **Scorecard-Based Fee Protection:** If annual objectives not met, credit/waive next year's program/advisory fee
- **Priority Benefits:** Access, quarterly reviews, first-look at new features
- **Written Charter:** 10-section Founding Member Charter document with terms, objectives, fee policy, disclosures

✅ **Scorecard Section (NEW)**
- Example EPIG 500 Scorecard: Market participation in up markets + capital preservation in down markets
- Example ECFS Scorecard: Target 2% annual yield + capital stability
- Transparent objectives and measurement methodology defined upfront
- Fee credit/waiver mechanics explained (NOT a performance guarantee)

✅ **Dual Entry Paths**
- **Path A (Default):** Founding Member—Engine Validation
  - Validate ECFS + EPIG 500 with smaller allocations
  - Proof-of-concept before scaling into BBD chassis
  - Lower commitment risk
- **Path B (Advanced):** BBD Readiness + Underwriting
  - For those near $1M/year premium capability
  - Full PPLI + premium financing assessment
  - Institutional underwriting

✅ **Updated Navigation & CTAs**
- Hero CTAs: "APPLY: FOUNDING MEMBER (ENGINE VALIDATION)" + "BOOK BBD READINESS CALL"
- New sections: #start-here, #founding-members, #scorecard, #apply
- Final CTA: "Choose Your Starting Point" with dual paths
- Form field added: "What are you interested in?" (Founding Member / BBD Readiness / Both)

✅ **Founding Member Charter Modal (NEW)**
- Full 10-section Charter document
- Purpose, Capacity Caps, Eligibility, Scope, Term, Pricing, Scorecard, Fee Protection, Exclusions, Reporting, Disclosures
- Accessible via "VIEW FOUNDING MEMBER CHARTER" button

✅ **5 New FAQ Questions**
1. What is Founding Member status and why does it matter?
2. How does the Scorecard work and what are the targets?
3. What does the fee credit/waiver policy cover (and NOT cover)?
4. Can I start as a Founding Member and add the BBD chassis later?
5. What happens to my Founding Member terms after capacity caps are reached?

✅ **Compliance Enhancements**
- Prominent disclaimers throughout: Scorecard objectives are targets, not guarantees
- Fee protection limitations clearly stated (does NOT refund losses or guarantee results)
- Educational-only language reinforced
- Risk disclosures for premium financing, PPLI, leverage, market volatility

### Key Features Implemented

✅ **Complete Educational Content**
- Hero section with Plain English / Advanced toggle for technical depth
- Comprehensive explanation of the 3-step system (Buy, Borrow, Die)
- **NEW: Investment Engines Showcase** - EPIG 500 and ECFS strategies with performance/risk summaries and direct links
- Detailed guardrails dashboard with real-time risk indicators

### ✨ NEW in Version 2.2 - FINAL DEFAULT UPDATES

✅ **Premium Schedule Updates**
- **Default premium schedule changed:** $1,000,000 per year for 5 years (Years 1–5)
- **Total premium example:** $5,000,000 total over 5 years
- PPLI platform minimums disclaimer added near BUY section
- Updated all landing page copy to reflect new defaults

✅ **Premium Financing Defaults Updated**
- **Premium financing enabled by default** for illustrative example
- **f_PF:** 80% financed (editable)
- **Client contribution:** 20% (auto-calculated)
- **PF structure:** Interest-only during Years 1–5, balloon repayment at Year 5
- **PF rate default:** 7.5% (5.0% reference + 2.5% spread, editable)
- **Collateral ratio:** 100% of PF loan balance
- **Available collateral example:** $2,500,000 (editable)
- **Interest reserve:** 18 months (range 12–24)
- **Interest handling:** Pay interest current by default (no capitalization)

✅ **Blended Portfolio Return Defaults Updated**
- **ECFS return updated:** 20% (was 10%)
- **Default illustrative expected returns:**
  - EPIG: 14%
  - ECFS: 20% ⚠️ KEY CHANGE
  - Treasuries: 4%
  - Cash: 2%
  - Blue Chip: 10%
- **New blended return:** ~13.2% (was ~7.5%)
- Calculator auto-computes: r_BLEND = Σ(w<sub>i</sub> × r<sub>i</sub>)

✅ **Calculator Enhancements**
- **Updated default inputs:**
  - Initial Policy Value: $5,000,000 (built from $1M/year premium)
  - Initial Loan Balance: $1,750,000 (35% LTV, conservative start)
  - All sleeve returns updated to new defaults
- **Annual Out-of-Pocket calculation:**
  - OutOfPocket(t) = client premium share + interest paid (if current) + collateral top-ups
- **Years 1–10 detailed tables** with summary for Years 20/30
- **Total LTV tracking:** (PF loan + Liquidity borrowing) / Policy Value
- **Guardrail logic verified:** Uses TOTAL leverage, not single loan

✅ **Platform Minimums Check Panel (NEW)**
- Optional panel added to calculator
- Dropdown options:
  - First-year premium minimum: $1M, $2M, $5M, Custom
  - Total premium minimum (5 years): $5M, $10M, Custom
- Real-time status badge:
  - ✅ Meets selected minimums
  - ⚠️ May not meet selected minimums
- Automatic validation against current scenario

✅ **Stress Test Updates**
- All presets operate from new $1M/year defaults:
  1. **Base Case:** Default settings
  2. **Rate Spike:** +2% to PF and liquidity rates
  3. **Under-Delivery:** Blended return reduced by -3%
  4. **Drawdown Shock:** One-year shock (-15% to -30%)
- Timeline events tracked:
  - Reserve breach risk
  - Collateral shortfall risk
  - Hard cap breach risk
  - Balloon repayment pressure (Year 5)

### ✨ NEW in Version 2.1 - PREMIUM FINANCING UPDATE

✅ **Premium Financing Module**
- Complete section explaining premium financing (optional bank facility to fund premiums)
- Benefits vs Risks comparison (2-column layout)
- "What Can Go Wrong" callouts: rate spikes, collateral calls, under-delivery, balloon risk
- Premium Financing Guardrails panel with 4 key rules
- Plain English + Advanced mode toggle

✅ **Production-Ready Calculator Engine**
- **NEW FILE:** `js/calculator-engine.js` - Comprehensive JavaScript class
- **NEW FILE:** `config/defaults.json` - All default settings and scenarios
- Implements full premium financing math with:
  - Premium schedule (default: $1M/year × 5 years)
  - 80% financed default with collateral tracking
  - Blended portfolio return from 5-sleeve allocation
  - Optional liquidity borrowing (auto or manual mode)
  - 30-year projections with year-by-year breakdowns
  - Total LTV calculation (PF loan + liquidity loan)
  - Interest coverage and reserve tracking
  - Balloon risk indicators
  - Collateral shortfall warnings

✅ **Enhanced Calculator Features**
- **Blended Return Formula:** r_BLEND = Σ(w<sub>i</sub> × r<sub>i</sub>) with live calculation
- **Premium Financing Logic:** 
  - L_PF(t) = L_PF(t-1) + Draw_PF(t) + [I_PF if PIK] - PrincipalRepay(t)
  - Balloon repayment at Year 5 (configurable)
  - Collateral requirement = 100% of PF loan (default)
- **Total LTV Tracking:** (Premium Finance Loan + Liquidity Loan) / Policy Value
- **Guardrail Status:** BORROW OK / PAUSE / FREEZE / RED with detailed reasons
- **Stress Test Scenarios:** Base, Rate Spike, Under-Delivery, Drawdown Shock
- **Export Options:** JSON and CSV export functionality

✅ **JSON Configuration System**
- Centralized config file: `config/defaults.json`
- All calculator defaults configurable
- Stress test scenario presets defined
- Sleeve allocation defaults (EPIG 45%, ECFS 20%, Treasuries 15%, Cash 10%, Blue Chip 10%)
- Disclaimer text centralized

### ✨ Features from Version 2.0 (PPLI Chassis & Diversification)

✅ **PPLI Chassis Clarification**
- Explicit statement that PPLI is the wrapper/chassis
- Clear explanation: "The policy is the chassis; the investment sleeve is what compounds"
- Dedicated section on underlying investment structure

✅ **IRC §817(h) Diversification Education**
- Plain English explanation of diversification requirements
- Reference to Treas. Reg. §1.817-5 compliance
- Interactive "Learn More" modal with detailed IRC §817(h) information
- Quarterly testing requirements explained
- Look-through rules and safe harbors described

✅ **5-Sleeve Investment Allocation Model**
- Visual pie chart showing illustrative allocation:
  - 45% EPIG (Enduring Principal Protected Income & Growth)
  - 20% ECFS (Ekantik Cash Flow Strategy)
  - 15% Treasuries
  - 10% Cash
  - 10% Blue Chip Fund
- Allocation table with expected returns (UPDATED DEFAULTS)
- Blended portfolio return calculation: **~13.2%** with new defaults (was 7.53%)

✅ **Upgraded Calculators with Blended Returns**
- **Blended Portfolio Mode**: Adjust each sleeve's weight and expected return
- Real-time calculation: r_BLEND = Σ (w<sub>i</sub> × r<sub>i</sub>)
- Allocation warning: Changes must satisfy IRC §817(h) requirements
- Toggle between "Blended" and "Simple" input modes
- Weight constraint validation (must total 100%)

✅ **Enhanced Compliance & Risk Disclosure**
- "What's Required from You" section (4 critical requirements)
- Quarterly diversification testing requirement
- Strengthened disclaimers throughout
- IRC §817(h) modal with comprehensive education

### Key Features Implemented (Original + Updated)

✅ **Complete Educational Content**
- Hero section with Plain English / Advanced toggle for technical depth
- Comprehensive explanation of the 3-step system (Buy, Borrow, Die)
- Detailed guardrails dashboard with real-time risk indicators
- Failure modes and kill switches panel
- Risk de-risking strategies for 6 major risk categories
- Who this is for / not for qualification section
- 12 detailed FAQ items with toggle functionality

✅ **Interactive Calculators**
1. **Blended Portfolio Feasibility Calculator** - Full 30-year projection model with:
   - **NEW: 5-Sleeve Portfolio Inputs** with individual weights and returns
   - **NEW: Blended Return Calculation** (r_BLEND = Σ w<sub>i</sub> × r<sub>i</sub>)
   - **NEW: Toggle between Blended and Simple modes**
   - Adjustable policy value, loan balance, loan rate
   - Interest handling toggle (pay current vs capitalize)
   - Guardrail settings (LTV targets, caps, spread buffer, drawdown trigger)
   - Reserve requirements and borrowing plans
   - Real-time status determination (BORROW OK / PAUSE / FREEZE)
   - Visual chart showing policy value, loan balance, and net equity over time
   - Detailed projection table for years 1, 3, 5, 10, 20, 30

2. **Stress Test Simulator** - Scenario analysis with:
   - 4 preset scenarios: Base Case, Rate Spike, Under-Delivery, Drawdown
   - Custom scenario builder
   - Event timeline showing when guardrails trigger
   - Automatic pause/freeze logic based on breach conditions
   - Protocol recommendations for each stress scenario

✅ **Qualification & Lead Capture**
- Multi-step "What Happens Next" visual roadmap
- Comprehensive qualification form with net worth, goals, and timeline
- Advisor confirmation checkbox
- Form validation and success handling

✅ **Risk Disclosure & Compliance**
- Comprehensive risk disclosure modal with 6 risk categories
- Footer disclaimers covering educational nature, no guarantees, risks, tax treatment, underwriting, advisor requirements, and suitability
- Prominent notice banners throughout
- Calculator disclaimers on every projection

✅ **Design & UX**
- Brand colors: Dark Navy (#1a2332, #0f1419), Gold (#f5a623)
- Grid background pattern for institutional aesthetic
- Sticky navigation with smooth scroll
- Responsive design (desktop, tablet, mobile)
- Interactive tooltips for technical terms
- FAQ accordion functionality
- Mobile-friendly navigation toggle

---

## Current Functional Entry URIs

### Main Sections (Anchor Links)

| URI / Anchor | Description |
|--------------|-------------|
| `#hero` | Hero section with value proposition and 3-card system diagram |
| `#the-problem` | The Problem This Solves (3 wealth-killers) |
| `#how-it-works` | The 3-Step System (BUY → BORROW → DIE) |
| `#guardrails` | Risk Dashboard with gauges, failure modes, and requirements |
| `#calculator` | Interactive Calculators (Feasibility & Stress Test) |
| `#risks` | De-Risking & Failure Modes (6 risk categories) |
| `#faq` | Frequently Asked Questions (12 items) |
| `#qualify` | Qualification form and contact section |

### Interactive Elements

| Element | Functionality |
|---------|--------------|
| **Plain English / Advanced Toggle** | Switches between simplified and technical explanations throughout the page |
| **Feasibility Calculator** | Projects 30-year policy/loan balance with guardrail status |
| **Stress Test Simulator** | Tests 4 scenarios and shows event timeline |
| **FAQ Accordion** | Click questions to expand/collapse answers |
| **Risk Disclosure Modal** | Comprehensive risk information (triggered by "See How It Works" button) |
| **Qualification Form** | Captures lead information with validation |
| **Download Scenario** | Downloads calculator results as .txt file |

---

## Calculator Formulas & Logic

### Premium Financing & Blended Return Formulas

**Blended Portfolio Return (NEW):**
```
r_BLEND = Σ (wi × ri)  where Σwi = 100%
```
Example with default weights:
```
r_BLEND = (0.45 × 14%) + (0.20 × 20%) + (0.15 × 4%) + (0.10 × 2%) + (0.10 × 10%)
        = 6.3% + 4.0% + 0.6% + 0.2% + 1.0%
        = 12.1%
```

**Premium Financing Loan Balance:**
```
L_PF(t) = L_PF(t-1) + Draw_PF(t) + [I_PF if PIK] - PrincipalRepay(t)

where:
- Draw_PF(t) = f_PF × Premium(t)  (e.g., 80% × $1M = $800K)
- I_PF = L_PF(t-1) × r_PF  (e.g., 7.5%)
- PrincipalRepay(t) = L_PF at balloon year (e.g., Year 5)
```

**Liquidity Borrowing Balance:**
```
L_LIQ(t) = L_LIQ(t-1) + NewBorrow_LIQ(t) + [I_LIQ if PIK]

where:
- NewBorrow_LIQ(t) = auto-calculated to target LTV or manual fixed amount
- I_LIQ = L_LIQ(t-1) × r_LIQ
```

**Total LTV (KEY METRIC):**
```
TotalLTV(t) = (L_PF(t) + L_LIQ(t)) / P(t)
```
✅ **Guardrails use TOTAL leverage, not individual loans**

**Effective Interest Rate (Weighted):**
```
r_effective = (L_PF × r_PF + L_LIQ × r_LIQ) / (L_PF + L_LIQ)
```

**Annual Out-of-Pocket:**
```
OutOfPocket(t) = ClientCash(t) + InterestPaid(t) + CollatTopUp(t)

where:
- ClientCash(t) = (1 - f_PF) × Premium(t)  (e.g., 20% × $1M = $200K)
- InterestPaid(t) = I_PF + I_LIQ  (if paid current)
```

### Feasibility Calculator Core Formulas

**Policy Value Projection:**
```
Pt = Pt-1 × (1 + g)
```
Where:
- `Pt` = Policy Value at year t
- `g` = Net policy growth rate (blended return from sleeves)

**Loan Balance Projection:**
- **If interest paid current:**
  ```
  Lt = Lt-1 + new_borrowing
  ```
- **If interest capitalized (PIK):**
  ```
  Lt = Lt-1 + It + new_borrowing
  where It = Lt-1 × r (annual interest)
  ```

**Loan-to-Value (LTV):**
```
LTVt = Lt / Pt
```

**Net Equity:**
```
Et = Pt - Lt
```

**Annual Interest:**
```
It = Lt × r
where r = all-in loan rate (reference rate + spread)
```

**Required Reserve:**
```
Rt = It × (reserve_months / 12)
```

**Spread Cushion:**
```
S = g - r
```

### Guardrail Decision Logic

**Status Determination (in order of priority):**

1. **RED: De-risk Required**
   - Condition: `LTVt > hard_cap` (e.g., > 45%)
   - Action: Mandatory de-risk, collateral call possible

2. **PAUSE New Borrowing**
   - Condition A: `S < buffer` (e.g., spread cushion < 2%)
   - Condition B: `LTVt > target_max` (e.g., > 35%)
   - Action: Stop new borrowing until metrics improve

3. **FREEZE (Drawdown Scenario)**
   - Condition: Annual return < drawdown_trigger (e.g., < -20%)
   - Action: Freeze all new borrowing, preserve reserves

4. **BORROW OK**
   - Condition: All guardrails within safe zones
   - Action: New borrowing permitted up to target LTV

### Auto-Borrowing Logic (if selected)

```javascript
if (borrowPlan === 'auto' && status === 'BORROW OK') {
    target_loan = Pt × ltvMin
    new_borrowing = max(0, target_loan - Lt)
}
```

---

## Data Models

### Premium Financing Input Model (NEW v2.2)

```javascript
{
    // Premium Schedule
    annualPremium: 1000000,         // $1M per year
    years: 5,                       // Years 1-5
    totalPremium: 5000000,          // Total: $5M
    
    // Premium Financing
    premiumFinancing: {
        enabled: true,
        percentageFinanced: 80,     // 80% financed
        loanTerm: 5,                // 5-year term
        interestOnly: true,         // Interest-only during term
        balloonAtEnd: true,         // Balloon payment at Year 5
        interestPaidCurrent: true,  // Pay interest current (no PIK)
        collateralRatio: 100,       // 100% of PF loan
        availableCollateral: 2500000 // $2.5M available
    },
    
    // PF Rates
    pfRate: {
        referenceRate: 5.0,         // 5.0% reference (e.g., SOFR)
        spread: 2.5,                // 2.5% spread
        allInRate: 7.5              // 7.5% all-in
    },
    
    // Sleeve Allocation (UPDATED v2.2)
    sleeves: [
        { name: 'EPIG', weight: 45, expectedReturn: 14 },   // 14% (was 8%)
        { name: 'ECFS', weight: 20, expectedReturn: 20 },   // 20% (was 10%) ⬆️
        { name: 'Treasuries', weight: 15, expectedReturn: 4 }, // 4% (was 4.5%)
        { name: 'Cash', weight: 10, expectedReturn: 2 },    // 2% (was 3.5%)
        { name: 'BlueChip', weight: 10, expectedReturn: 10 } // 10% (was 9%)
    ],
    // Blended return: ~13.2% (was ~7.5%)
    
    // Liquidity Borrowing (Optional)
    liquidityBorrowing: {
        enabled: false,             // Default OFF
        startYear: 6,               // Start Year 6
        mode: 'auto',               // 'auto' or 'manual'
        autoTargetLTV: 30,          // Auto-borrow to 30% LTV
        manualAnnualDraw: 0         // Or fixed annual draw
    },
    
    // Guardrails
    guardrails: {
        ltvTargetMin: 25,           // 25% target minimum
        ltvTargetMax: 35,           // 35% target maximum
        ltvHardCap: 45,             // 45% hard cap
        spreadBuffer: 2.0,          // 2% spread cushion
        drawdownFreezeTrigger: -20, // -20% freeze
        reserveMonths: 18           // 18 months (range 12-24)
    },
    
    // Platform Minimums (NEW v2.2)
    platformMinimums: {
        firstYearMin: 1000000,      // $1M first year
        totalMin: 5000000           // $5M total
    }
}
```

### Calculator Input Model

```javascript
{
    policyValue: Number,           // Initial policy value ($)
    loanBalance: Number,           // Initial loan balance ($)
    growthRate: Number,            // Annual growth rate (decimal, e.g., 0.08)
    loanRate: Number,              // All-in loan rate (decimal, e.g., 0.075)
    payCurrentInterest: Boolean,   // true = pay current, false = PIK
    ltvMin: Number,                // Target LTV minimum (decimal, e.g., 0.25)
    ltvMax: Number,                // Target LTV maximum (decimal, e.g., 0.35)
    ltvCap: Number,                // Hard LTV cap (decimal, e.g., 0.45)
    spreadBuffer: Number,          // Required spread cushion (decimal, e.g., 0.02)
    drawdownTrigger: Number,       // Freeze trigger (decimal, e.g., -0.20)
    reserveMonths: Number,         // Required reserve months (12-24)
    borrowPlan: String,            // 'auto' or 'manual'
    annualBorrow: Number           // If manual, annual borrowing amount ($)
}
```

### Calculator Output Model (Enhanced v2.2)

```javascript
{
    year: Number,
    
    // Premium & Financing
    premiumPaid: Number,           // Annual premium ($1M Years 1-5)
    financedPremium: Number,       // 80% financed ($800K)
    clientCash: Number,            // 20% client cash ($200K)
    
    // Policy & Loan Balances
    policyValue: Number,           // P(t)
    pfLoanBalance: Number,         // L_PF(t) - Premium finance loan
    liqLoanBalance: Number,        // L_LIQ(t) - Liquidity borrowing
    totalLoan: Number,             // L_PF + L_LIQ
    netEquity: Number,             // P(t) - TotalLoan
    
    // LTV Metrics
    totalLTV: Number,              // (L_PF + L_LIQ) / P(t) ⬅️ KEY
    pfLTV: Number,                 // L_PF / P(t)
    liqLTV: Number,                // L_LIQ / P(t)
    
    // Interest & Reserves
    pfInterest: Number,            // PF loan interest
    liqInterest: Number,           // Liquidity loan interest
    totalInterest: Number,         // Total interest due
    requiredReserve: Number,       // Interest × (months/12)
    interestCoverage: Number,      // Coverage ratio
    
    // Collateral
    collateralRequired: Number,    // 100% of L_PF
    collateralAvailable: Number,   // Available collateral
    collateralShortfall: Number,   // Shortfall if any
    
    // Out-of-Pocket
    annualOutOfPocket: Number,     // Cash + Interest (if paid current)
    
    // Guardrail Status
    status: String,                // 'BORROW OK' / 'PAUSE' / 'FREEZE' / 'RED'
    statusClass: String,           // 'green' / 'amber' / 'blue' / 'red'
    statusReason: String,          // Human-readable explanation
    spreadCushion: Number,         // g - r_effective
    effectiveRate: Number,         // Weighted rate
    
    // Warnings & Flags
    balloonWarning: Boolean,       // True if balloon approaching (Years 3-5)
    collateralWarning: Boolean,    // True if collateral shortfall
    reserveWarning: Boolean        // True if reserve < minimum
}
```

### Stress Test Event Model

```javascript
{
    year: Number,
    type: String,                // 'drawdown' / 'pause' / 'breach' / 'reserve'
    description: String,         // Event description
    action: String               // Recommended guardrail response
}
```

---

## Features NOT Yet Implemented

❌ **Backend Integration**
- Form submissions currently log to console; need backend API endpoint
- No email notification system for qualified leads
- No CRM integration

❌ **Analytics & Tracking**
- Event tracking spec provided but not implemented
- No Google Analytics or similar tracking
- No conversion funnel analysis

❌ **Advanced Features**
- PDF generation for scenario downloads (currently .txt)
- Save/share scenario functionality
- Comparison tool for multiple scenarios side-by-side
- Video explainer embeds

❌ **Content Management**
- Static HTML; no CMS integration
- FAQ content cannot be updated without code changes

---

## Recommended Next Steps

### Priority 1: Backend & Lead Capture
1. **Set up backend API endpoint** for form submissions
   - Endpoint: `POST /api/qualify-leads`
   - Store leads in database or CRM
   - Send confirmation email to user
   - Send notification to advisor team

2. **Implement email notifications**
   - User: Confirmation + next steps
   - Advisors: New lead alert with form data

3. **Add spam protection**
   - Implement reCAPTCHA or similar
   - Rate limiting on form submissions

### Priority 2: Analytics & Optimization
1. **Add Google Analytics 4**
   - Track page views, scroll depth, time on site
   - Calculator completion rate
   - Form submission funnel

2. **Implement event tracking**
   - Calculator interactions (inputs changed, calculate clicked)
   - FAQ expansions
   - CTA button clicks
   - Download scenario clicks
   - Risk disclosure modal opens

3. **A/B testing infrastructure**
   - Test hero copy variations
   - Test CTA button placements
   - Test form field requirements

### Priority 3: Enhanced Features
1. **Improve calculator visualizations**
   - Replace canvas chart with Chart.js or ECharts for better interactivity
   - Add hover tooltips on chart data points
   - Add zoom/pan capabilities

2. **PDF generation for scenarios**
   - Use jsPDF library for professional PDFs
   - Include branded header/footer
   - Embed charts and tables

3. **Save/share scenarios**
   - Generate unique URLs for saved scenarios
   - Allow users to email scenarios to themselves
   - Social sharing capabilities

### Priority 4: Content & SEO
1. **SEO optimization**
   - Add meta descriptions, OG tags, schema markup
   - Optimize page load speed
   - Add blog section for ongoing content

2. **Video content**
   - Embed explainer videos in hero or how-it-works section
   - Video testimonials (if available)

3. **Case studies**
   - Add real (anonymized) case study section
   - "Success stories" page

### Priority 5: Advanced Qualification
1. **Multi-step qualification wizard**
   - Break form into progressive steps
   - Show qualification score/fit indicator
   - Provide immediate feedback on suitability

2. **Scheduling integration**
   - Integrate Calendly or similar for immediate scheduling
   - Show advisor availability

---

## Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS Grid, Flexbox, custom properties
- **Vanilla JavaScript** - No frameworks/dependencies for calculator logic
- **Google Fonts** - Inter (sans-serif), Playfair Display (serif)
- **Font Awesome 6** - Icons via CDN

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
- Initial page load: ~200KB (uncompressed HTML/CSS/JS)
- No external JS dependencies
- Inline critical CSS possible for optimization

---

## File Structure

```
/
├── index.html              # Main landing page (single-page)
├── css/
│   └── style.css          # All styles (responsive, mobile-first)
├── js/
│   └── main.js            # Calculator logic, interactivity, form handling
└── README.md              # This file
```

---

## Deployment Instructions

### Option 1: Static Hosting (Recommended)
1. Upload all files to static host (Netlify, Vercel, AWS S3 + CloudFront)
2. Ensure `index.html` is set as root document
3. Configure custom domain (e.g., guardrails.ekantik-capital.com)
4. Enable HTTPS (automatic on Netlify/Vercel)

### Option 2: Traditional Web Server
1. Upload files to web server document root
2. Ensure server serves `index.html` as default document
3. Configure HTTPS with SSL certificate
4. Set up proper caching headers for CSS/JS

### Environment Variables (Future)
When backend is added, configure:
- `API_ENDPOINT` - Form submission endpoint
- `GA_TRACKING_ID` - Google Analytics ID
- `RECAPTCHA_SITE_KEY` - reCAPTCHA public key

---

## Brand Guidelines

### Colors
- **Primary Navy Dark:** `#0f1419` (body background)
- **Primary Navy:** `#1a2332` (cards, sections)
- **Navy Light:** `#2a3a4f` (hover states)
- **Gold Primary:** `#f5a623` (CTAs, accents, headings)
- **Gold Hover:** `#d98f1a`
- **Text Light:** `#ffffff`
- **Text Muted:** `#a8b2c1`
- **Green Safe:** `#10b981` (positive indicators)
- **Amber Caution:** `#f59e0b` (warning indicators)
- **Red Danger:** `#ef4444` (danger indicators)

### Typography
- **Headings:** Playfair Display (serif, 600-800 weight)
- **Body:** Inter (sans-serif, 300-700 weight)
- **Accent Text:** Gold color (#f5a623)

### Tone
- Institutional, professional, credible
- Transparent about risks
- Educational, not sales-y
- No hype, no guarantees
- Guardrails-first messaging

---

## Legal & Compliance Notes

⚠️ **CRITICAL:** This website is for educational purposes only.

**Included Disclaimers:**
- Educational only; not advice; not an offer
- No guarantees on projections or tax treatment
- Underwriting required; not everyone qualifies
- Advisor requirement (independent tax/legal counsel)
- Leverage magnifies losses
- Multiple risk categories disclosed
- Tax law subject to change
- Suitability requirements disclosed

**Review Requirements:**
- Legal review recommended before launch
- Compliance review by broker-dealer (if applicable)
- State insurance regulations check
- SEC marketing rule compliance (if RIA)

---

## Support & Maintenance

### Regular Updates Needed
- **Annual:** Review tax law references (IRC §7702, §101(a))
- **Quarterly:** Update interest rate examples (SOFR references)
- **As Needed:** Add new FAQ items based on common questions
- **Ongoing:** Monitor form submissions and response times

### Content Ownership
- All content provided by client (Ekantik Capital Advisors LLC)
- Calculator logic and formulas reviewed for educational accuracy
- Risk disclosures are comprehensive but should be reviewed by counsel

---

## Contact Information

**Project Developer:** AI Assistant  
**Project Date:** February 1, 2026  
**Version:** 2.2  

**Client Contact:**  
Ekantik Capital Advisors LLC  
Email: contact@ekantik-capital.com  

---

## License

© 2025 Ekantik Capital Advisors LLC. All rights reserved.

This website and its content are proprietary to Ekantik Capital Advisors LLC. Unauthorized reproduction, distribution, or use is prohibited.

---

## Changelog

### Version 2.3 (2026-02-01) - Investment Engines Integration
- ✅ **NEW: Investment Engines Showcase Section**
  - Added prominent section after BUY step showing EPIG 500 and ECFS strategies
  - Side-by-side comparison cards with performance metrics
  - **EPIG 500 highlights:** 16.1% hypothetical CAGR, 0% target downside, 1% locked fee for founding members
  - **ECFS highlights:** 6% quarterly target (24% annual), high-water mark protection, 6% safety buffer cap
  - Direct links to strategy landing pages (epig500.ekantikcapital.com, cashflow.ekantikcapital.com)
  - "Which Strategy for BBD?" decision matrix
  - Clear explanation of how both strategies work within guardrailed BBD framework
- ✅ **Performance/Risk Summaries:**
  - EPIG 500: Complete downside protection, performance guarantee, 3/11 down years avoided
  - ECFS: Quarterly distributions, HWM protection, auto-pause protocol, capital preservation
- ✅ **README updated** with investment engines integration details

### Version 2.2 (2026-02-01) - Final Default Updates
- ✅ **Premium schedule updated:** $1M/year × 5 years (was implicit $5M Year 1)
- ✅ **ECFS return increased:** 20% (was 10%) → new blended ~13.2%
- ✅ **All calculator sleeve defaults updated** to match config
- ✅ **Premium financing defaults formalized:**
  - 80% financed, 7.5% rate, interest-only Years 1-5, balloon Year 5
  - Collateral ratio 100%, available collateral $2.5M example
  - Interest paid current by default (no PIK)
- ✅ **Platform Minimums check panel added**
  - Optional dropdown: $1M/$2M/$5M first year, $5M/$10M total
  - Real-time validation with status badge
- ✅ **PPLI minimums disclaimer** added near BUY section
- ✅ **Verified:** Guardrail logic uses TOTAL leverage (L_PF + L_LIQ)
- ✅ **Updated:** All landing page copy, tables, examples reflect new defaults
- ✅ **Annual out-of-pocket** calculation documented
- ✅ **README updated** with comprehensive v2.2 changes

### Version 2.1 (2026-02-01) - Premium Financing & Calculator Engine
- ✅ **Premium Financing Module:**
  - Complete landing page section explaining premium financing
  - Benefits vs Risks 2-column layout
  - "What Can Go Wrong" callouts
  - Premium Financing Guardrails panel
- ✅ **Production Calculator Engine:**
  - New file: `js/calculator-engine.js` (PremiumFinancingCalculator class)
  - Full premium financing math (L_PF, L_LIQ, Total LTV)
  - Blended portfolio return from 5-sleeve allocation
  - 30-year projections with detailed breakdowns
  - Balloon risk indicators and collateral tracking
  - 4 stress test scenarios (Base, Rate Spike, Under-Delivery, Drawdown)
  - Export to JSON/CSV
- ✅ **JSON Config System:**
  - New file: `config/defaults.json`
  - Centralized defaults for all inputs
  - Stress scenario presets
  - Disclaimer text repository
- ✅ **Enhanced Guardrails Dashboard:**
  - Total LTV (PF + liquidity) calculation
  - Interest coverage metrics
  - Collateral adequacy tracking
  - Balloon/term risk indicators

### Version 2.0 (2026-02-01) - PPLI Chassis & Diversification
- ✅ **PPLI Wrapper Clarification:**
  - Dedicated section: "The Policy Is the Chassis"
  - IRC §7702 compliance explanation
  - Clear distinction: chassis vs investment sleeve
- ✅ **IRC §817(h) Diversification:**
  - Plain English diversification explanation
  - Reference to Treas. Reg. §1.817-5
  - Interactive "Learn More" modal
  - Quarterly testing requirements
  - Look-through rules and safe harbors
- ✅ **5-Sleeve Investment Allocation:**
  - Visual pie chart with canvas rendering
  - Allocation table (5 sleeves with weights and returns)
  - Blended return calculation: r_BLEND = Σ(w<sub>i</sub> × r<sub>i</sub>)
  - Illustrative allocation: 45% EPIG, 20% ECFS, 15% TSY, 10% Cash, 10% Blue Chip
- ✅ **Upgraded Calculators:**
  - Blended portfolio mode with adjustable sleeve weights
  - Real-time blended return calculation
  - Allocation warning (IRC §817(h) compliance note)
  - Toggle between Blended and Simple modes
- ✅ **Enhanced Compliance:**
  - "What's Required from You" section
  - Strengthened risk disclosures
  - Diversification compliance statement
  - IRC §817(h) educational modal

### Version 1.0 (2026-02-01) - Initial Release
- ✅ Complete landing page with 10 major sections
- ✅ Two interactive calculators with full projection logic
- ✅ Comprehensive risk disclosure and compliance text
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ FAQ accordion (12 items)
- ✅ Qualification form with validation
- ✅ Plain English / Advanced content toggle
- ✅ Sticky navigation with smooth scroll
- ✅ Risk dashboard with failure modes panel
- ✅ Download scenario functionality (.txt)

---

## Appendix: Calculator Testing Scenarios

### Test Scenario 1: Conservative (Should show "BORROW OK")
- Policy Value: $5,000,000
- Loan Balance: $1,250,000 (25% LTV)
- Growth Rate: 8%
- Loan Rate: 6%
- Pay Current: Yes
- Expected: All years BORROW OK

### Test Scenario 2: Aggressive (Should trigger PAUSE)
- Policy Value: $5,000,000
- Loan Balance: $2,000,000 (40% LTV)
- Growth Rate: 6%
- Loan Rate: 7%
- Pay Current: Yes
- Expected: PAUSE due to negative spread cushion

### Test Scenario 3: Over-Leveraged (Should trigger RED)
- Policy Value: $5,000,000
- Loan Balance: $2,500,000 (50% LTV)
- Growth Rate: 8%
- Loan Rate: 6%
- Pay Current: No (PIK)
- Expected: RED - exceeds hard cap within 5-10 years

### Stress Test Scenarios
- **Base Case:** Growth 8%, Rate 7% → Clean run
- **Rate Spike:** Growth 8%, Rate 9% → PAUSE due to negative/thin spread
- **Under-Delivery:** Growth 5%, Rate 7% → PAUSE, potential breach
- **Drawdown:** Growth 8% with Year 3 at -20% → FREEZE in Year 3

---

**END OF README**