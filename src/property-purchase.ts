/**
 * Represents the purchase of a property.
 */
export interface PropertyPurchase {

    /**
     * Purchase price.
     */
    price: number;

    /**
     * Notary fees.
     */
    notaryFees: number;

    /**
     * Recurrent expenses to come for the property.
     */
    recurrentExpenses?: RecurrentPropertyExpenses;

    /**
     * Potential monthly rent (without utilities) if the property is rented out.
     */
    rent?: number;

    /**
     * The annual growth rate of the property value, expressed as a decimal fraction (value between 0 and 1).
     */
    growthRate?: number;
}

/**
 * Represents recurrent expenses of the property.
 */
export interface RecurrentPropertyExpenses {
    /**
     * Annual amount of property tax.
     */
    propertyTax: number;

    /**
     * Annual amount of residence tax.
     */
    residenceTax: number;

    /**
     * Annual amount dedicated to maintenance.
     */
    maintenanceFees: number;
}