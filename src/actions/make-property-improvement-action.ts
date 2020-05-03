import { PersonAction } from './person-action';
import { SimpleDate } from '../simple-date';
import { PersonSituation } from '../person-situation';

export class MakePropertyImprovementAction implements PersonAction {
    constructor(public date: SimpleDate, private cost: number, private addedValue: number, private propertyIdx: number = 0) {
        this.date = date;
    }

    execute(situation: PersonSituation): void {

        if (situation.properties.length <= this.propertyIdx) {
            throw new Error(`Invalid operation: no property with index '${this.propertyIdx}'`);
        }

        situation.properties[this.propertyIdx].currentWorth += this.addedValue;
        situation.currentAccount -= this.cost;
    }
}