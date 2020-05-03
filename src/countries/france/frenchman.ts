import { Person, Property, GrossSalary } from '../../index';
import { FrenchmanInitialSituation } from './frenchman-initial-situation';

/**
 * Available values for an employment status in France.
 */
export type FrenchEmploymentStatus = 'non-cadre' | 'cadre' | 'public' | 'liberal' | 'portage';

/**
 * Represents a French taxable household composed of one or more French fiscal residents.
 * Tax calculation is already built-in so it is not required to provide it.
 */
export class Frenchman extends Person {

    /**
     * Part count of the 'quotient familial' of the french taxable household.
     */
    private readonly _quotientFamilialPartCount: number;

    /**
     * Returns a new instance of a `Frenchman`.
     * @param initialSituation The initial situation of the `Frenchman` including his assets, liabilities, salary etc.
     */
    constructor(initialSituation: FrenchmanInitialSituation) {
        super(initialSituation);
        this._quotientFamilialPartCount = initialSituation.quotientFamilialPartCount ?? 1;
        this._initialSituation.environment.netIncomeCalculation = _calculateNetIncomeFunction(this._quotientFamilialPartCount);
    }
}

function _calculateNetIncomeFunction(quotientFamilialPartCount: number) {
    return (salaries: GrossSalary[], properties: Property[]) => {

        const netTaxableAnnualSalary = salaries.reduce(
            (totalTaxable, salary) => {
                if (!salary.status) {
                    throw new Error('Each person employment must have a status.')
                }

                return totalTaxable + _grossToNetTaxableSalary(salary.status as FrenchEmploymentStatus, salary.amount)
            }, 0);

        const netTaxableAnnualRentalIncome = _getTaxableRentalIncome(properties);

        const netTaxableAnnualIncome = netTaxableAnnualSalary + netTaxableAnnualRentalIncome;

        return netTaxableAnnualIncome - _getIncomeTaxAmount(netTaxableAnnualIncome, quotientFamilialPartCount);
    }
}

function _grossToNetTaxableSalary(status: FrenchEmploymentStatus, salary: number): number {
    switch (status) {
        case 'non-cadre':
            return salary * 0.78;
        case 'cadre':
            return salary * 0.75;
        case 'public':
            return salary * 0.85;
        case 'liberal':
            return salary * 0.55;
        case 'portage':
            return salary * 0.49;
        default:
            throw new Error(`Unknown french employment status: '${status}'. Use 'FrenchEmploymentStatus' type for valid statuses.`);
    }
}

/**
 * Use 'Micro-foncier' scheme.
 * @param properties 
 */
function _getTaxableRentalIncome(properties: Property[]) {
    return 0.7 * properties.filter(p => p.state === 'rented').reduce((acc, curr) => acc + curr.rent, 0);
}

function _getIncomeTaxAmount(netTaxableAnnualIncome: number, quotientFamilialPartCount: number) {
    const netTaxableAnnualIncomeAfterAllowance = netTaxableAnnualIncome * 0.9; // Abatement 10% frais
    if (netTaxableAnnualIncomeAfterAllowance <= 10064) {
        return 0;
    } else if (netTaxableAnnualIncomeAfterAllowance <= 27794) {
        return (netTaxableAnnualIncomeAfterAllowance * 0.14) - (1408.96 * quotientFamilialPartCount);
    } else if (netTaxableAnnualIncomeAfterAllowance <= 74517) {
        return (netTaxableAnnualIncomeAfterAllowance * 0.30) - (5856 * quotientFamilialPartCount);
    } else if (netTaxableAnnualIncomeAfterAllowance <= 157806) {
        return (netTaxableAnnualIncomeAfterAllowance * 0.41) - (14052.87 * quotientFamilialPartCount) ;
    } else {
        return (netTaxableAnnualIncomeAfterAllowance * 0.45) - (20365.11 * quotientFamilialPartCount) ;
    }
}