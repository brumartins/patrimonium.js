import { Person, EnvironmentOptions, PropertyPurchase, Property } from '../src/index';
import { expect, use } from 'chai';
import customAssertions from './helpers/chai-assertions';
import { atStart, oneYearLater, sixMonthsLater } from './helpers/date-helper';
import { buildReporting } from './helpers/reporting-helper';

use(customAssertions);

describe(`Buying a property`, () => {

    it('makes you spend cash but increases your assets', () => {
        const person = new Person();
        const purchase: PropertyPurchase = {
            price: 200000,
            notaryFees: 14000,
            recurrentExpenses: {
                propertyTax: 0,
                residenceTax: 1000,
                maintenanceFees: 0
            }
        };

        person.buyProperty(atStart, purchase);

        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);
        const expectedOneYearLater = buildReporting();
        expectedOneYearLater.balanceSheet.assets.currentAccount = -(purchase.price + purchase.notaryFees);
        expectedOneYearLater.balanceSheet.assets.properties = [purchase.price];
        expectedOneYearLater.plStatement.expenses.realEstate.fees = purchase.recurrentExpenses!.maintenanceFees / 12;

        expect(history.toArray()[12]).eqlReporting(expectedOneYearLater);
    });

    it('increases your assets in a continuous way if the real estate market is growing', () => {
        // Arrange
        const environmentOptions: EnvironmentOptions = {
            investmentRateOfReturn: 0
        };
        const person = new Person({
            environment: environmentOptions
        });
        const purchase: PropertyPurchase = {
            price: 200000,
            notaryFees: 14000,
            recurrentExpenses: {
                propertyTax: 0,
                residenceTax: 1000,
                maintenanceFees: 0
            },
            growthRate: 0.01
        };
        const expectedOneYearLater = buildReporting();
        expectedOneYearLater.balanceSheet.assets.currentAccount = -(purchase.price + purchase.notaryFees);
        expectedOneYearLater.balanceSheet.assets.properties = [purchase.price * (1 + 0.01)];
        expectedOneYearLater.plStatement.expenses.realEstate.fees = purchase.recurrentExpenses!.maintenanceFees / 12;

        // Act
        person.buyProperty(atStart, purchase);
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history.toArray()[12]).eqlReporting(expectedOneYearLater);
    });

    it('makes you pay taxes and fees', () => {
        // Arrange
        const person = new Person();
        const purchase: PropertyPurchase = {
            price: 200000,
            notaryFees: 14000,
            recurrentExpenses: {
                propertyTax: 1000,
                residenceTax: 800,
                maintenanceFees: 500
            }
        };
        const expectedSixMonthsLater = buildReporting();
        expectedSixMonthsLater.balanceSheet.assets.currentAccount = -(purchase.price + purchase.notaryFees + (purchase.recurrentExpenses!.propertyTax + purchase.recurrentExpenses!.maintenanceFees) / 2);
        expectedSixMonthsLater.balanceSheet.assets.properties = [purchase.price];
        expectedSixMonthsLater.plStatement.expenses.realEstate.fees = purchase.recurrentExpenses!.maintenanceFees / 12;
        expectedSixMonthsLater.plStatement.expenses.realEstate.tax = purchase.recurrentExpenses!.propertyTax / 12;

        const expectedOneYearLater = buildReporting();
        expectedOneYearLater.balanceSheet.assets.currentAccount = -(purchase.price + purchase.notaryFees + purchase.recurrentExpenses!.propertyTax + purchase.recurrentExpenses!.maintenanceFees);
        expectedOneYearLater.balanceSheet.assets.properties = [purchase.price];
        expectedOneYearLater.plStatement.expenses.realEstate.fees = purchase.recurrentExpenses!.maintenanceFees / 12;
        expectedOneYearLater.plStatement.expenses.realEstate.tax = purchase.recurrentExpenses!.propertyTax / 12;

        // Act
        person.buyProperty(atStart, purchase);
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history.toArray()[6]).eqlReporting(expectedSixMonthsLater);
        expect(history.toArray()[12]).eqlReporting(expectedOneYearLater);
    });

    it('and selling it later is expensive', () => {
        // Arrange
        const person = new Person();
        const purchase: PropertyPurchase = {
            price: 200000,
            notaryFees: 14000,
            recurrentExpenses: {
                propertyTax: 1000,
                residenceTax: 0,
                maintenanceFees: 0
            }
        };
        const expectedOneYearLater = buildReporting({ currentAccount: -(purchase.notaryFees + purchase.recurrentExpenses!.propertyTax / 2) });

        // Act
        person.buyProperty(atStart, purchase);
        person.sellProperty(sixMonthsLater);
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history.toArray()[12]).eqlReporting(expectedOneYearLater);
    });

    it('and moving in makes you pay residence tax', () => {
        // Arrange
        const person = new Person();
        const purchase: PropertyPurchase = {
            price: 200000,
            notaryFees: 14000,
            recurrentExpenses: {
                propertyTax: 1600,
                residenceTax: 1000,
                maintenanceFees: 0
            }
        };
        const expectedOneYearLater = buildReporting({
            currentAccount: -(purchase.price + purchase.notaryFees + purchase.recurrentExpenses!.propertyTax + purchase.recurrentExpenses!.residenceTax)
        });
        expectedOneYearLater.balanceSheet.assets.properties = [purchase.price];
        expectedOneYearLater.plStatement.expenses.realEstate.fees = purchase.recurrentExpenses!.maintenanceFees / 12;
        expectedOneYearLater.plStatement.expenses.realEstate.tax = (purchase.recurrentExpenses!.residenceTax + purchase.recurrentExpenses!.propertyTax) / 12;

        // Act
        person.buyProperty(atStart, purchase);
        person.moveIn(atStart);
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history.toArray()[12]).eqlReporting(expectedOneYearLater);
    });

    it('and making home improvement increases the property worth', () => {
        // Arrange
        const property: Property = {
            purchasePrice: 200000,
            currentWorth: 200000,
            recurrentExpenses: {
                propertyTax: 0,
                residenceTax: 0,
                maintenanceFees: 0
            },
            state: 'usedAsPrincipalResidence',
            rent: 0,
            growthRate: 0
        };
        const person = new Person({
            properties: [property]
        });

        const improvementCost = 20000;
        const addedValueToProperty = 15000;
        const expectedOneYearLater = buildReporting({ currentAccount: -improvementCost });
        expectedOneYearLater.balanceSheet.assets.properties.push(property.currentWorth + addedValueToProperty);
        expectedOneYearLater.plStatement.expenses.realEstate.fees = property.recurrentExpenses!.maintenanceFees / 12;

        // Act
        person.makePropertyImprovement(atStart,
        {
            cost: improvementCost,
            addedValue: addedValueToProperty
        });
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history.toArray()[12]).eqlReporting(expectedOneYearLater);
    });

});