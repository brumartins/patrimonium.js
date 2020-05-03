import { PersonAction } from './person-action';
import { SimpleDate } from '../simple-date';
import { PersonSituation } from '../person-situation';

export class LeaveRentalPropertyAction implements PersonAction {

    constructor(public date: SimpleDate) {
        this.date = date;
    }

    execute(situation: PersonSituation): void {
        situation.rental = null;
    }
}