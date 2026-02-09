// ===================================
// EKANTIK CAPITAL ADVISORS
// Guardrailed Buy, Borrow & Die
// Main JavaScript
// ===================================

// Global state
let calculatorData = null;

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeToggles();
    initializeCalculators();
    initializeStressTest();
    initializeFAQ();
    initializeForm();
    initializeTooltips();
    setupRangeInputs();
    initializeCalcSectionCollapse();
});

// ===================================
// NAVIGATION
// ===================================

function initializeNavigation() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-open');
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===================================
// PLAIN ENGLISH / ADVANCED TOGGLE
// ===================================

function initializeToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            
            // Update button states
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle content
            if (mode === 'plain') {
                document.querySelectorAll('.plain-text').forEach(el => el.classList.remove('hidden'));
                document.querySelectorAll('.advanced-text').forEach(el => el.classList.add('hidden'));
            } else {
                document.querySelectorAll('.plain-text').forEach(el => el.classList.add('hidden'));
                document.querySelectorAll('.advanced-text').forEach(el => el.classList.remove('hidden'));
            }
        });
    });
}

// ===================================
// CALCULATOR INITIALIZATION
// ===================================

function initializeCalculators() {
    // Calculator tabs
    const calcTabs = document.querySelectorAll('.calc-tab-btn');
    const calcPanels = document.querySelectorAll('.calculator-panel');
    
    calcTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetCalc = this.getAttribute('data-calc');
            
            // Update tabs
            calcTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update panels
            calcPanels.forEach(panel => {
                if (panel.id === targetCalc + '-calc') {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            });
        });
    });
    
    // Rate type toggle
    const rateTypeRadios = document.querySelectorAll('input[name="rateType"]');
    rateTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const rateComponents = document.getElementById('rateComponents');
            const allInRate = document.getElementById('allInRate');
            
            if (this.value === 'components') {
                rateComponents.style.display = 'block';
                allInRate.style.display = 'none';
            } else {
                rateComponents.style.display = 'none';
                allInRate.style.display = 'block';
            }
        });
    });
    
    // Borrowing plan toggle
    const borrowPlanRadios = document.querySelectorAll('input[name="borrowPlan"]');
    borrowPlanRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const manualInput = document.getElementById('manualBorrowInput');
            
            if (this.value === 'manual') {
                manualInput.style.display = 'block';
            } else {
                manualInput.style.display = 'none';
            }
        });
    });
    
    // Calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', runFeasibilityCalculator);
    }
    
    // Download button
    const downloadBtn = document.getElementById('downloadScenario');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadScenario);
    }
}

// ===================================
// RANGE INPUT DISPLAY
// ===================================

function setupRangeInputs() {
    const ranges = [
        { id: 'growthRate', displayId: 'growthRateValue', suffix: '' },
        { id: 'refRate', displayId: 'refRateValue', suffix: '' },
        { id: 'spread', displayId: 'spreadValue', suffix: '' },
        { id: 'allInRateInput', displayId: 'allInRateValue', suffix: '' },
        { id: 'ltvCap', displayId: 'ltvCapValue', suffix: '' },
        { id: 'spreadBuffer', displayId: 'spreadBufferValue', suffix: '' },
        { id: 'drawdownTrigger', displayId: 'drawdownTriggerValue', suffix: '' },
        { id: 'reserveMonths', displayId: 'reserveMonthsValue', suffix: '' },
        { id: 'stressGrowth', displayId: 'stressGrowthValue', suffix: '' },
        { id: 'stressRate', displayId: 'stressRateValue', suffix: '' },
        { id: 'drawdownReturn', displayId: 'drawdownReturnValue', suffix: '' },
        // NEW: Two-phase return regime inputs
        { id: 'engineYears', displayId: 'engineYearsValue', suffix: '' },
        { id: 'engineReturn', displayId: 'engineReturnValue', suffix: '' },
        { id: 'spyReturn', displayId: 'spyReturnValue', suffix: '' }
    ];
    
    ranges.forEach(range => {
        const input = document.getElementById(range.id);
        const display = document.getElementById(range.displayId);
        
        if (input && display) {
            input.addEventListener('input', function() {
                display.textContent = this.value + range.suffix;
            });
        }
    });
}

// ===================================
// FEASIBILITY CALCULATOR
// ===================================

function runFeasibilityCalculator() {
    // Get inputs
    const inputs = getCalculatorInputs();
    
    // Validate inputs
    if (!validateInputs(inputs)) {
        // Validation function now shows its own detailed alert message
        return;
    }
    
    // Calculate projections
    const projections = calculateProjections(inputs);
    
    // Store in global state
    calculatorData = { inputs, projections };
    
    // Display results
    displayCalculatorResults(inputs, projections);
}

function getCalculatorInputs() {
    const rateType = document.querySelector('input[name="rateType"]:checked').value;
    let loanRate;
    
    if (rateType === 'components') {
        const refRate = parseFloat(document.getElementById('refRate').value);
        const spread = parseFloat(document.getElementById('spread').value);
        loanRate = refRate + spread;
    } else {
        loanRate = parseFloat(document.getElementById('allInRateInput').value);
    }
    
    const borrowPlan = document.querySelector('input[name="borrowPlan"]:checked').value;
    let annualBorrow = 0;
    if (borrowPlan === 'manual') {
        annualBorrow = parseFloat(document.getElementById('annualBorrow').value) || 0;
    }
    
    // Get growth rate - use blended if in blended mode, otherwise simple
    let growthRate;
    if (sleeveMode === 'blended') {
        // Calculate blended return from sleeve inputs
        growthRate = calculateBlendedReturn();
    } else {
        growthRate = parseFloat(document.getElementById('growthRate').value) / 100;
    }
    
    return {
        policyValue: parseFloat(document.getElementById('policyValue').value),
        loanBalance: parseFloat(document.getElementById('loanBalance').value),
        growthRate: growthRate,
        loanRate: loanRate / 100,
        payCurrentInterest: document.getElementById('payCurrentInterest').checked,
        ltvMin: parseFloat(document.getElementById('ltvMin').value) / 100,
        ltvMax: parseFloat(document.getElementById('ltvMax').value) / 100,
        ltvCap: parseFloat(document.getElementById('ltvCap').value) / 100,
        spreadBuffer: parseFloat(document.getElementById('spreadBuffer').value) / 100,
        drawdownTrigger: parseFloat(document.getElementById('drawdownTrigger').value) / 100,
        reserveMonths: parseInt(document.getElementById('reserveMonths').value),
        borrowPlan: borrowPlan,
        annualBorrow: annualBorrow,
        sleeveMode: sleeveMode,
        // NEW: Two-phase return regime
        engineYears: parseInt(document.getElementById('engineYears')?.value || 10),
        engineReturn: parseFloat(document.getElementById('engineReturn')?.value || 15) / 100,
        spyReturn: parseFloat(document.getElementById('spyReturn')?.value || 10) / 100,
        compareMode: document.getElementById('compareMode')?.checked || false,
        // NEW: Death benefit inputs
        dbAge: parseInt(document.getElementById('dbAge')?.value || 50),
        dbSex: document.getElementById('dbSex')?.value || 'Male',
        dbClass: document.getElementById('dbClass')?.value || 'Standard',
        dbOption: document.getElementById('dbOption')?.value || 'B',
        dbSpecified: parseFloat(document.getElementById('dbSpecified')?.value || 0),
        dbUseCorridor: document.getElementById('dbUseCorridor')?.checked !== false
    };
}

