import { Person, GrossSalary } from '../src/index';
import { expect, use } from 'chai';
import customAssertions from './helpers/chai-assertions';
import { sixMonthsLater } from './helpers/date-helper';
import { buildReporting } from './helpers/reporting-helper';

use(customAssertions);

describe(`Salary`, () => {

    it('is earned each month', () => {
        // Arrange
        const grossAnnualSalary = 45000;
        const person = new Person({
            employments: [{ salary: () => grossAnnualSalary }]
        });
        const expectedSixMonthsLater = buildReporting({ currentAccount: grossAnnualSalary * 6 / 12 });
        expectedSixMonthsLater.plStatement.income.salaries = [grossAnnualSalary / 12];

        // Act
        let history = person.getHistory(sixMonthsLater);
        history = person.getHistory(sixMonthsLater);

        // Assert
        expect(history[6]).eqlReporting(expectedSixMonthsLater);
    });

    it('makes you pay the income tax', () => {
        // Arrange
        const grossAnnualSalary = 45000;
        const taxRate = 0.15;
        const incomeTax = (salaries: GrossSalary[]) => salaries.reduce((totalTax, salary) => totalTax + salary.amount * (1 - taxRate), 0);
        const person = new Person({
            employments: [{ salary: () => grossAnnualSalary }],
            environment: {
                investmentRateOfReturn: 0,
                netIncomeCalculation: incomeTax
            }
        });
        const netAnnualSalary = incomeTax([{ amount: grossAnnualSalary }]);
        const expectedSixMonthsLater = buildReporting({ currentAccount: netAnnualSalary * 6 / 12 });
        expectedSixMonthsLater.plStatement.income.salaries = [grossAnnualSalary / 12];
        expectedSixMonthsLater.plStatement.expenses.tax = grossAnnualSalary * taxRate / 12;

        // Act
        let history = person.getHistory(sixMonthsLater);
        history = person.getHistory(sixMonthsLater);

        // Assert
        expect(history[6]).eqlReporting(expectedSixMonthsLater);
    });

});