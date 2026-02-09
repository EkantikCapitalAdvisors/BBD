/**
 * ENHANCED CALCULATOR ENGINE - TWO-PHASE RETURNS + DEATH BENEFIT
 * Implements:
 * 1. Two-phase return regime (Years 1-10 engines, Years 11+ SPY)
 * 2. Wealth creation breakdown
 * 3. Compare mode (engines vs SPY-only)
 * 4. Death benefit estimator with actuarial proxy
 */

const EnhancedCalculator = {
    // Configuration
    config: {
        engineYears: 10,
        engineReturn: 0.15, // 15% default
        spyReturn: 0.10, // 10% default
        borrowRate: 0.075, // 7.5%
        compareMode: false,
        
        // Death benefit defaults
        dbDefaults: {
            age: 50,
            sex: 'Male',
            underwritingClass: 'Standard',
            dbOption: 'B', // Increasing
            specifiedAmount: 0,
            useCorridorMin: true
        }
    },
    
    // Corridor factors by age (actuarial proxy)
    getCorridorFactor(age) {
        if (age <= 40) return 1.25;
        if (age <= 50) return 1.20;
        if (age <= 60) return 1.15;
        if (age <= 70) return 1.10;
        return 1.05;
    },
    
    // Get return for given year based on phase
    getReturn(year) {
        return year <= this.config.engineYears ? this.config.engineReturn : this.config.spyReturn;
    },
    
    // Main projection function with two-phase returns
    project(inputs) {
        const {
            initialPolicyValue = 5000000,
            initialLoanBalance = 1750000,
            premiumSchedule = {}, // {year: amount}
            borrowingSchedule = {}, // {year: amount}
            horizon = 30,
            pfFinanced = 0.8, // 80% premium financing
            pfLoanBalance = 0 // Initial PF loan
        } = inputs;
        
        let results = [];
        let P = initialPolicyValue;
        let L_policy = initialLoanBalance; // Policy loan
        let L_pf = pfLoanBalance; // Premium finance loan
        
        // Attribution trackers
        let clientPremiums = 0;
        let financedPremiums = 0;
        let totalInterestPaid = 0;
        let engineGrowthContribution = 0;
        let indexGrowthContribution = 0;
        
        for (let t = 1; t <= horizon; t++) {
            const r_t = this.getReturn(t);
            const premium_t = premiumSchedule[t] || 0;
            const clientPortion = premium_t * (1 - pfFinanced);
            const financedPortion = premium_t * pfFinanced;
            
            // Policy growth
            const growth_t = P * r_t;
            P = P + growth_t + premium_t;
            
            // Track growth attribution
            if (t <= this.config.engineYears) {
                engineGrowthContribution += growth_t;
            } else {
                indexGrowthContribution += growth_t;
            }
            
            // Premium financing
            if (financedPortion > 0) {
                L_pf += financedPortion;
                financedPremiums += financedPortion;
            }
            clientPremiums += clientPortion;
            
            // Interest
            const interest_pf = L_pf * this.config.borrowRate;
            const interest_policy = L_policy * this.config.borrowRate;
            const totalInterest_t = interest_pf + interest_policy;
            totalInterestPaid += totalInterest_t;
            
            // Borrowing
            const borrow_t = borrowingSchedule[t] || 0;
            L_policy += borrow_t;
            
            // Loans update (interest paid current by default)
            // If PIK: L_pf += interest_pf; L_policy += interest_policy;
            
            const L_total = L_pf + L_policy;
            const netEquity = P - L_total;
            const ltv = L_total / P;
            
            // Guardrail status
            let status = 'BORROW OK';
            if (ltv > 0.45) status = 'RED: DE-RISK REQUIRED';
            else if (ltv > 0.35) status = 'PAUSE NEW BORROWING';
            
            results.push({
                year: t,
                policyValue: P,
                loanBalance_policy: L_policy,
                loanBalance_pf: L_pf,
                loanBalance_total: L_total,
                netEquity: netEquity,
                ltv: ltv,
                returnUsed: r_t * 100,
                phase: t <= this.config.engineYears ? 'Engine' : 'Index',
                growth: growth_t,
                premium: premium_t,
                interest: totalInterest_t,
                status: status
            });
        }
        
        // Final breakdown
        const breakdown = {
            clientPremiums,
            financedPremiums,
            totalPremiums: clientPremiums + financedPremiums,
            totalInterestPaid,
            engineGrowthContribution,
            indexGrowthContribution,
            totalGrowth: engineGrowthContribution + indexGrowthContribution,
            finalPolicyValue: P,
            finalLoanBalance: L_pf + L_policy,
            finalNetEquity: P - (L_pf + L_policy)
        };
        
        return {
            results,
            breakdown
        };
    },
    
    // Compare mode: SPY-only for all years
    projectCompare(inputs) {
        const originalEngineReturn = this.config.engineReturn;
        this.config.engineReturn = this.config.spyReturn;
        this.config.engineYears = 0; // Force SPY for all years
        
        const compareResults = this.project(inputs);
        
        // Restore original config
        this.config.engineReturn = originalEngineReturn;
        this.config.engineYears = 10;
        
        return compareResults;
    },
    
    // Death benefit estimator
    estimateDeathBenefit(inputs) {
        const {
            policyValue,
            age = this.config.dbDefaults.age,
            sex = this.config.dbDefaults.sex,
            underwritingClass = this.config.dbDefaults.underwritingClass,
            dbOption = this.config.dbDefaults.dbOption,
            specifiedAmount = this.config.dbDefaults.specifiedAmount,
            totalLoans = 0
        } = inputs;
        
        const corridorFactor = this.getCorridorFactor(age);
        let estDB;
        
        if (dbOption === 'B') {
            // Option B: Increasing (common for accumulation)
            estDB = Math.max(
                specifiedAmount + policyValue,
                policyValue * corridorFactor
            );
        } else {
            // Option A: Level
            estDB = Math.max(
                specifiedAmount,
                policyValue * corridorFactor
            );
        }
        
        const netToHeirs = Math.max(0, estDB - totalLoans);
        
        return {
            estimatedDeathBenefit: estDB,
            corridorFactor: corridorFactor,
            totalLoans: totalLoans,
            netToHeirs: netToHeirs,
            age: age,
            dbOption: dbOption,
            disclaimer: 'Illustrative estimate only — NOT a carrier illustration. Actual death benefit depends on underwriting, policy design, corridor rules, charges, and carrier pricing.'
        };
    },
    
    // Calculate value-add: engines vs SPY-only
    calculateValueAdd(mainResults, compareResults) {
        const diff = {
            netEquityDiff: mainResults.breakdown.finalNetEquity - compareResults.breakdown.finalNetEquity,
            growthDiff: mainResults.breakdown.totalGrowth - compareResults.breakdown.totalGrowth,
            percentageImprovement: ((mainResults.breakdown.finalNetEquity / compareResults.breakdown.finalNetEquity - 1) * 100)
        };
        return diff;
    },
    
    // Format currency
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    },
    
    // Format percentage
    formatPercent(value) {
        return (value * 100).toFixed(2) + '%';
    }
};

