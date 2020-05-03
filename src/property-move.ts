/**
 * Represents the act of moving in a property.
 */
export interface PropertyMove {

    /**
     * The index of a `Person` property to move in. If not provided, the `Person` moves in his first property.
     */
    propertyIdx?: number;
}