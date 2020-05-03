/**
 * Represents the balance sheet of a person.
 */
export interface BalanceSheet {

    /**
     * The assets.
     */
    assets: Assets;

    /**
     * The liabilities.
     */
    liabilities: Liabilities;

    /**
     * The net worth on the balance sheet (computed).
     */
    netWorth: number;
}

/**
 * Represents the asset section on a balance sheet.
 */
export interface Assets {

    /**
     * The values of each owned property.
     */
    properties: number[];

    /**
     * The total amount available on the current account.
     */
    currentAccount: number;
}

/**
 * Represents the liability section on a balance sheet.
 */
export interface Liabilities {

    /**
     * The amount still to be repaid for one or multiple loans.
     */
    loan: number;
}