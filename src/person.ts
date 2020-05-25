import {
    PersonAction, BuyPropertyAction, SignLoanAction, SellPropertyAction, RentPropertyAction, LeaveRentalPropertyAction,
    MoveInAction, MakePropertyImprovementAction, RentOutPropertyAction
} from "./actions";
import {
    Property, PropertyImprovement, PropertySale, PropertyMove, PropertyRentOut, PropertyPurchase, Loan,
    LoanOptions, Rental, PersonInitialSituation, SimpleDate, BalanceSheet, Employment, GrossSalary, Reporting,
    PersonSituation, PLStatement, History
} from ".";

/**
 * Represents a person.
 */
export class Person {
    protected readonly _initialSituation: PersonSituation;

    /**
     * The actions taken by the `Person` over time.
     */
    private readonly _actions: PersonAction[] = [];

    /**
     * Returns a new instance of a `Person`.
     * @param initialSituation The initial situation of the `Person` including his assets, liabilities, salary etc.
     */
    constructor(initialSituation?: PersonInitialSituation) {
        this._initialSituation = _cloneSituation(initialSituation);
    }

    /**
     * Returns the financial reporting history of a `Person` up to a specific date.
     * @param dateUntil Returns only reports until this date.
     * @example
     * const person = new Person();
     * const sixMonthsLater = new SimpleDate({ nthMonth: 6 });
     * const oneYearLater = new SimpleDate({ nthMonth: 12 });
     * const history = person.getHistory(oneYearLater);
     * const balanceSheetOneYearLater = history.getReporting(oneYearLater).balanceSheet;
     * const plStatementSixMonthsLater = history.getReporting(sixMonthsLater).plStatement;
     */
    getHistory(dateUntil: SimpleDate): History {
        const reports: Reporting[] = [];
        const situation = _cloneSituation(this._initialSituation);

        reports.push({
            balanceSheet: _computeBalanceSheet(situation),
            plStatement: _buildPLStatement()
        });

        let eventIdx = 0;

        const orderedActions = this._actions.slice().sort((a, b) => a.date.getMonths() - b.date.getMonths());

        dateUntil = _cloneDate(dateUntil);

        dateUntil.getDatesFromOrigin().forEach(date => {
            const plStatement = _buildPLStatement();

            while (orderedActions.length > eventIdx && orderedActions[eventIdx].date.getMonths() === date.getMonths()) {
                orderedActions[eventIdx].execute(situation, plStatement);
                eventIdx++;
            }

            _executeMonthlyEvents(situation, plStatement, date);

            plStatement.netProfit = _calcNetProfit(plStatement);

            reports.push({
                balanceSheet: _computeBalanceSheet(situation),
                plStatement: plStatement
            });
        });

        return new History(reports);
    }

    /**
     * Performs the action of buying a property on behalf of this `Person` instance.
     * @param date The purchase date.
     * @param purchase The purchase details.
     */
    buyProperty(date: SimpleDate, purchase: PropertyPurchase): void {
        const action = new BuyPropertyAction(_cloneDate(date), purchase);
        this._actions.push(action);
    }

    /**
     * Performs the action of signing a loan on behalf of this `Person` instance.
     * @param date The loan signature date.
     * @param loan The loan details.
     */
    signLoan(date: SimpleDate, loan: LoanOptions): void {
        const action = new SignLoanAction(_cloneDate(date), loan);
        this._actions.push(action);
    }

    /**
     * Performs the action of selling a property on behalf of this `Person` instance.
     * @param date The sale date.
     * @param sale The sale details. If not provided, the first acquired property is sold.
     */
    sellProperty(date: SimpleDate, sale?: PropertySale): void {
        const action = new SellPropertyAction(_cloneDate(date), sale?.propertyIdx ?? undefined)
        this._actions.push(action);
    }

    /**
     * Performs the action of renting a property on behalf of this `Person` instance.
     * @param date The start date of the rental.
     * @param rental The rental details.
     */
    rentProperty(date: SimpleDate, rental: Rental): void {
        const action = new RentPropertyAction(_cloneDate(date), rental);
        this._actions.push(action);
    }

    /**
     * Performs the action of leaving a rental property on behalf of this `Person` instance.
     * @param date The date of the leave.
     */
    leaveRentalProperty(date: SimpleDate): void {
        const action = new LeaveRentalPropertyAction(_cloneDate(date));
        this._actions.push(action);
    }

    /**
     * Performs the action of moving in a property on behalf of this `Person` instance.
     * @param date The date of the move.
     * @param move The move details. If not provided, the `Person` movies in the first acquired property.
     */
    moveIn(date: SimpleDate, move?: PropertyMove) {
        const action = new MoveInAction(_cloneDate(date), move?.propertyIdx ?? undefined);
        this._actions.push(action);
    }

