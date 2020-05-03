import { Reporting, PLStatement, BalanceSheet } from "../../src";

export function buildReporting(options?: { currentAccount?: number, properties?: number[], loan?: number }): Reporting {
    return {
        balanceSheet: buildBalanceSheet(options),
        plStatement: buildPlStatement()
    };
}

export function buildBalanceSheet(options?: { currentAccount?: number, properties?: number[], loan?: number }): BalanceSheet {
    return {
        assets: {
            currentAccount: options?.currentAccount ?? 0,
            properties: options?.properties ?? []
        },
        liabilities: {
            loan: options?.loan ?? 0
        },
        netWorth: 0
    };
}

export function buildPlStatement(): PLStatement {
    return {
        income: {
            salaries: [],
            rentalIncome: [],
            investementReturn: 0,
        },
        expenses: {
            realEstate: {
                tax: 0,
                fees: 0
            },
            rent: 0,
            tax: 0,
            loans: [],
            other: 0
        },
        netProfit: 0
    };
}