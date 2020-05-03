/**
 * Represents a month-over-month profit and loss (P&L) statement of a `Person`.
 */
export interface PLStatement {

    /**
     * The income of the P&L statement.
     */
    income: Income;

    /**
     * The expenses of the P&L statement.
     */
    expenses: Expenses;

    /**
     * The net profit of the `Person`.
     */
    netProfit: number;
}

/**
 * The income of a P&L statement.
 */
export interface Income {
    /**
     * Annual gross salaries of a `Person`.
     */
    salaries: number[];

    /**
     * The amount earned through investments (excluding real estate).
     */
    investementReturn: number;

    /**
     * Gross rental income (each item of the array representing a `Person` property).
     */
    rentalIncome: number[];
}

/**
 * The expenses of a P&L statement.
 */
export interface Expenses {

    /**
     * Real estate expenses.
     */
    realEstate: RealEstateExpenses;

    /**
     * Amount spent for renting a property.
     */
    rent: number;

    /**
     * Income tax.
     */
    tax: number;

    /**
     * Amount spent to repay loan(s) (each item of the array representing a loan).
     */
    loans: number[];

    /**
     * Other expenses of a `Person`, excluding taxes and housing.
     */
    other: number;
}

/**
 * The real estate expenses of a P&L statement.
 */
export interface RealEstateExpenses {

    /**
     * The tax amount related to residence or property.
     */
    tax: number;

    /**
     * The fee amount related to maintenance.
     */
    fees: number;
}