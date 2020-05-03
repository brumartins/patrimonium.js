import { expect, use } from 'chai';
import customAssertions from './helpers/chai-assertions';
import { Person, Loan, LoanOptions } from '../src/index';
import { atStart, oneYearLater, twentyYearsAndTwoMonthsLater } from './helpers/date-helper';
import { buildReporting } from './helpers/reporting-helper';

use(customAssertions);

const loanOptions: LoanOptions = {
    amount: 300000,
    period: 20*12,
    interestRate: 1.35,
    insuranceRate: 0.36,
    bankingFees: 3300
};
const loan = new Loan(loanOptions);
const monthlyPayment = 1475;

describe(`Loan`, () => {

    it('compute monthly payment', () => {
        expect(loan.monthlyPayment).closeTo(monthlyPayment, 1);
    });

    it('get amount already repaid', () => {
        let amountToBeRepaid = loan.amount;
        expect(loan.getAmountStillToBeRepaid()).closeTo(amountToBeRepaid, 1);

        loan.elapsedMonths++; // 1st month repaid
        amountToBeRepaid -= 1049.3;
        expect(loan.getAmountStillToBeRepaid()).closeTo(amountToBeRepaid, 1);

        loan.elapsedMonths++; // 2st month repaid
        amountToBeRepaid -= 1050;
        expect(loan.getAmountStillToBeRepaid()).closeTo(amountToBeRepaid, 1);
        
        loan.elapsedMonths = 239; // 239 months repaid
        expect(loan.getAmountStillToBeRepaid()).closeTo(1474, 1);

        loan.elapsedMonths++; // 240 months repaid, loan is fully repaid
        expect(loan.getAmountStillToBeRepaid()).closeTo(0, 1);
    });

});

describe(`Signing a loan`, () => {

    it('makes you repay the loan on a monthly basis', () => {
        // Arrange
        const person = new Person();
        const expectedOneYearLater = buildReporting();
        const expectedLoanLater = new Loan(loanOptions);
        expectedLoanLater.elapsedMonths = 12;
        expectedOneYearLater.balanceSheet.assets.currentAccount = expectedLoanLater.amount - expectedLoanLater.bankingFees - expectedLoanLater.monthlyPayment * 12;
        expectedOneYearLater.balanceSheet.liabilities.loan = expectedLoanLater.getAmountStillToBeRepaid();
        expectedOneYearLater.plStatement.expenses.loans = [monthlyPayment];

        // Act
        person.signLoan(atStart, loanOptions);
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history[12]).eqlReporting(expectedOneYearLater);
    });

    it('makes you do monthly payments only during the loan period', () => {
        // Arrange
        const person = new Person();

        const expectedOneMonthBeforeLoanEnd = buildReporting();
        loanOptions.bankingFees = loanOptions.bankingFees ?? 0;
        const loanOneMonthBeforeEnd = new Loan(loanOptions);
        loanOneMonthBeforeEnd.elapsedMonths = 239;
        expectedOneMonthBeforeLoanEnd.balanceSheet.assets.currentAccount = loanOneMonthBeforeEnd.amount - loanOneMonthBeforeEnd.bankingFees - loanOneMonthBeforeEnd.monthlyPayment * (loanOptions.period - 1);
        expectedOneMonthBeforeLoanEnd.balanceSheet.liabilities.loan = loanOneMonthBeforeEnd.getAmountStillToBeRepaid();
        expectedOneMonthBeforeLoanEnd.plStatement.expenses.loans = [monthlyPayment];

        const expectedAtLoanEnd = buildReporting();
        expectedAtLoanEnd.balanceSheet.assets.currentAccount = loanOptions.amount - loanOptions.bankingFees - loanOneMonthBeforeEnd.monthlyPayment * loanOptions.period;
        expectedAtLoanEnd.plStatement.expenses.loans = [monthlyPayment];

        const expectedAfterLoanEnd = buildReporting();
        expectedAfterLoanEnd.balanceSheet.assets.currentAccount = loanOptions.amount - loanOptions.bankingFees - loanOneMonthBeforeEnd.monthlyPayment * loanOptions.period;

        // Act
        person.signLoan(atStart, loanOptions);
        let history = person.getHistory(twentyYearsAndTwoMonthsLater);
        history = person.getHistory(twentyYearsAndTwoMonthsLater);

        // Assert
        expect(history[239]).eqlReporting(expectedOneMonthBeforeLoanEnd);
        expect(history[240]).eqlReporting(expectedAtLoanEnd);
        expect(history[241]).eqlReporting(expectedAfterLoanEnd);
    });

    it('a person already has a loan at the beginning', () => {
        // Arrange
        const loan = new Loan({
            amount: 300000,
            period: 20*12,
            interestRate: 1.35,
            insuranceRate: 0.36,
            elapsedMonths: 10*12
        });
        const person = new Person({
            loans: [loan]
        });
        const expectedatStart = buildReporting({ loan: loan.getAmountStillToBeRepaid() });
        const expectedOneYearLater = buildReporting({
            currentAccount: -17699,
            loan: 147729
        });
        expectedOneYearLater.plStatement.expenses.loans = [monthlyPayment];

        // Act
        let history = person.getHistory(oneYearLater);
        history = person.getHistory(oneYearLater);

        // Assert
        expect(history[0]).eqlReporting(expectedatStart);
        expect(history[12]).eqlReporting(expectedOneYearLater);
    });

});