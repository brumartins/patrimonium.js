/**
 * Represents the sale of a property.
 */
export interface PropertySale {

    /**
     * The index of a `Person` property to sale. If not provided the first property is sold.
     */
    propertyIdx?: number;
}