import { SimpleDate } from '../simple-date';
import { PersonSituation } from "../person-situation";
import { PLStatement } from '../reporting/pl-statement';

/**
 * Represents an action that has an impact on the balance sheet of a person (saving money, buying a house etc.).
 */
export interface PersonAction {
    readonly date: SimpleDate;

    /**
     * Executes the action and updates the `PersonSituation` accordingly.
     */
    execute(situation: PersonSituation, plStatement: PLStatement): void;
}
