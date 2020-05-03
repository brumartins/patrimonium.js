/**
 * Represents the options of the `Loan`.
 */
export interface LoanOptions {
    /**
     * Borrowed amount.
     */
    amount: number;

    /**
     * Loan period in months.
     */
    period: number;

    /**
     * Interest rate of the loan (in percentage of the loan amount).
     */
    interestRate: number;

    /**
     * Rate of the loan insurance (in percentage of the loan amount).
     */
    insuranceRate: number;

    /**
     * Amount of the banking fees when signing the loan.
     */
    bankingFees?: number;


    elapsedMonths?: number;
}

/**
 * Represents a loan.
 */
export class Loan {
    /**
     * Number of months elapsed since the beginning of the loan.
     */
    elapsedMonths: number;

    /**
     * Amount borrowed.
     */
    readonly amount: number;

    /**
     * Loan period in months.
     */
    readonly period: number;

    /**
     * Interest rate of the loan (in percentage of the loan amount).
     */
    readonly interestRate: number;

    /**
     * Rate of the loan insurance (in percentage of the loan amount).
     */
    readonly insuranceRate: number;

    /**
     * Amount of the banking fees when signing the loan.
     */
    readonly bankingFees: number;

    /**
     * Constructs a `Loan` based on the specified options.
     * @param options The options of the `Loan`.
     */
    constructor(options: LoanOptions) {
        this.amount = options.amount;
        this.period = options.period;
        this.interestRate = options.interestRate;
        this.insuranceRate = options.insuranceRate;
        this.bankingFees = options.bankingFees ?? 0;
        this.elapsedMonths = options.elapsedMonths ?? 0;
    }

    /**
     * Returns the monthly payment of the loan.
     * @returns The monthly payment of the loan.
     */
    get monthlyPayment(): number {
        let amount = this.amount;
        let rate = _getMonthlyRate(this);
        let period = this.period;
        return (amount * rate * Math.pow(1 + rate, period)) / (Math.pow(1 + rate, period) - 1);
    }

    /**
     * Returns the amount of the loan that still needs to be repaid.
     */
    getAmountStillToBeRepaid() {
        return this.amount - _getAmountAlreadyRepaid(this);
    }
}

/**
 * Returns the monthly rate of the loan (including both interests and insurance).
 * @param loan A loan.
 */
function _getMonthlyRate(loan: Loan): number {
    let annualRate = (loan.interestRate + loan.insuranceRate) / 100;
    return Math.pow(1 + annualRate, 1/12) - 1;
}

/**
 * Returns the amount of the loan that is already repaid.
 * @param loan A loan.
 */
function _getAmountAlreadyRepaid(loan: Loan) {
    let period = loan.period;
    let rate = (loan.interestRate + loan.insuranceRate) / 100;
    let loanTotalAmount = loan.amount;
    let repaidAmount = 0;
    const elapsedMonths = loan.elapsedMonths ?? 0;

    for (let i = 0; i < elapsedMonths; i++) {
        repaidAmount += loanTotalAmount * rate * Math.pow(1 + rate / 12, i) / (12 * (Math.pow(1 + rate / 12, period) - 1));
    }

    return repaidAmount;
}