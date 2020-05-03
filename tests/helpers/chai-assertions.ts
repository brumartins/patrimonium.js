import { Assertion } from 'chai';
import { BalanceSheet, Reporting } from '../../src/index';

declare global {
    export namespace Chai {
        interface Assertion {
            /**
             * Asserts that the target is a `Reporting` instance and is equal to to the expected `Reporting`.
             * 
             * Equality is intended as a sort of `deep.closeTo(expected, 1)`, meaning each numerical (nested) property of the target
             * must be in a given +/- 1 range of the corresponding numerical (nested) property of the expected `Reporting` instance.
             * 
             * @param expected A `Reporting` instance to compare to.
             */
            eqlReporting(expected: Reporting): Assertion;
        }
    }
}

/**
 * A custom `Chai` plugin with additional assertion methods.
 * @example import { expect, use } from 'chai';
 * import customAssertions from './helpers/chai-assertions';
 * use(customAssertions);
 */
const chaiAssertions = () => {
    Assertion.addMethod('eqlReporting', function (reporting: Reporting) {
        const obj = this._obj as Reporting;

        // Balance sheet equality
        new Assertion(obj.balanceSheet.assets.currentAccount, "Balance sheet: current account").closeTo(reporting.balanceSheet.assets.currentAccount, 1);
        new Assertion(obj.balanceSheet.liabilities.loan, "Balance sheet: loan").closeTo(reporting.balanceSheet.liabilities.loan, 1);
        new Assertion(obj.balanceSheet.assets.properties.length, "Balance sheet: property count").eq(reporting.balanceSheet.assets.properties.length);
        obj.balanceSheet.assets.properties.forEach((p, idx) => {
            new Assertion(p, "Balance sheet: property index " + idx).closeTo(reporting.balanceSheet.assets.properties[idx], 1);
        });

        // P&L statement equality - income
        new Assertion(obj.plStatement.income.salaries, "P&L statement income: salaries").eql(reporting.plStatement.income.salaries);
        new Assertion(obj.plStatement.income.rentalIncome, "P&L statement income: rental income").eql(reporting.plStatement.income.rentalIncome);
        new Assertion(obj.plStatement.income.investementReturn, "P&L statement income: investement return").closeTo(reporting.plStatement.income.investementReturn, 1);
        
        // P&L statement equality - expenses
        new Assertion(obj.plStatement.expenses.tax, "P&L statement expenses: tax").closeTo(reporting.plStatement.expenses.tax, 1);
        new Assertion(obj.plStatement.expenses.rent, "P&L statement expenses: rent").closeTo(reporting.plStatement.expenses.rent, 1);
        new Assertion(obj.plStatement.expenses.other, "P&L statement expenses: other").closeTo(reporting.plStatement.expenses.other, 1);
        new Assertion(obj.plStatement.expenses.loans.length, "P&L statement expenses: loan count").eq(reporting.plStatement.expenses.loans.length);
        obj.plStatement.expenses.loans.forEach((l, idx) => {
            new Assertion(l, "P&L statement expenses: loan index " + idx).closeTo(reporting.plStatement.expenses.loans[idx], 1);
        });

        // P&L statement equality - real estate expenses
        new Assertion(obj.plStatement.expenses.realEstate.fees, "P&L statement real estate expenses: fees")
            .closeTo(reporting.plStatement.expenses.realEstate.fees, 1);
        new Assertion(obj.plStatement.expenses.realEstate.tax, "P&L statement real estate expenses: tax")
            .closeTo(reporting.plStatement.expenses.realEstate.tax, 1);


      });
};

export default chaiAssertions;