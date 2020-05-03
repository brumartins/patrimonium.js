import { PersonAction } from './person-action';
import { Loan, LoanOptions } from "../loan";
import { SimpleDate } from '../simple-date';
import { PersonSituation } from '../person-situation';

export class SignLoanAction implements PersonAction {
    constructor(public date: SimpleDate, public options: LoanOptions) {
        this.date = date;
    }

    execute(situation: PersonSituation): void {
        const loan = new Loan(this.options);
        situation.currentAccount += (loan.amount -loan.bankingFees);
        situation.loans.push(loan);
    }
}