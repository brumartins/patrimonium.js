import { PersonAction } from './person-action';
import { SimpleDate } from '../simple-date';
import { PersonSituation } from '../person-situation';

export class RentOutPropertyAction implements PersonAction {

    constructor(public date: SimpleDate, private propertyIdx: number = 0) {
    }

    execute(situation: PersonSituation): void {
        if (situation.properties.length <= this.propertyIdx) {
            throw new Error(`Property not found with index '${this.propertyIdx}.'`);
        }

        if (!situation.properties[this.propertyIdx].rent) {
            throw new Error(`Unable to rent out property with index '${this.propertyIdx}': the rent of the property has not been defined.`);
        }

        situation.properties[this.propertyIdx].state = 'rented';
    }
}