function validateInputs(inputs) {
    // Check if policy value is positive
    if (!inputs.policyValue || inputs.policyValue <= 0) {
        alert('❌ Initial Policy Value must be greater than zero.\n\nExample: Enter 5000000 for $5 million');
        return false;
    }
    
    // Check if loan balance exceeds policy value
    if (inputs.loanBalance > inputs.policyValue) {
        alert(`❌ Initial Loan Balance ($${formatCurrency(inputs.loanBalance)}) cannot exceed Policy Value ($${formatCurrency(inputs.policyValue)}).\n\nLoan-to-Value (LTV) would be ${((inputs.loanBalance / inputs.policyValue) * 100).toFixed(1)}%, which exceeds safe limits.\n\nRecommendation: Keep loan balance at 25-35% of policy value.`);
        return false;
    }
    
    // Check if LTV is reasonable
    const ltv = inputs.loanBalance / inputs.policyValue;
    if (ltv > 0.50) {
        const confirmHighLTV = confirm(`⚠️ Warning: Your starting LTV is ${(ltv * 100).toFixed(1)}%, which is above the recommended 35% target.\n\nThis may trigger guardrail warnings immediately.\n\nDo you want to continue anyway?`);
        if (!confirmHighLTV) {
            return false;
        }
    }
    
    return true;
}

function calculateProjections(inputs) {
    const years = [1, 3, 5, 10, 20, 30];
    const projections = [];
    
    let Pt = inputs.policyValue;
    let Lt = inputs.loanBalance;
    
    // Track wealth creation components
    let totalEngineGrowth = 0;
    let totalIndexGrowth = 0;
    let totalInterestPaid = 0;
    
    for (let year = 1; year <= 30; year++) {
        // TWO-PHASE RETURN REGIME
        const currentReturn = year <= inputs.engineYears ? inputs.engineReturn : inputs.spyReturn;
        const phase = year <= inputs.engineYears ? 'Engine' : 'Index';
        
        // Calculate annual interest
        const interest = Lt * inputs.loanRate;
        totalInterestPaid += interest;
        
        // Update loan balance
        if (inputs.payCurrentInterest) {
            // Interest paid current - don't add to loan
            // Calculate new borrowing if applicable
            let newBorrow = 0;
            if (inputs.borrowPlan === 'auto') {
                const targetLoan = Pt * inputs.ltvMin; // Borrow up to target LTV
                newBorrow = Math.max(0, targetLoan - Lt);
            } else if (inputs.borrowPlan === 'manual' && year > 1) {
                newBorrow = inputs.annualBorrow;
            }
            
            // Check guardrails before adding new borrowing (use CURRENT return for spread)
            const spreadCushion = currentReturn - inputs.loanRate;
            const projectedLTV = (Lt + newBorrow) / Pt;
            
            if (spreadCushion < inputs.spreadBuffer || projectedLTV > inputs.ltvMax) {
                newBorrow = 0; // PAUSE new borrowing
            }
            
            Lt = Lt + newBorrow;
        } else {
            // Capitalize interest (PIK)
            Lt = Lt + interest;
        }
        
        // Update policy value with phase-appropriate return
        const growth = Pt * currentReturn;
        Pt = Pt * (1 + currentReturn);
        
        // Track growth attribution
        if (phase === 'Engine') {
            totalEngineGrowth += growth;
        } else {
            totalIndexGrowth += growth;
        }
        
        // Calculate metrics
        const equity = Pt - Lt;
        const ltv = Lt / Pt;
        const requiredReserve = (interest * inputs.reserveMonths) / 12;
        const spreadCushion = currentReturn - inputs.loanRate;
        
        // Determine status
        let status = 'BORROW OK';
        let statusClass = 'green';
        let statusReason = 'All guardrails within safe zones.';
        
        if (ltv > inputs.ltvCap) {
            status = 'RED: De-risk Required';
            statusClass = 'red';
            statusReason = `LTV (${(ltv * 100).toFixed(1)}%) exceeds hard cap (${(inputs.ltvCap * 100).toFixed(0)}%).`;
        } else if (spreadCushion < inputs.spreadBuffer) {
            status = 'PAUSE New Borrowing';
            statusClass = 'amber';
            statusReason = `Spread cushion (${(spreadCushion * 100).toFixed(1)}%) below safety buffer (${(inputs.spreadBuffer * 100).toFixed(1)}%).`;
        } else if (ltv > inputs.ltvMax) {
            status = 'PAUSE New Borrowing';
            statusClass = 'amber';
            statusReason = `LTV (${(ltv * 100).toFixed(1)}%) exceeds target range (${(inputs.ltvMax * 100).toFixed(0)}%).`;
        }
        
        // Store if this is a key year
        if (years.includes(year)) {
            projections.push({
                year: year,
                policyValue: Pt,
                loanBalance: Lt,
                equity: equity,
                ltv: ltv,
                annualInterest: interest,
                requiredReserve: requiredReserve,
                spreadCushion: spreadCushion,
                returnUsed: currentReturn * 100,
                phase: phase,
                status: status,
                statusClass: statusClass,
                statusReason: statusReason
            });
        }
    }
    
    // Add wealth creation breakdown to final projection
    projections.breakdown = {
        engineGrowth: totalEngineGrowth,
        indexGrowth: totalIndexGrowth,
        totalGrowth: totalEngineGrowth + totalIndexGrowth,
        totalInterestPaid: totalInterestPaid,
        finalPolicyValue: Pt,
        finalLoanBalance: Lt,
        finalNetEquity: Pt - Lt
    };
    
    return projections;
}

