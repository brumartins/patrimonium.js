/**
 * Represents a `Person` employment.
 */
export interface Employment {
    /**
     * Gross annual salary of the `Person` over the years.
     * @param nthYear The nth year of reference (starting from 0).
     * @returns The gross annual salary of the `Person` in the `nthYear`.
     * @example
     * salary: (_ => 20000) // Same salary over the years (20000)
     * salary: (n => 20000 * Math.pow(1.02, n)) // 2% salary increase per year (starting from 20000)
     */
    salary: (nthYear: number) => number;

    /**
     * The employment status.
     */
    status?: string;
}

/**
 * Represents a gross salary.
 */
export interface GrossSalary {
    /**
     * The monthly amount of the salary.
     */
    amount: number;

    /**
     * The related employment status.
     */
    status?: string;
}