// Initialize calculator with default preset
function initGuardrailedExamplePreset() {
    // Default premium schedule: $1M/year for 5 years
    const premiumSchedule = {
        1: 1000000,
        2: 1000000,
        3: 1000000,
        4: 1000000,
        5: 1000000
    };
    
    // Default borrowing: none
    const borrowingSchedule = {};
    
    // Run projection
    const mainResults = EnhancedCalculator.project({
        initialPolicyValue: 5000000,
        initialLoanBalance: 1750000,
        premiumSchedule: premiumSchedule,
        borrowingSchedule: borrowingSchedule,
        horizon: 30,
        pfFinanced: 0.8,
        pfLoanBalance: 4000000 // Initial PF loan from 80% of first premium
    });
    
    // Compare mode (optional)
    if (EnhancedCalculator.config.compareMode) {
        const compareResults = EnhancedCalculator.projectCompare({
            initialPolicyValue: 5000000,
            initialLoanBalance: 1750000,
            premiumSchedule: premiumSchedule,
            borrowingSchedule: borrowingSchedule,
            horizon: 30,
            pfFinanced: 0.8,
            pfLoanBalance: 4000000
        });
        
        const valueAdd = EnhancedCalculator.calculateValueAdd(mainResults, compareResults);
        console.log('Engine Value-Add:', valueAdd);
    }
    
    // Death benefit estimate at Year 30
    const finalYear = mainResults.results[29]; // Year 30
    const dbEstimate = EnhancedCalculator.estimateDeathBenefit({
        policyValue: finalYear.policyValue,
        age: 50 + 30, // Age 80 at Year 30
        sex: 'Male',
        underwritingClass: 'Standard',
        dbOption: 'B',
        specifiedAmount: 0,
        totalLoans: finalYear.loanBalance_total
    });
    
    return {
        mainResults,
        dbEstimate
    };
}

// Export for use in page
window.EnhancedCalculator = EnhancedCalculator;
window.initGuardrailedExamplePreset = initGuardrailedExamplePreset;