// Death Benefit Estimator (Actuarial Proxy)
function estimateDeathBenefit(inputs, projections) {
    const finalYear = projections[projections.length - 1];
    const yearsElapsed = finalYear.year;
    const finalAge = inputs.dbAge + yearsElapsed;
    
    // Corridor factors by age (IRC §7702 compliance proxy)
    function getCorridorFactor(age) {
        if (age <= 40) return 1.25;
        if (age <= 50) return 1.20;
        if (age <= 60) return 1.15;
        if (age <= 70) return 1.10;
        return 1.05;
    }
    
    const corridorFactor = inputs.dbUseCorridor ? getCorridorFactor(finalAge) : 1.0;
    let estimatedDB;
    
    if (inputs.dbOption === 'B') {
        // Option B: Increasing Death Benefit
        estimatedDB = Math.max(
            inputs.dbSpecified + finalYear.policyValue,
            finalYear.policyValue * corridorFactor
        );
    } else {
        // Option A: Level Death Benefit
        estimatedDB = Math.max(
            inputs.dbSpecified,
            finalYear.policyValue * corridorFactor
        );
    }
    
    const netToHeirs = Math.max(0, estimatedDB - finalYear.loanBalance);
    
    return {
        estimatedDB: estimatedDB,
        corridorFactor: corridorFactor,
        finalAge: finalAge,
        netToHeirs: netToHeirs,
        disclaimer: 'Illustrative estimate only — NOT a carrier illustration.'
    };
}

function displayCalculatorResults(inputs, projections) {
    const outputDiv = document.getElementById('calcOutputs');
    
    // Build output HTML
    let html = '<div class="calc-results">';
    
    // Summary cards for current year
    const current = projections[0]; // Year 1
    html += `
        <div class="output-cards">
            <div class="output-card">
                <div class="output-label">Net Equity (Year 1)</div>
                <div class="output-value">${formatCurrency(current.equity)}</div>
            </div>
            <div class="output-card">
                <div class="output-label">LTV (Year 1)</div>
                <div class="output-value">${(current.ltv * 100).toFixed(1)}%</div>
            </div>
            <div class="output-card">
                <div class="output-label">Status</div>
                <div class="output-status-badge ${current.statusClass}">${current.status}</div>
            </div>
        </div>
    `;
    
    // Status explanation
    html += `
        <div class="status-explanation" style="background: rgba(245, 166, 35, 0.1); border: 1px solid var(--gold-primary); border-radius: 6px; padding: 1rem; margin: 1.5rem 0;">
            <strong style="color: var(--gold-primary);">Why this status?</strong>
            <p style="color: var(--text-muted); margin-top: 0.5rem;">${current.statusReason}</p>
        </div>
    `;
    
    // WEALTH CREATION BREAKDOWN (NEW)
    if (projections.breakdown) {
        const bd = projections.breakdown;
        html += `
            <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid var(--green-safe); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <h4 style="color: var(--text-light); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-chart-pie"></i> Wealth Creation Breakdown (30 Years)
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Engine Growth (Years 1-${inputs.engineYears})</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--green-safe);">${formatCurrency(bd.engineGrowth)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Index Growth (Years ${inputs.engineYears + 1}+)</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--gold-primary);">${formatCurrency(bd.indexGrowth)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Total Growth</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-light);">${formatCurrency(bd.totalGrowth)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Total Interest Paid</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--red-danger);">${formatCurrency(bd.totalInterestPaid)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Final Policy Value</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-light);">${formatCurrency(bd.finalPolicyValue)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Final Net Equity</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--gold-primary);">${formatCurrency(bd.finalNetEquity)}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // DEATH BENEFIT ESTIMATE (NEW)
    if (inputs.dbAge) {
        const dbEstimate = estimateDeathBenefit(inputs, projections);
        html += `
            <div style="background: rgba(168, 178, 193, 0.08); border: 1px dashed var(--gold-primary); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <h4 style="color: var(--text-light); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-heartbeat"></i> Death Benefit Estimate at Year 30
                </h4>
                <p style="font-size: 0.8rem; color: var(--amber-caution); margin-bottom: 1rem;">
                    <strong>IMPORTANT:</strong> ${dbEstimate.disclaimer}
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Age at Year 30</div>
                        <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-light);">${dbEstimate.finalAge} years</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Corridor Factor</div>
                        <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-light);">${dbEstimate.corridorFactor.toFixed(2)}x</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Estimated Death Benefit</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--green-safe);">${formatCurrency(dbEstimate.estimatedDB)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Loans Outstanding</div>
                        <div style="font-size: 1.1rem; font-weight: 600; color: var(--red-danger);">-${formatCurrency(projections[projections.length - 1].loanBalance)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">Net to Heirs</div>
                        <div style="font-size: 1.3rem; font-weight: 700; color: var(--gold-primary);">${formatCurrency(dbEstimate.netToHeirs)}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Chart placeholder
    html += `
        <div class="output-chart" style="position: relative;">
            <canvas id="projectionChart"></canvas>
        </div>
    `;
    
    // Projection table
    html += `
        <table class="output-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Phase</th>
                    <th>Return</th>
                    <th>Policy Value</th>
                    <th>Loan Balance</th>
                    <th>Net Equity</th>
                    <th>LTV</th>
                    <th>Annual Interest</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    projections.forEach(proj => {
        const phaseColor = proj.phase === 'Engine' ? 'var(--green-safe)' : 'var(--gold-primary)';
        html += `
            <tr>
                <td>Year ${proj.year}</td>
                <td><span style="color: ${phaseColor}; font-weight: 600;">${proj.phase}</span></td>
                <td>${proj.returnUsed.toFixed(1)}%</td>
                <td>${formatCurrency(proj.policyValue)}</td>
                <td>${formatCurrency(proj.loanBalance)}</td>
                <td>${formatCurrency(proj.equity)}</td>
                <td>${(proj.ltv * 100).toFixed(1)}%</td>
                <td>${formatCurrency(proj.annualInterest)}</td>
                <td><span class="output-status-badge ${proj.statusClass}" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">${proj.status}</span></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    html += '</div>';
    
    outputDiv.innerHTML = html;
    
    // Draw chart
    drawProjectionChart(projections);
}

function drawProjectionChart(projections) {
    const canvas = document.getElementById('projectionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 400;
    
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(26, 35, 50, 0.8)';
    ctx.fillRect(0, 0, width, height);
    
    // Chart dimensions
    const padding = { top: 30, right: 100, bottom: 50, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Get data ranges
    const maxValue = Math.max(...projections.map(p => p.policyValue));
    const minValue = 0;
    
    // Draw axes
    ctx.strokeStyle = '#3a4a5f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(58, 74, 95, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    }
    
    // Draw lines
    const drawLine = (data, color, label) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding.left + (chartWidth / (data.length - 1)) * index;
            const y = height - padding.bottom - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    };
    
    // Draw data
    drawLine(projections.map(p => p.policyValue), '#f5a623', 'Policy Value');
    drawLine(projections.map(p => p.loanBalance), '#ef4444', 'Loan Balance');
    drawLine(projections.map(p => p.equity), '#10b981', 'Net Equity');
    
    // Draw labels
    ctx.fillStyle = '#a8b2c1';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    projections.forEach((proj, index) => {
        const x = padding.left + (chartWidth / (projections.length - 1)) * index;
        ctx.fillText(`Y${proj.year}`, x, height - padding.bottom + 20);
    });
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = minValue + ((maxValue - minValue) / 5) * (5 - i);
        const y = padding.top + (chartHeight / 5) * i;
        ctx.fillText(formatCurrency(value, true), padding.left - 10, y + 5);
    }
    
    // Legend
    const legends = [
        { color: '#f5a623', label: 'Policy Value' },
        { color: '#ef4444', label: 'Loan Balance' },
        { color: '#10b981', label: 'Net Equity' }
    ];
    
    ctx.textAlign = 'left';
    legends.forEach((legend, index) => {
        const x = width - padding.right + 10;
        const y = padding.top + index * 25;
        
        ctx.fillStyle = legend.color;
        ctx.fillRect(x, y - 8, 15, 3);
        
        ctx.fillStyle = '#a8b2c1';
        ctx.fillText(legend.label, x + 20, y);
    });
}

// ===================================
// STRESS TEST CALCULATOR
// ===================================

function initializeStressTest() {
    // Scenario buttons
    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const scenario = this.getAttribute('data-scenario');
            updateStressTestInputs(scenario);
        });
    });
    
    // Run stress test button
    const runBtn = document.getElementById('runStressTest');
    if (runBtn) {
        runBtn.addEventListener('click', runStressTest);
    }
}

