import { EnvironmentOptions, Rental, Property, Loan, Employment, SimpleDate } from ".";

/**
 * Represents the situation of a `Person`. `PersonInitialSituation` is only used to initialize a `Person`.
 */
export interface PersonSituation {

    /**
     * Total amount available on the current account of the `Person.`
     */
    currentAccount: number;

    /**
     * Properties owned by the `Person`.
     */
    properties: Property[];

    /**
     * Loans belonging to the `Person`.
     */
    loans: Loan[];

    /**
     * The environment of a `Person`. It covers a broad range of data, including economics, fiscality and real estate.
     */
    environment: EnvironmentOptions;

    /**
     * Current rental if any.
     */
    rental: Rental | null;

    /**
     * Employments of the `Person`.
     */
    employments: Employment[];

    /**
     * Monthly expenses of the `Person` over time, excluding taxes and housing.
     * @param date A month of reference.
     * @returns The expense amount of the specified month.
     * @example
     * expenses: () => 1000 // Same expense amount every month (1000)
     * expenses: date => 1000 * Math.pow(1.01, date.getMonths()) // 1% amount increase per month (starting from 1000)
     */
    expenses: (date: SimpleDate) => number;
}