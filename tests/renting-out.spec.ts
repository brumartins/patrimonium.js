import { Person, Property, GrossSalary } from '../src/index';
import { expect, use } from 'chai';
import customAssertions from './helpers/chai-assertions';
import { atStart, sixMonthsLater } from './helpers/date-helper';
import { buildReporting } from './helpers/reporting-helper';

use(customAssertions);

const buildProperty = (): Property => {
    return {
        currentWorth: 200000,
        purchasePrice: 200000,
        recurrentExpenses: {
            residenceTax: 0,
            propertyTax: 0,
            maintenanceFees: 0
        },
        state: 'empty',
        rent: 500,
        growthRate: 0
    };
};

const incomeTax = (salaries: GrossSalary[], properties: Property[]): number => {
    const annualRentalIncome = 12 * properties.filter(p => p.state === 'rented').reduce((acc, curr) => acc + curr.rent, 0);
    const annualGrossSalary = salaries.reduce((totalSalary, salary) => totalSalary + salary.amount, 0);
    const annualIncome = annualGrossSalary + annualRentalIncome ;

    if (annualIncome < 10064) {
        return annualIncome;
    } else if (annualIncome < 27794) {
        return annualIncome * (1 - 0.14) + 1408.96;
    } else {
        return annualIncome * (1 - 0.30) + 5856;
    }
};

describe(`Renting out a property`, () => {

    it('makes you earn money', () => {
        // Arrange
        const property = buildProperty();
        const person = new Person({
            properties: [property]
        });
        const expectedSixMonthsLater = buildReporting({
            currentAccount: property.rent * 6,
            properties: [property.currentWorth]
        });
        expectedSixMonthsLater.plStatement.income.rentalIncome = [property.rent];
        expectedSixMonthsLater.plStatement.expenses.realEstate.fees = property.recurrentExpenses.maintenanceFees;

        // Act
        person.rentOutProperty(atStart);
        let history = person.getHistory(sixMonthsLater);
        history = person.getHistory(sixMonthsLater);

        // Assert
        expect(history.toArray()[6]).eqlReporting(expectedSixMonthsLater);
    });

    it('makes you earn money but you pay taxes as well', () => {
        // Arrange
        const property = buildProperty();
        const person = new Person({
            properties: [property],
            employments: [{ salary: () => 12000 }],
            environment: {
                investmentRateOfReturn: 0,
                netIncomeCalculation: incomeTax
            }
        });
        const incomeTaxForSixMonths = 555.52;
        const expectedCurrentAccountSixMonthsLater = (12000 / 12 + property.rent) * 6 - incomeTaxForSixMonths;
        const expectedSixMonthsLater = buildReporting({
            currentAccount: expectedCurrentAccountSixMonthsLater,
            properties: [property.currentWorth]
        });
        expectedSixMonthsLater.plStatement.income.salaries = [12000 / 12];
        expectedSixMonthsLater.plStatement.income.rentalIncome = [property.rent];
        expectedSixMonthsLater.plStatement.expenses.tax = incomeTaxForSixMonths / 6;
        expectedSixMonthsLater.plStatement.expenses.realEstate.fees = property.recurrentExpenses.maintenanceFees;

        // Act
        person.rentOutProperty(atStart);
        let history = person.getHistory(sixMonthsLater);
        history = person.getHistory(sixMonthsLater);

        // Assert
        expect(history.toArray()[6]).eqlReporting(expectedSixMonthsLater);
    });

});