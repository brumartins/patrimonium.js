import { PersonAction } from './person-action';
import { SimpleDate } from '../simple-date';
import { PersonSituation } from '../person-situation';

export class SellPropertyAction implements PersonAction {

    constructor(public date: SimpleDate, public propertyIdx: number = 0) {
        this.date = date;
    }

    execute(situation: PersonSituation): void {
        if (situation.properties.length <= this.propertyIdx) {
            throw new Error(`Property not found with index '${this.propertyIdx}.'`);
        }

        const salePrice = situation.properties[this.propertyIdx].currentWorth;
        situation.currentAccount += salePrice;

        situation.properties.splice(this.propertyIdx, 1);
    }
}