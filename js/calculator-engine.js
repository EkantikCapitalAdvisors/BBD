// ===================================
// PREMIUM FINANCING BBD CALCULATOR
// Comprehensive Model with Blended Returns
// ===================================

class PremiumFinancingCalculator {
    constructor(config) {
        this.config = config;
        this.results = null;
    }

    // Calculate blended return from sleeve allocation
    calculateBlendedReturn(sleeves) {
        let blendedReturn = 0;
        let totalWeight = 0;
        
        sleeves.forEach(sleeve => {
            blendedReturn += (sleeve.weight / 100) * (sleeve.expectedReturn / 100);
            totalWeight += sleeve.weight;
        });
        
        if (Math.abs(totalWeight - 100) > 0.01) {
            console.warn('Sleeve weights do not total 100%:', totalWeight);
        }
        
        return blendedReturn;
    }

    // Main projection calculation
    calculate(inputs) {
        const {
            premiumSchedule,
            premiumFinancing,
            sleeves,
            loanRates,
            guardrails,
            liquidityBorrowing,
            policySettings,
            stressScenario
        } = inputs;

        // Calculate blended return
        const baseBlendedReturn = this.calculateBlendedReturn(sleeves);
        const netChargeDrag = (policySettings.netChargeDrag || 0) / 100;
        const effectiveGrowthRate = baseBlendedReturn - netChargeDrag;

        // Initialize arrays
        const projections = [];
        
        // Starting values
        let P = policySettings.initialPolicyValue || 0; // Policy value
        let L_PF = 0; // Premium finance loan balance
        let L_LIQ = 0; // Liquidity borrowing balance
        
        // Available collateral (constant or can model changes)
        const availableCollateral = premiumFinancing.availableCollateral || 0;
        
        // Calculate up to 30 years
        for (let year = 1; year <= 30; year++) {
            // Annual premium (only during premium years)
            const Prem = year <= premiumSchedule.years ? premiumSchedule.annualPremium : 0;
            
            // Premium financing draws
            const Draw_PF = premiumFinancing.enabled && Prem > 0 
                ? Prem * (premiumFinancing.percentageFinanced / 100) 
                : 0;
            
            // Client cash contribution
            const ClientCash = Prem > 0 
                ? Prem * (1 - premiumFinancing.percentageFinanced / 100)
                : 0;
            
            // Apply stress scenario growth adjustment
            let g = effectiveGrowthRate;
            
            if (stressScenario) {
                if (stressScenario.drawdownYear === year) {
                    // Apply one-year drawdown shock
                    g = stressScenario.drawdownShock / 100;
                } else if (stressScenario.growthAdjustment !== 0) {
                    // Apply permanent growth adjustment
                    g = effectiveGrowthRate + (stressScenario.growthAdjustment / 100);
                }
            }
            
            // Update policy value
            P = P * (1 + g) + Prem;
            
            // PF loan rate (with stress adjustment if applicable)
            let r_PF = loanRates.premiumFinance.allInRate / 100;
            if (stressScenario && stressScenario.rateAdjustmentPF) {
                r_PF += stressScenario.rateAdjustmentPF / 100;
            }
            
            // Calculate PF interest
            const I_PF = L_PF * r_PF;
            
            // Update PF loan balance
            let PF_PrincipalRepay = 0;
            
            // Check for balloon repayment
            if (premiumFinancing.balloonAtEnd && year === premiumFinancing.loanTerm) {
                PF_PrincipalRepay = L_PF; // Full repayment at balloon
            }
            
            if (premiumFinancing.interestPaidCurrent) {
                L_PF = L_PF + Draw_PF - PF_PrincipalRepay;
            } else {
                // Capitalize interest (PIK)
                L_PF = L_PF + Draw_PF + I_PF - PF_PrincipalRepay;
            }
            
            // Liquidity borrowing (optional, starts after specified year)
            let NewBorrow_LIQ = 0;
            let I_LIQ = 0;
            let r_LIQ = loanRates.liquidityBorrowing.allInRate / 100;
            
            if (stressScenario && stressScenario.rateAdjustmentLIQ) {
                r_LIQ += stressScenario.rateAdjustmentLIQ / 100;
            }
            
            if (liquidityBorrowing.enabled && year >= liquidityBorrowing.startYear) {
                I_LIQ = L_LIQ * r_LIQ;
                
                // Calculate new borrowing based on mode
                if (liquidityBorrowing.mode === 'auto') {
                    const targetLTV = liquidityBorrowing.autoTargetLTV / 100;
                    const currentTotalLoan = L_PF + L_LIQ;
                    const targetTotalLoan = P * targetLTV;
                    NewBorrow_LIQ = Math.max(0, targetTotalLoan - currentTotalLoan);
                } else if (liquidityBorrowing.mode === 'manual') {
                    NewBorrow_LIQ = liquidityBorrowing.manualAnnualDraw;
                }
                
                // Update liquidity loan balance
                if (premiumFinancing.interestPaidCurrent) {
                    L_LIQ = L_LIQ + NewBorrow_LIQ;
                } else {
                    L_LIQ = L_LIQ + NewBorrow_LIQ + I_LIQ;
                }
            }
            
            // Calculate total metrics
            const TotalLoan = L_PF + L_LIQ;
            const TotalLTV = P > 0 ? TotalLoan / P : 0;
            const NetEquity = P - TotalLoan;
            
            // Calculate weighted effective rate
            let r_effective = 0;
            if (TotalLoan > 0) {
                r_effective = (L_PF * r_PF + L_LIQ * r_LIQ) / TotalLoan;
            }
            
            // Spread cushion
            const SpreadCushion = effectiveGrowthRate - r_effective;
            
            // Total interest due
            const InterestTotal = I_PF + I_LIQ;
            
            // Required reserve
            const ReserveReq = InterestTotal * (guardrails.reserveMonths / 12);
            
            // Collateral requirement
            const CollatReq = L_PF * (premiumFinancing.collateralRatio / 100);
            const CollatShortfall = Math.max(0, CollatReq - availableCollateral);
            
            // Annual out-of-pocket
            const OutOfPocket = ClientCash + (premiumFinancing.interestPaidCurrent ? InterestTotal : 0);
            
            // Guardrail status determination
            const status = this.determineStatus(
                TotalLTV,
                SpreadCushion,
                g,
                guardrails
            );
            
            // Check for balloon warning
            const balloonWarning = premiumFinancing.balloonAtEnd && 
                                   year >= premiumFinancing.loanTerm - 2 && 
                                   year <= premiumFinancing.loanTerm && 
                                   L_PF > 0;
            
            // Store projection
            projections.push({
                year,
                premium: Prem,
                financedPremium: Draw_PF,
                clientCash: ClientCash,
                policyValue: P,
                pfLoanBalance: L_PF,
                liqLoanBalance: L_LIQ,
                totalLoan: TotalLoan,
                totalLTV: TotalLTV,
                netEquity: NetEquity,
                growthRate: g,
                pfInterest: I_PF,
                liqInterest: I_LIQ,
                totalInterest: InterestTotal,
                requiredReserve: ReserveReq,
                collateralRequired: CollatReq,
                collateralAvailable: availableCollateral,
                collateralShortfall: CollatShortfall,
                spreadCushion: SpreadCushion,
                outOfPocket: OutOfPocket,
                status: status.badge,
                statusClass: status.class,
                statusReason: status.reason,
                balloonWarning: balloonWarning,
                pfPrincipalRepay: PF_PrincipalRepay
            });
        }
        
        this.results = projections;
        return projections;
    }