    /**
     * Performs the action of making a property improvement on behalf of this `Person` instance.
     * @param date The date of the property improvement.
     * @param improvement The property improvement details.
     */
    makePropertyImprovement(date: SimpleDate, improvement: PropertyImprovement) {
        const action = new MakePropertyImprovementAction(
            _cloneDate(date),
            improvement.cost,
            improvement.addedValue,
            improvement.propertyIdx);
        this._actions.push(action);
    }

    /**
     * Performs the action of renting out a property on behalf of this `Person` instance.
     * @param date The start date of the rent.
     * @param rent The rent details. If not provided, the first acquired property is rented out.
     */
    rentOutProperty(date: SimpleDate, rent?: PropertyRentOut) {
        const action = new RentOutPropertyAction(_cloneDate(date), rent?.propertyIdx ?? undefined);
        this._actions.push(action);
    }
}

function _executeMonthlyEvents(situation: PersonSituation, plStatement: PLStatement, date: SimpleDate): void {
    _updatePropertyValues(situation);
    _receiveInvestmentReturn(situation, plStatement);
    _receiveIncome(situation, plStatement, date);
    _payPropertyTax(situation, plStatement);
    _payRent(situation, plStatement);
    _payResidenceTax(situation, plStatement);
    _repayLoans(situation, plStatement);
    _payMaintenanceFees(situation, plStatement);
    _makeOtherExpenses(situation, plStatement, date);
}

function _receiveInvestmentReturn(situation: PersonSituation, plStatement: PLStatement) {
    if (!situation.environment.investmentRateOfReturn) {
        return;
    }

    const monthlyRoR = _toMonthlyRate(situation.environment.investmentRateOfReturn / 100);
    const investmentReturn = situation.currentAccount * monthlyRoR;
    situation.currentAccount += investmentReturn;
    plStatement.income.investementReturn = investmentReturn;
}

function _updatePropertyValues(situation: PersonSituation) {
    situation.properties = situation.properties.map(p => {
        let monthlyPropertyGrowthRate = _toMonthlyRate(p.growthRate);
        p.currentWorth *= (1 + monthlyPropertyGrowthRate);
        return p;
    });
}

function _payPropertyTax(situation: PersonSituation, plStatement: PLStatement) {
    situation.properties.forEach(p => {
        const taxAmount = p.recurrentExpenses.propertyTax / 12;
        situation.currentAccount -= taxAmount;
        plStatement.expenses.realEstate.tax += taxAmount;
    });
}

function _payRent(situation: PersonSituation, plStatement: PLStatement) {
    if (!situation.rental) {
        return;
    }

    situation.currentAccount -= situation.rental.price;
    plStatement.expenses.rent = situation.rental.price;
}

function _payResidenceTax(situation: PersonSituation, plStatement: PLStatement) {
    if (situation.rental) {
        const taxAmount = situation.rental.residenceTax / 12
        situation.currentAccount -= taxAmount;
        plStatement.expenses.realEstate.tax += taxAmount;
        return;
    }

    const annualResidenceTax = situation.properties.find(p => p.state === 'usedAsPrincipalResidence')?.recurrentExpenses.residenceTax ?? 0;
    situation.currentAccount -= annualResidenceTax / 12;
    plStatement.expenses.realEstate.tax += annualResidenceTax / 12;
}

function _repayLoans(situation: PersonSituation, plStatement: PLStatement): void {
    situation.loans = situation.loans
        .filter(loan => loan.elapsedMonths !== loan.period) // removed loans that just ended the past month
        .map(loan => {
            situation.currentAccount -= loan.monthlyPayment;
            plStatement.expenses.loans.push(loan.monthlyPayment);
            loan.elapsedMonths++;
            return loan;
        });
}

function _payMaintenanceFees(situation: PersonSituation, plStatement: PLStatement): void {
    situation.properties.forEach(p => {
        const monthlyMaintenanceFees = p.recurrentExpenses.maintenanceFees / 12;
        situation.currentAccount -= monthlyMaintenanceFees;
        plStatement.expenses.realEstate.fees += monthlyMaintenanceFees;
    });
}

function _makeOtherExpenses(situation: PersonSituation, plStatement: PLStatement, date: SimpleDate): void {
    const amountSpent = situation.expenses(_cloneDate(date));
    situation.currentAccount -= amountSpent;
    plStatement.expenses.other = amountSpent;
}

