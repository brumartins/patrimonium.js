import { Frenchman, FrenchEmploymentStatus } from '../../src/countries/france';
import { expect, use } from 'chai';
import customAssertions from '../helpers/chai-assertions';
import { buildReporting } from '../helpers/reporting-helper';
import { oneYearLater } from '../helpers/date-helper';

use(customAssertions);

describe(`French plugin`, () => {
    it('a Frenchman earn a salary and pays taxes', () => {
        // Arrange
        const employmentStatus: FrenchEmploymentStatus = 'cadre';
        const person = new Frenchman({
            employments: [{ salary: () => 36000, status: employmentStatus }]
        });
        const expectedOneYearLater = buildReporting({ currentAccount: 25007 });
        expectedOneYearLater.plStatement.income.salaries = [36000 / 12];
        expectedOneYearLater.plStatement.expenses.tax = (36000 - 25007) / 12;

        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        expect(history.toArray()[12]).eqlReporting(expectedOneYearLater);
    });
});