    determineStatus(totalLTV, spreadCushion, growthRate, guardrails) {
        const hardCap = guardrails.ltvHardCap / 100;
        const targetMax = guardrails.ltvTargetMax / 100;
        const buffer = guardrails.spreadBuffer / 100;
        const drawdownTrigger = guardrails.drawdownFreezeTrigger / 100;
        
        // Priority order for status
        if (totalLTV > hardCap) {
            return {
                badge: 'RED: De-risk Required',
                class: 'red',
                reason: `Total LTV (${(totalLTV * 100).toFixed(1)}%) exceeds hard cap (${(hardCap * 100).toFixed(0)}%). Mandatory de-leveraging required.`
            };
        }
        
        if (spreadCushion <= buffer) {
            return {
                badge: 'PAUSE New Borrowing',
                class: 'amber',
                reason: `Spread cushion (${(spreadCushion * 100).toFixed(1)}%) at or below safety buffer (${(buffer * 100).toFixed(1)}%). Pause new borrowing until arbitrage improves.`
            };
        }
        
        if (growthRate <= drawdownTrigger) {
            return {
                badge: 'FREEZE: Protect Reserves',
                class: 'red',
                reason: `Growth rate (${(growthRate * 100).toFixed(1)}%) indicates severe drawdown. Freeze all new borrowing; preserve reserves.`
            };
        }
        
        if (totalLTV > targetMax) {
            return {
                badge: 'PAUSE New Borrowing',
                class: 'amber',
                reason: `Total LTV (${(totalLTV * 100).toFixed(1)}%) exceeds target maximum (${(targetMax * 100).toFixed(0)}%). Pause until de-levered to target range.`
            };
        }
        
        return {
            badge: 'BORROW OK (Within Guardrails)',
            class: 'green',
            reason: 'All guardrails within safe zones. New borrowing permitted up to target LTV.'
        };
    }

    // Stress test runner
    runStressTest(baseInputs, scenarioConfig) {
        const stressInputs = JSON.parse(JSON.stringify(baseInputs)); // Deep copy
        
        // Apply scenario adjustments
        if (scenarioConfig.affectedSleeves && scenarioConfig.growthAdjustment !== 0) {
            // Adjust specific sleeves
            stressInputs.sleeves = stressInputs.sleeves.map(sleeve => {
                if (scenarioConfig.affectedSleeves.includes(sleeve.name)) {
                    return {
                        ...sleeve,
                        expectedReturn: sleeve.expectedReturn + scenarioConfig.growthAdjustment
                    };
                }
                return sleeve;
            });
        }
        
        stressInputs.stressScenario = scenarioConfig;
        
        return this.calculate(stressInputs);
    }

    // Export results for download
    exportResults(format = 'json') {
        if (!this.results) {
            throw new Error('No results to export. Run calculate() first.');
        }
        
        if (format === 'json') {
            return JSON.stringify(this.results, null, 2);
        }
        
        // CSV format
        if (format === 'csv') {
            const headers = Object.keys(this.results[0]).join(',');
            const rows = this.results.map(row => 
                Object.values(row).map(val => 
                    typeof val === 'number' ? val.toFixed(2) : val
                ).join(',')
            );
            return [headers, ...rows].join('\n');
        }
        
        return null;
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.PremiumFinancingCalculator = PremiumFinancingCalculator;
}

// Export for Node.js/module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumFinancingCalculator;
}
