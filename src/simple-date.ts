/**
 * Represents the options to create a date in a simple format, only counting
 * the number of elapsed months since a given origin.
 */
export interface SimpleDateOptions {

    /**
     * The number of elapsed months since a given origin ('0' being used as the origin).
     */
    nthMonth: number;
}

/**
 * Represents a date in a simple format, only counting
 * the number of elapsed months since a given origin.
 */
export class SimpleDate {
    private options: SimpleDateOptions;

    /**
     * Returns an instance of `SimpleDate`.
     * @param options The options of the `SimpleDate` to create.
     */
    constructor(options?: SimpleDateOptions) {
        this.options = {
            nthMonth: options?.nthMonth ?? 0
        };
    }

    /**
     * Returns the number of elapsed months since the origin.
     */
    getMonths(): number {
        return this.options.nthMonth;
    }

    /**
     * Returns a new `SimpleDate` that adds the specified number of months
     * to the value of this instance.
     * @param months A number of months. The `months` parameter can be negative or positive.
     */
    addMonths(months: number): SimpleDate {
        let date = new SimpleDate(this.options);
        date.options.nthMonth += months;
        return date;
    }

    /**
     * Returns an array of `n` `SimpleDate` instances (`n` being equal to the `nthMonth` of this instance)
     * where each `SimpleDate` instance has a `nthMonth` with a value starting from 0 to the `nthMonth - 1` of this instance.
     * 
     * @example
     * new SimpleDate({ nthMonth: 2 }).getDatesFromOrigin()
     * // >> returns [new SimpleDate({ nthMonth: 0 }), new SimpleDate({ nthMonth: 1 })]
     */
    getDatesFromOrigin(): SimpleDate[] {
        const dates: SimpleDate[] = [];
        let date = new SimpleDate({ nthMonth: 0 });

        while (date.getMonths() < this.getMonths()) {
            dates.push(date);
            date = date.addMonths(1);
        }

        return dates;
    }
}