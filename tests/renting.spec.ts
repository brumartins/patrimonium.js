import { Person, Rental } from '../src/index';
import { expect, use } from 'chai';
import customAssertions from './helpers/chai-assertions';
import { atStart, oneYearLater, sixMonthsLater } from './helpers/date-helper';
import { buildReporting } from './helpers/reporting-helper';

use(customAssertions);

describe(`Renting a property`, () => {

    it('make you spend money', () => {
        const person = new Person();
        const rental: Rental = {
            price: 800,
            residenceTax: 650
        };

        person.rentProperty(atStart, rental);

        const history = person.getHistory(oneYearLater);
        const expectedOneYearLater = buildReporting();
        expectedOneYearLater.balanceSheet.assets.currentAccount = -(rental.price * 12 + rental.residenceTax);
        expectedOneYearLater.plStatement.expenses.rent = rental.price;
        expectedOneYearLater.plStatement.expenses.realEstate.tax = rental.residenceTax / 12;

        expect(history.toArray()[12]).eqlReporting(expectedOneYearLater);
    });

    it('is less expensive when you leave it in the meanwhile', () => {
        const person = new Person();
        const rental: Rental = {
            price: 800,
            residenceTax: 650
        };

        person.rentProperty(atStart, rental);
        person.leaveRentalProperty(sixMonthsLater);

        const history = person.getHistory(oneYearLater);
        const expectedOneYearLater = buildReporting();
        expectedOneYearLater.balanceSheet.assets.currentAccount = - (rental.price * 12 + rental.residenceTax) / 2;

        expect(history.toArray()[12]).eqlReporting(expectedOneYearLater);
    });

});