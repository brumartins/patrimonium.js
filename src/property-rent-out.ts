/**
 * Represents the act of renting out a property.
 */
export interface PropertyRentOut {

    /**
     * The index of a `Person` property to rent out. If not provided the first property is rented out.
     */
    propertyIdx?: number;
}