/**
 * Represents a rental of a property.
 */
export interface Rental {
    /**
     * Amount to be paid each month to the landlord.
     */
    price: number;

    /**
     * Annual amount of the residence tax.
     */
    residenceTax: number;
}