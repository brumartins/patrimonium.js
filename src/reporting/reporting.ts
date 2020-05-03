import { BalanceSheet, PLStatement } from '..';

/**
 * Represents a monthly financial reporting of a `Person`.
 */
export interface Reporting {

    /**
     * The balance sheet of the `Person`.
     */
    balanceSheet: BalanceSheet;

    /**
     * The month-over-month profit and loss (P&L) statement of the `Person.`
     */
    plStatement: PLStatement;
}