function updateStressTestInputs(scenario) {
    const growthInput = document.getElementById('stressGrowth');
    const rateInput = document.getElementById('stressRate');
    const drawdownControls = document.getElementById('drawdownControls');
    
    drawdownControls.style.display = 'none';
    
    switch(scenario) {
        case 'base':
            growthInput.value = 8;
            rateInput.value = 7;
            break;
        case 'rate-spike':
            growthInput.value = 8;
            rateInput.value = 9;
            break;
        case 'under-deliver':
            growthInput.value = 5;
            rateInput.value = 7;
            break;
        case 'drawdown':
            growthInput.value = 8;
            rateInput.value = 7;
            drawdownControls.style.display = 'block';
            break;
    }
    
    // Update displays
    document.getElementById('stressGrowthValue').textContent = growthInput.value;
    document.getElementById('stressRateValue').textContent = rateInput.value;
}

function runStressTest() {
    const growthRate = parseFloat(document.getElementById('stressGrowth').value) / 100;
    const loanRate = parseFloat(document.getElementById('stressRate').value) / 100;
    
    const activeScenario = document.querySelector('.scenario-btn.active');
    const scenarioType = activeScenario ? activeScenario.getAttribute('data-scenario') : 'base';
    
    let drawdownReturn = 0;
    let drawdownYear = 0;
    
    if (scenarioType === 'drawdown') {
        drawdownReturn = parseFloat(document.getElementById('drawdownReturn').value) / 100;
        drawdownYear = parseInt(document.getElementById('drawdownYear').value);
    }
    
    // Use baseline inputs or defaults
    const inputs = {
        policyValue: 5000000,
        loanBalance: 1750000, // 35% LTV start
        growthRate: growthRate,
        loanRate: loanRate,
        payCurrentInterest: true,
        ltvMin: 0.25,
        ltvMax: 0.35,
        ltvCap: 0.45,
        spreadBuffer: 0.02,
        drawdownTrigger: -0.20,
        reserveMonths: 18,
        borrowPlan: 'auto',
        annualBorrow: 0,
        drawdownReturn: drawdownReturn,
        drawdownYear: drawdownYear
    };
    
    const results = calculateStressScenario(inputs);
    displayStressTestResults(results, scenarioType);
}

