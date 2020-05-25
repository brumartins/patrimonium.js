import { Person, PropertyPurchase, EnvironmentOptions, Reporting } from '../src/index';
import { expect, use } from 'chai';
import customAssertions from './helpers/chai-assertions';
import { sixMonthsLater, twoYearsLater, threeYearsLater, oneYearLater } from './helpers/date-helper';
import { buildReporting } from './helpers/reporting-helper';

use(customAssertions);

describe(`Balance sheet`, () => {

    it('net worth is computed properly', () => {
        // Arrange
        const person = new Person();
        const purchase: PropertyPurchase = {
            price: 200000,
            notaryFees: 14000,
            recurrentExpenses: {
                propertyTax: 1000,
                residenceTax: 800,
                maintenanceFees: 0
            }
        };

        // Act
        person.buyProperty(sixMonthsLater, purchase);
        person.moveIn(sixMonthsLater);
        person.sellProperty(twoYearsLater);
        const history = person.getHistory(threeYearsLater);
        const expectedNetWorth = -purchase.notaryFees - (purchase.recurrentExpenses!.propertyTax + purchase.recurrentExpenses!.residenceTax) * 1.5;

        // Assert
        expect(history.toArray()[32].balanceSheet.netWorth).closeTo(expectedNetWorth, 1);
    });

    it('does not change if the person has no income, performs no action and does not invest money', function() {
        // Arrange
        const expectedAtStart: Reporting = buildReporting({ currentAccount: 100 });
        
        const person = new Person({
            currentAccount: 100,
        });

        // Act
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history.toArray()[12]).eqlReporting(expectedAtStart);
    }); 

    it('current account gets increased if the person investment rate of return is not null', function() {
        // Arrange
        const initialCurrentAccount = 10000;
        const investmentRoR = 2;
        const environmentOptions: EnvironmentOptions = {
            investmentRateOfReturn: investmentRoR
        };
        const person = new Person({
            currentAccount: initialCurrentAccount,
            environment: environmentOptions
        });
        const expectedOneYearLater: Reporting = buildReporting({ currentAccount: initialCurrentAccount * (1 + investmentRoR / 100) });
        expectedOneYearLater.plStatement.income.investementReturn = initialCurrentAccount * (investmentRoR / 100) / 12;

        // Act
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history.getReporting(oneYearLater)).eqlReporting(expectedOneYearLater);
    });

    it('current account gets decreased if the person has monthly expenses', function() {
        // Arrange
        const initialCurrentAccount = 10000;
        const monthlyExpenseAmount = 500;
        const person = new Person({
            currentAccount: initialCurrentAccount,
            expenses: () => monthlyExpenseAmount
        });
        const expectedOneYearLater: Reporting = buildReporting({ currentAccount: initialCurrentAccount - (12 * monthlyExpenseAmount) });
        expectedOneYearLater.plStatement.expenses.other = monthlyExpenseAmount;

        // Act
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history.getReporting(oneYearLater)).eqlReporting(expectedOneYearLater);
    });

});