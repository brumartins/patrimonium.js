/**
 * Represents the act of improving a property (ie, increasing its value by some work).
 */
export interface PropertyImprovement {

    /**
     * The cost of the improvement.
     */
    cost: number,

    /**
     * The added value of the improvement (ie, how much the property worth is increasing after the improvement).
     */
    addedValue: number,

    /**
     * The index of a `Person` property to improve. If not provided, the first property is improved.
     */
    propertyIdx?: number
}