function calculateStressScenario(inputs) {
    const events = [];
    let Pt = inputs.policyValue;
    let Lt = inputs.loanBalance;
    
    for (let year = 1; year <= 10; year++) {
        let yearReturn = inputs.growthRate;
        
        // Apply drawdown if applicable
        if (inputs.drawdownYear === year) {
            yearReturn = inputs.drawdownReturn;
            events.push({
                year: year,
                type: 'drawdown',
                description: `Market drawdown: ${(inputs.drawdownReturn * 100).toFixed(1)}% return`,
                action: 'FREEZE all new borrowing'
            });
        }
        
        const interest = Lt * inputs.loanRate;
        const spreadCushion = yearReturn - inputs.loanRate;
        
        // Update policy value
        Pt = Pt * (1 + yearReturn);
        
        // Calculate LTV before any new borrowing
        const currentLTV = Lt / Pt;
        
        // Check guardrails
        if (spreadCushion < inputs.spreadBuffer) {
            events.push({
                year: year,
                type: 'pause',
                description: `Spread cushion (${(spreadCushion * 100).toFixed(1)}%) below buffer (${(inputs.spreadBuffer * 100).toFixed(1)}%)`,
                action: 'PAUSE new borrowing'
            });
        }
        
        if (currentLTV > inputs.ltvCap) {
            events.push({
                year: year,
                type: 'breach',
                description: `LTV (${(currentLTV * 100).toFixed(1)}%) exceeds hard cap (${(inputs.ltvCap * 100).toFixed(0)}%)`,
                action: 'Mandatory de-risk / collateral call'
            });
        }
        
        // Check reserve adequacy
        const requiredReserve = (interest * inputs.reserveMonths) / 12;
        if (requiredReserve > Pt * 0.1) { // Reserve > 10% of policy value
            events.push({
                year: year,
                type: 'reserve',
                description: `Reserve requirement (${formatCurrency(requiredReserve)}) high relative to policy value`,
                action: 'Consider rebuilding reserves or reducing borrowing'
            });
        }
        
        // New borrowing (only if no freeze)
        const isDrawdownYear = inputs.drawdownYear === year;
        const hasSpreadCushion = spreadCushion >= inputs.spreadBuffer;
        const underTargetLTV = currentLTV < inputs.ltvMax;
        
        if (!isDrawdownYear && hasSpreadCushion && underTargetLTV && inputs.payCurrentInterest) {
            // Auto borrow to maintain target
            const targetLoan = Pt * inputs.ltvMin;
            const newBorrow = Math.max(0, targetLoan - Lt);
            Lt = Lt + newBorrow;
        }
    }
    
    const finalLTV = Lt / Pt;
    const finalEquity = Pt - Lt;
    
    return {
        events: events,
        finalPolicyValue: Pt,
        finalLoanBalance: Lt,
        finalEquity: finalEquity,
        finalLTV: finalLTV,
        inputs: inputs
    };
}

function displayStressTestResults(results, scenarioType) {
    const outputDiv = document.getElementById('stressResults');
    
    const scenarioNames = {
        'base': 'Base Case',
        'rate-spike': 'Rate Spike',
        'under-deliver': 'Under-Delivery',
        'drawdown': 'Drawdown Scenario'
    };
    
    let html = '<div class="stress-results-content">';
    
    html += `<h3 style="color: var(--gold-primary); margin-bottom: 1.5rem;">${scenarioNames[scenarioType]} Results</h3>`;
    
    // Summary
    html += `
        <div class="output-cards">
            <div class="output-card">
                <div class="output-label">Final Policy Value (Year 10)</div>
                <div class="output-value">${formatCurrency(results.finalPolicyValue)}</div>
            </div>
            <div class="output-card">
                <div class="output-label">Final LTV</div>
                <div class="output-value">${(results.finalLTV * 100).toFixed(1)}%</div>
            </div>
            <div class="output-card">
                <div class="output-label">Final Net Equity</div>
                <div class="output-value">${formatCurrency(results.finalEquity)}</div>
            </div>
        </div>
    `;
    
    // Events timeline
    if (results.events.length > 0) {
        html += `
            <div style="margin-top: 2rem;">
                <h4 style="color: var(--text-light); margin-bottom: 1rem;">Timeline Events</h4>
        `;
        
        results.events.forEach(event => {
            const iconMap = {
                'drawdown': 'exclamation-triangle',
                'pause': 'pause-circle',
                'breach': 'ban',
                'reserve': 'piggy-bank'
            };
            
            const colorMap = {
                'drawdown': '#ef4444',
                'pause': '#f59e0b',
                'breach': '#ef4444',
                'reserve': '#f59e0b'
            };
            
            html += `
                <div style="background: rgba(26, 35, 50, 0.8); padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 3px solid ${colorMap[event.type]};">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <i class="fas fa-${iconMap[event.type]}" style="color: ${colorMap[event.type]};"></i>
                        <strong style="color: var(--text-light);">Year ${event.year}</strong>
                    </div>
                    <p style="color: var(--text-muted); margin: 0 0 0.5rem 0;">${event.description}</p>
                    <p style="color: ${colorMap[event.type]}; font-weight: 600; margin: 0;"><i class="fas fa-arrow-right"></i> ${event.action}</p>
                </div>
            `;
        });
        
        html += '</div>';
    } else {
        html += `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--green-safe); border-radius: 6px; padding: 1.5rem; margin-top: 2rem; text-align: center;">
                <i class="fas fa-check-circle" style="color: var(--green-safe); font-size: 2rem; margin-bottom: 0.5rem;"></i>
                <p style="color: var(--green-safe); font-weight: 600; margin: 0;">No guardrail breaches in this scenario!</p>
            </div>
        `;
    }
    
    // What we do section
    html += `
        <div style="background: rgba(245, 166, 35, 0.1); border: 1px solid var(--gold-primary); border-radius: 6px; padding: 1.5rem; margin-top: 2rem;">
            <h4 style="color: var(--gold-primary); margin-bottom: 1rem;"><i class="fas fa-tools"></i> Guardrail Response Protocol</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 0.5rem 0; color: var(--text-muted);"><i class="fas fa-snowflake" style="color: var(--gold-primary); margin-right: 0.5rem;"></i> Pause or freeze new draws as needed</li>
                <li style="padding: 0.5rem 0; color: var(--text-muted);"><i class="fas fa-piggy-bank" style="color: var(--gold-primary); margin-right: 0.5rem;"></i> Rebuild interest reserves</li>
                <li style="padding: 0.5rem 0; color: var(--text-muted);"><i class="fas fa-balance-scale" style="color: var(--gold-primary); margin-right: 0.5rem;"></i> Consider partial deleveraging if needed</li>
                <li style="padding: 0.5rem 0; color: var(--text-muted);"><i class="fas fa-search" style="color: var(--gold-primary); margin-right: 0.5rem;"></i> Re-underwrite assumptions quarterly</li>
                <li style="padding: 0.5rem 0; color: var(--text-muted);"><i class="fas fa-clock" style="color: var(--gold-primary); margin-right: 0.5rem;"></i> Allow time for market recovery</li>
            </ul>
        </div>
    `;
    
    html += '</div>';
    
    outputDiv.innerHTML = html;
}

// ===================================
// FAQ ACCORDION
// ===================================

function initializeFAQ() {
    // Category toggle functionality
    const faqCategories = document.querySelectorAll('.faq-category-header');
    
    faqCategories.forEach(header => {
        header.addEventListener('click', function() {
            const category = this.parentElement;
            category.classList.toggle('active');
        });
    });
    
    // Individual FAQ item toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Toggle current item
            item.classList.toggle('active');
            
            // Close other items (optional - remove if you want multiple open)
            // faqItems.forEach(other => {
            //     if (other !== item) {
            //         other.classList.remove('active');
            //     }
            // });
        });
    });
}

