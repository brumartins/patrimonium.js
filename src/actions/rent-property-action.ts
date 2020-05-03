import { PersonAction } from './person-action';
import { SimpleDate } from '../simple-date';
import { PersonSituation } from '../person-situation';
import { Rental } from '../rental';

export class RentPropertyAction implements PersonAction {

    constructor(public date: SimpleDate, public rental: Rental) {
        this.date = date;
    }

    execute(situation: PersonSituation): void {
        situation.rental = _cloneRental(this.rental);
    }
}

function _cloneRental(rental: Rental): Rental {
    return {
        price: rental.price ?? 0,
        residenceTax: rental.residenceTax ?? 0
    };
}