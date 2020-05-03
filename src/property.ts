import { RecurrentPropertyExpenses } from "./property-purchase";

/**
 * Represents a property of a `Person`.
 */
export interface Property {

    /**
     * The amount paid when the `Property` was purchased.
     */
    purchasePrice: number;

    /**
     * The current price of the `Property`.
     */
    currentWorth: number;

    /**
     * The recurrent expenses related to this `Property`.
     */
    recurrentExpenses: RecurrentPropertyExpenses

    /**
     * Potential monthly rent (without utilities) if the `Property` is rented out.
     */
    rent: number;

    state: 'usedAsPrincipalResidence' | 'rented' | 'empty';

    /**
     * The annual growth rate of the `Property` worth, expressed as a decimal fraction (value between 0 and 1).
     */
    growthRate: number;
}