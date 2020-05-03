import { PersonInitialSituation } from "../..";

/**
 * Represents the initial situation of a `Frenchman`.
 */
export interface FrenchmanInitialSituation extends PersonInitialSituation {

    /**
     * The part count of the 'quotient familial' of the taxable household.
     * If not provided, the default value (= 1) is set.
     */
    quotientFamilialPartCount?: number;
}