// ===================================
// FORM HANDLING
// ===================================

function initializeForm() {
    const form = document.getElementById('qualifyForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }
}

function handleFormSubmit() {
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        netWorth: document.getElementById('netWorth').value,
        primaryGoal: document.getElementById('primaryGoal').value,
        timeline: document.getElementById('timeline').value,
        message: document.getElementById('message').value,
        advisorConfirm: document.getElementById('advisorConfirm').checked
    };
    
    // Validate
    if (!formData.fullName || !formData.email || !formData.netWorth || !formData.primaryGoal || !formData.advisorConfirm) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Show success message
    alert('Thank you! Your strategy call request has been submitted. We will contact you within 1-2 business days to schedule your consultation.');
    
    // Reset form
    document.getElementById('qualifyForm').reset();
    
    // In production, you would send this to a backend endpoint
    console.log('Form submitted:', formData);
}

// ===================================
// RISK DISCLOSURE MODAL
// ===================================

function openRiskDisclosure() {
    const modal = document.getElementById('riskModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeRiskDisclosure() {
    const modal = document.getElementById('riskModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal on outside click
window.addEventListener('click', function(e) {
    const modal = document.getElementById('riskModal');
    if (e.target === modal) {
        closeRiskDisclosure();
    }
});

// ===================================
// TOOLTIPS
// ===================================

function initializeTooltips() {
    const triggers = document.querySelectorAll('.tooltip-trigger');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function(e) {
            const tooltipId = this.getAttribute('data-tooltip');
            const tooltipContent = document.getElementById(tooltipId);
            
            if (tooltipContent) {
                // Clone and show tooltip
                const tooltip = tooltipContent.cloneNode(true);
                tooltip.classList.add('show');
                tooltip.style.position = 'fixed';
                
                document.body.appendChild(tooltip);
                
                // Position tooltip
                const triggerRect = this.getBoundingClientRect();
                tooltip.style.left = (triggerRect.left + triggerRect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = (triggerRect.bottom + 10) + 'px';
                
                // Store reference
                this.tooltipElement = tooltip;
            }
        });
        
        trigger.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
}

// ===================================
// DOWNLOAD SCENARIO
// ===================================

function downloadScenario() {
    if (!calculatorData) {
        alert('Please run a calculation first.');
        return;
    }
    
    // Generate PDF-like text summary
    let content = '=================================================\n';
    content += 'EKANTIK CAPITAL ADVISORS\n';
    content += 'Guardrailed Buy, Borrow & Die - Scenario Summary\n';
    content += '=================================================\n\n';
    
    content += 'INPUTS:\n';
    content += `  Initial Policy Value: ${formatCurrency(calculatorData.inputs.policyValue)}\n`;
    content += `  Initial Loan Balance: ${formatCurrency(calculatorData.inputs.loanBalance)}\n`;
    content += `  Growth Rate: ${(calculatorData.inputs.growthRate * 100).toFixed(1)}%\n`;
    content += `  Loan Rate: ${(calculatorData.inputs.loanRate * 100).toFixed(1)}%\n`;
    content += `  Pay Current Interest: ${calculatorData.inputs.payCurrentInterest ? 'Yes' : 'No (PIK)'}\n`;
    content += `  LTV Target: ${(calculatorData.inputs.ltvMin * 100).toFixed(0)}%-${(calculatorData.inputs.ltvMax * 100).toFixed(0)}%\n`;
    content += `  LTV Hard Cap: ${(calculatorData.inputs.ltvCap * 100).toFixed(0)}%\n\n`;
    
    content += 'PROJECTIONS:\n\n';
    calculatorData.projections.forEach(proj => {
        content += `Year ${proj.year}:\n`;
        content += `  Policy Value: ${formatCurrency(proj.policyValue)}\n`;
        content += `  Loan Balance: ${formatCurrency(proj.loanBalance)}\n`;
        content += `  Net Equity: ${formatCurrency(proj.equity)}\n`;
        content += `  LTV: ${(proj.ltv * 100).toFixed(1)}%\n`;
        content += `  Status: ${proj.status}\n\n`;
    });
    
    content += '\n=================================================\n';
    content += 'DISCLAIMERS:\n';
    content += 'Illustrative only. Not a guarantee. Not advice.\n';
    content += 'Requires comprehensive underwriting. Not an offer.\n';
    content += '=================================================\n';
    
    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guardrailed-bbd-scenario.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatCurrency(value, short = false) {
    if (short) {
        if (value >= 1000000) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return '$' + (value / 1000).toFixed(0) + 'K';
        }
    }
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// ===================================
// BLENDED PORTFOLIO FUNCTIONS
// ===================================

let sleeveMode = 'blended'; // 'blended' or 'simple'

function toggleSleeveMode() {
    const blendedMode = document.getElementById('blendedMode');
    const simpleMode = document.getElementById('simpleMode');
    const modeLabel = document.getElementById('sleeveModeLabel');
    
    if (sleeveMode === 'blended') {
        sleeveMode = 'simple';
        blendedMode.style.display = 'none';
        simpleMode.style.display = 'block';
        modeLabel.textContent = 'Switch to Blended';
    } else {
        sleeveMode = 'blended';
        blendedMode.style.display = 'block';
        simpleMode.style.display = 'none';
        modeLabel.textContent = 'Switch to Simple';
    }
}

function updateWeights() {
    // Get all weights
    const epigWeight = parseFloat(document.getElementById('epigWeight').value);
    const ecfsWeight = parseFloat(document.getElementById('ecfsWeight').value);
    const tsyWeight = parseFloat(document.getElementById('tsyWeight').value);
    const cashWeight = parseFloat(document.getElementById('cashWeight').value);
    const blueWeight = parseFloat(document.getElementById('blueWeight').value);
    
    // Update displays
    document.getElementById('epigWeightDisplay').textContent = epigWeight;
    document.getElementById('ecfsWeightDisplay').textContent = ecfsWeight;
    document.getElementById('tsyWeightDisplay').textContent = tsyWeight;
    document.getElementById('cashWeightDisplay').textContent = cashWeight;
    document.getElementById('blueWeightDisplay').textContent = blueWeight;
    
    // Calculate total
    const total = epigWeight + ecfsWeight + tsyWeight + cashWeight + blueWeight;
    document.getElementById('totalWeight').textContent = total + '%';
    
    // Warn if not 100%
    const totalWeightEl = document.getElementById('totalWeight');
    if (total !== 100) {
        totalWeightEl.style.color = 'var(--red-danger)';
    } else {
        totalWeightEl.style.color = 'var(--gold-primary)';
    }
    
    // IRC §817(h) compliance check
    checkIRC817Compliance([epigWeight, ecfsWeight, tsyWeight, cashWeight, blueWeight]);
    
    // Calculate blended return
    calculateBlendedReturn();
}

// IRC §817(h) Diversification Compliance Checker
function checkIRC817Compliance(weights) {
    // Sort weights descending
    const sorted = [...weights].sort((a, b) => b - a);
    
    // IRC §817(h) safe harbor tests
    const test1 = sorted[0] <= 55; // Single asset ≤ 55%
    const test2 = (sorted[0] + sorted[1]) <= 70; // Any 2 ≤ 70%
    const test3 = (sorted[0] + sorted[1] + sorted[2]) <= 80; // Any 3 ≤ 80%
    const test4 = (sorted[0] + sorted[1] + sorted[2] + sorted[3]) <= 90; // Any 4 ≤ 90%
    
    const allPass = test1 && test2 && test3 && test4;
    
    // Update compliance badge (if it exists)
    const complianceBadge = document.querySelector('.irc-compliance-status');
    if (complianceBadge) {
        if (allPass) {
            complianceBadge.innerHTML = '<i class="fas fa-shield-alt"></i> ✓ IRC §817(h) COMPLIANT';
            complianceBadge.style.color = 'var(--green-safe)';
        } else {
            complianceBadge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ⚠ IRC §817(h) VIOLATION';
            complianceBadge.style.color = 'var(--red-danger)';
        }
    }
    
    // Show/hide compliance details
    const complianceTests = document.querySelector('.irc-compliance-tests');
    if (complianceTests) {
        const testResults = `
            • Single asset ≤ 55%: ${sorted[0].toFixed(0)}% ${test1 ? '✓' : '❌'}<br>
            • Any 2 assets ≤ 70%: ${(sorted[0] + sorted[1]).toFixed(0)}% ${test2 ? '✓' : '❌'}<br>
            • Any 3 assets ≤ 80%: ${(sorted[0] + sorted[1] + sorted[2]).toFixed(0)}% ${test3 ? '✓' : '❌'}<br>
            • Any 4 assets ≤ 90%: ${(sorted[0] + sorted[1] + sorted[2] + sorted[3]).toFixed(0)}% ${test4 ? '✓' : '❌'}
        `;
        complianceTests.innerHTML = testResults;
    }
    
    return allPass;
}

function calculateBlendedReturn() {
    // Get weights (as decimals)
    const w_epig = parseFloat(document.getElementById('epigWeight').value) / 100;
    const w_ecfs = parseFloat(document.getElementById('ecfsWeight').value) / 100;
    const w_tsy = parseFloat(document.getElementById('tsyWeight').value) / 100;
    const w_cash = parseFloat(document.getElementById('cashWeight').value) / 100;
    const w_blue = parseFloat(document.getElementById('blueWeight').value) / 100;
    
    // Get returns (as decimals)
    const r_epig = parseFloat(document.getElementById('epigReturn').value) / 100;
    const r_ecfs = parseFloat(document.getElementById('ecfsReturn').value) / 100;
    const r_tsy = parseFloat(document.getElementById('tsyReturn').value) / 100;
    const r_cash = parseFloat(document.getElementById('cashReturn').value) / 100;
    const r_blue = parseFloat(document.getElementById('blueReturn').value) / 100;
    
    // Calculate blended return: r_BLEND = Σ (wi * ri)
    const r_blend = (w_epig * r_epig) + (w_ecfs * r_ecfs) + (w_tsy * r_tsy) + 
                    (w_cash * r_cash) + (w_blue * r_blue);
    
    // Display
    document.getElementById('blendedReturn').textContent = (r_blend * 100).toFixed(2) + '%';
    
    // Also update the simple mode growth rate to match
    const growthRateInput = document.getElementById('growthRate');
    const growthRateValue = document.getElementById('growthRateValue');
    if (growthRateInput && growthRateValue) {
        growthRateInput.value = (r_blend * 100).toFixed(2);
        growthRateValue.textContent = (r_blend * 100).toFixed(2);
    }
    
    return r_blend;
}

// Initialize sleeve return range inputs
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for all sleeve return inputs
    const sleeveReturnInputs = [
        { id: 'epigReturn', displayId: 'epigReturnValue' },
        { id: 'ecfsReturn', displayId: 'ecfsReturnValue' },
        { id: 'tsyReturn', displayId: 'tsyReturnValue' },
        { id: 'cashReturn', displayId: 'cashReturnValue' },
        { id: 'blueReturn', displayId: 'blueReturnValue' }
    ];
    
    sleeveReturnInputs.forEach(sleeve => {
        const input = document.getElementById(sleeve.id);
        const display = document.getElementById(sleeve.displayId);
        
        if (input && display) {
            input.addEventListener('input', function() {
                display.textContent = this.value;
                calculateBlendedReturn();
            });
        }
    });
    
    // Initial calculation
    calculateBlendedReturn();
    
    // Draw allocation pie chart
    drawAllocationPieChart();
});

function drawAllocationPieChart() {
    const canvas = document.getElementById('allocationPieChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = 400;
    const height = 400;
    
    canvas.width = width;
    canvas.height = height;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    
    // Data
    const sleeveData = [
        { label: 'EPIG', value: 45, color: '#f5a623' },
        { label: 'ECFS', value: 20, color: '#10b981' },
        { label: 'Treasuries', value: 15, color: '#3b82f6' },
        { label: 'Cash', value: 10, color: '#a8b2c1' },
        { label: 'Blue Chip', value: 10, color: '#8b5cf6' }
    ];
    
    let currentAngle = -Math.PI / 2; // Start at top
    
    sleeveData.forEach(sleeve => {
        const sliceAngle = (sleeve.value / 100) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = sleeve.color;
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#1a2332';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sleeve.value + '%', labelX, labelY);
        
        currentAngle += sliceAngle;
    });
    
    // Draw legend
    let legendY = 20;
    sleeveData.forEach(sleeve => {
        // Color box
        ctx.fillStyle = sleeve.color;
        ctx.fillRect(10, legendY, 20, 15);
        
        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter';
        ctx.textAlign = 'left';
        ctx.fillText(sleeve.label, 35, legendY + 10);
        
        legendY += 25;
    });
}

// ===================================
// DIVERSIFICATION MODAL
// ===================================

function openDiversificationModal() {
    const modal = document.getElementById('diversificationModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeDiversificationModal() {
    const modal = document.getElementById('diversificationModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal on outside click
window.addEventListener('click', function(e) {
    const divModal = document.getElementById('diversificationModal');
    if (e.target === divModal) {
        closeDiversificationModal();
    }
});

// ===================================
// EXPOSE GLOBAL FUNCTIONS
// ===================================

window.scrollToSection = scrollToSection;
window.openRiskDisclosure = openRiskDisclosure;
window.closeRiskDisclosure = closeRiskDisclosure;
window.openDiversificationModal = openDiversificationModal;
window.closeDiversificationModal = closeDiversificationModal;
window.toggleSleeveMode = toggleSleeveMode;
window.updateWeights = updateWeights;
window.calculateBlendedReturn = calculateBlendedReturn;
window.checkIRC817Compliance = checkIRC817Compliance;

// ===================================
// ECFS/EPIG MODALS (NEW)
// ===================================

function openECFSModal() {
    const modal = document.getElementById('ecfsModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeECFSModal() {
    const modal = document.getElementById('ecfsModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function openEPIGModal() {
    const modal = document.getElementById('epigModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeEPIGModal() {
    const modal = document.getElementById('epigModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modals on outside click
window.addEventListener('click', function(e) {
    const ecfsModal = document.getElementById('ecfsModal');
    const epigModal = document.getElementById('epigModal');
    
    if (e.target === ecfsModal) {
        closeECFSModal();
    }
    if (e.target === epigModal) {
        closeEPIGModal();
    }
});

// Expose ECFS/EPIG modal functions globally
window.openECFSModal = openECFSModal;
window.closeECFSModal = closeECFSModal;
window.openEPIGModal = openEPIGModal;
window.closeEPIGModal = closeEPIGModal;

// ===================================
// FOUNDING CHARTER MODAL (NEW)
// ===================================

function openFoundingCharterModal() {
    const modal = document.getElementById('foundingCharterModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeFoundingCharterModal() {
    const modal = document.getElementById('foundingCharterModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal on outside click
window.addEventListener('click', function(e) {
    const charterModal = document.getElementById('foundingCharterModal');
    if (e.target === charterModal) {
        closeFoundingCharterModal();
    }
});

// Expose Founding Charter modal functions globally
window.openFoundingCharterModal = openFoundingCharterModal;
window.closeFoundingCharterModal = closeFoundingCharterModal;

// ===================================
// CALCULATOR COLLAPSIBLE SECTIONS (NEW)
// ===================================

function initializeCalcSectionCollapse() {
    const headers = document.querySelectorAll('.calc-section-header');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const section = this.parentElement;
            section.classList.toggle('collapsed');
        });
    });
}

function toggleCalcSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('collapsed');
    }
}

// Expose globally
window.toggleCalcSection = toggleCalcSection;

// ===================================
// PLATFORM MINIMUMS CHECK
// ===================================

function checkPlatformMinimums() {
    // Get current scenario values
    const annualPremium = 1000000; // Default from premium schedule
    const years = 5;
    const totalPremium = annualPremium * years;
    
    // Get selected platform minimums
    const firstYearMinSelect = document.getElementById('platformFirstYearMin');
    const totalMinSelect = document.getElementById('platformTotalMin');
    
    if (!firstYearMinSelect || !totalMinSelect) return;
    
    const firstYearMin = parseInt(firstYearMinSelect.value);
    const totalMin = parseInt(totalMinSelect.value);
    
    const statusDiv = document.getElementById('platformMinimumStatus');
    if (!statusDiv) return;
    
    // Check both criteria
    const meetsFirstYear = annualPremium >= firstYearMin;
    const meetsTotal = totalPremium >= totalMin;
    const meetsAll = meetsFirstYear && meetsTotal;
    
    // Display status
    statusDiv.style.display = 'block';
    
    if (meetsAll) {
        statusDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-check-circle" style="color: var(--green-success); font-size: 1.5rem;"></i>
                <div>
                    <strong style="color: var(--green-success);">✅ Meets Selected Minimums</strong>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">
                        Your scenario ($${(annualPremium/1000000).toFixed(1)}M/year, $${(totalPremium/1000000).toFixed(1)}M total) meets the selected platform requirements.
                    </p>
                </div>
            </div>
        `;
        statusDiv.style.background = 'rgba(16, 185, 129, 0.1)';
        statusDiv.style.border = '1px solid var(--green-success)';
    } else {
        statusDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-exclamation-triangle" style="color: #f59e0b; font-size: 1.5rem;"></i>
                <div>
                    <strong style="color: #f59e0b;">⚠️ May Not Meet Selected Minimums</strong>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">
                        ${!meetsFirstYear ? `• First-year premium ($${(annualPremium/1000000).toFixed(1)}M) below selected minimum ($${(firstYearMin/1000000).toFixed(1)}M)<br>` : ''}
                        ${!meetsTotal ? `• Total premium ($${(totalPremium/1000000).toFixed(1)}M) below selected minimum ($${(totalMin/1000000).toFixed(1)}M)<br>` : ''}
                        Confirm carrier/platform acceptance with advisor.
                    </p>
                </div>
            </div>
        `;
        statusDiv.style.background = 'rgba(245, 158, 11, 0.1)';
        statusDiv.style.border = '1px solid #f59e0b';
    }
}

// Initialize platform minimums listeners
document.addEventListener('DOMContentLoaded', function() {
    const firstYearMinSelect = document.getElementById('platformFirstYearMin');
    const totalMinSelect = document.getElementById('platformTotalMin');
    
    if (firstYearMinSelect) {
        firstYearMinSelect.addEventListener('change', checkPlatformMinimums);
    }
    
    if (totalMinSelect) {
        totalMinSelect.addEventListener('change', checkPlatformMinimums);
    }
    
    // Initial check
    checkPlatformMinimums();
});

window.checkPlatformMinimums = checkPlatformMinimums;