function _receiveIncome(situation: PersonSituation, plStatement: PLStatement, date: SimpleDate): void {
    const nthYear = Math.floor(date.getMonths() / 12);
    
    const grossAnnualSalary = situation.employments.reduce(
        (totalAmount, employment) => totalAmount + employment.salary(nthYear),
        0);

    const grossSalaries: GrossSalary[] = situation.employments.map(e => {
        return {
            amount: e.salary(nthYear),
            status: e.status
        } as GrossSalary;
    });

    plStatement.income.salaries = situation.employments.map(e => e.salary(nthYear) / 12);
    
    const rentedProperties = situation.properties.filter(p => p.state === 'rented');
    const annualRentalIncome = 12 * rentedProperties.reduce((acc, curr) => acc + curr.rent, 0);
    plStatement.income.rentalIncome = rentedProperties.map(p => p.rent);

    const annualIncome = grossAnnualSalary + annualRentalIncome;

    const netAnnualIncome = situation.environment.netIncomeCalculation
    ? situation.environment.netIncomeCalculation(grossSalaries, situation.properties)
    : annualIncome;

    plStatement.expenses.tax = (annualIncome - netAnnualIncome) / 12;

    situation.currentAccount += (netAnnualIncome / 12);
}

function _toMonthlyRate(annualRate: number): number {
    return Math.pow(1 + annualRate, 1 / 12) - 1;
}

function _cloneSituation(situation?: PersonSituation | PersonInitialSituation): PersonSituation {
    const noExpenses = () => 0;
    return {
        properties: situation?.properties?.map(p => _cloneProperty(p)) ?? [],
        loans: situation?.loans?.slice().map(l => _cloneLoan(l)) ?? [],
        currentAccount: situation?.currentAccount ?? 0,
        environment: {
            investmentRateOfReturn: situation?.environment?.investmentRateOfReturn ?? 0,
            netIncomeCalculation: situation?.environment?.netIncomeCalculation
        },
        rental: situation?.rental ? _cloneRental(situation.rental) : null,
        employments: situation?.employments?.map(e => _cloneEmployment(e)) ?? [],
        expenses: situation?.expenses ?? noExpenses
    };
}

function _cloneDate(date: SimpleDate): SimpleDate {
    return new SimpleDate({
        nthMonth: date.getMonths()
    });
}

function _cloneRental(rental: Rental): Rental {
    return {
        price: rental.price ?? 0,
        residenceTax: rental.residenceTax ?? 0
    };
}

function _cloneProperty(property: Property) {
    return {
        purchasePrice: property.purchasePrice,
        currentWorth: property.currentWorth,
        recurrentExpenses: {
            propertyTax: property.recurrentExpenses.propertyTax,
            residenceTax: property.recurrentExpenses.residenceTax,
            maintenanceFees: property.recurrentExpenses.maintenanceFees,
        },
        rent: property.rent,
        state: property.state,
        growthRate: property.growthRate
    }
}

function _cloneLoan(loan: Loan) {
    return new Loan({
        amount: loan.amount,
        period: loan.period,
        interestRate: loan.interestRate,
        insuranceRate: loan.insuranceRate,
        bankingFees: loan.bankingFees,
        elapsedMonths: loan.elapsedMonths
    });
}

function _cloneEmployment(employment: Employment): Employment {
    const noSalary = (_: number) => 0;
    return {
        salary: employment.salary ?? noSalary,
        status: employment.status
    }
}

function _computeBalanceSheet(situation: PersonSituation): BalanceSheet {
    const balanceSheet = {
        assets: {
            currentAccount: situation.currentAccount,
            properties: situation.properties.map(p => p.currentWorth) ?? []
        },
        liabilities: {
            loan: situation.loans.reduce((previous, current) => previous + current.getAmountStillToBeRepaid(), 0) ?? 0
        },
        netWorth: 0
    };

    balanceSheet.netWorth = balanceSheet.assets.currentAccount
        + balanceSheet.assets.properties.reduce((prev, curr) => prev + curr, 0)
        - balanceSheet.liabilities.loan;

    return balanceSheet;
}

function _buildPLStatement(): PLStatement {
    return {
        income: {
            salaries: [],
            investementReturn: 0,
            rentalIncome: [],
        },
        expenses: {
            rent: 0,
            tax: 0,
            other: 0,
            loans: [],
            realEstate: {
                tax: 0,
                fees: 0
            }
        },
        netProfit: 0
    }
}

function _calcNetProfit(plStatement: PLStatement): number {
    const income = plStatement.income.salaries.reduce((prev, curr) => prev + curr, 0)
        + plStatement.income.rentalIncome.reduce((prev, curr) => prev + curr, 0)
        + plStatement.income.investementReturn;

    const expenses = plStatement.expenses.tax + plStatement.expenses.rent + plStatement.expenses.other
        + plStatement.expenses.loans.reduce((prev, curr) => prev + curr, 0)
        + plStatement.expenses.realEstate.fees + plStatement.expenses.realEstate.tax;

    return income - expenses;
}