import { Reporting } from ".";
import { SimpleDate } from "..";

/**
 * Represents the financial reporting history of a `Person`.
 */
export class History {
    private readonly _reporting: Reporting[];

    /**
     * Returns a new instance of `History`.
     * @param reporting The reporting history of a `Person` as an array where the index is
     * the nth month since start and the element is the corresponding set of reports at that time.
     */
    constructor(reporting: Reporting[]) {
        this._reporting = reporting;
    }

    /**
     * Returns the month-over-month financial reports for the specified date.
     * @param date A `SimpleDate` instance.
     */
    getReporting(date: SimpleDate) {
        return this._reporting[date.getMonths()];
    }

    /**
     * Returns the financial reporting history of the person as an array.
     * Each index of the array is the nth month since start.
     */
    toArray(): Reporting[] {
        return this._reporting;
    }
}