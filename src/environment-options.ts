import { Property, GrossSalary } from ".";

/**
 * Represents the environment of a `Person`. It covers a broad range of data, including economics, fiscality and real estate.
 */
export interface EnvironmentOptions {
    
    /**
     * The annual rate of return (as a percentage) of the amount stored in the current account.
     * The rate of return is intended as net of tax.
     */
    investmentRateOfReturn?: number;

    /**
     * A pure function that represents the calculation of the net income based on salaries and rental incomes of a `Person`.
     * @param salaries The salary or salaries of a `Person`.
     * @param properties The properties of a `Person`. The rental properties are taken into account for income tax calculation.
     * @returns The resulting net income of the `Person`.
     */
    netIncomeCalculation?: (salaries: GrossSalary[], properties: Property[]) => number;
}