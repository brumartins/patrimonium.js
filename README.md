# Patrimonium.js
Patrimonium.js is a JavaScript library providing a set of tools to modelize the real estate operations of an individual and their impact on the financial situation of the same individual.

## Install
Install the package from NPM.
```
npm i patrimonium
```

Patrimonium.js library is exposed under all the module definitions (UMD).

## Use

### Concepts
A `Person` represents an individual with financial capabilities. A series of operations at specific dates can be performed on behalf of this `Person`. A financial `Reporting` composed of `BalanceSheet` and `PLStatement` (profit and loss statement) is also available month-over-month.

A `Person` is considered country-agnostic, meaning that taxation is not defined by default. If needed, the tax calculation must be provided when instancing a `Person`.

A `Person` can be used as a single individual but also as a taxable household composed of multiple individuals.

**Country plugins** serve the purpose of providing additional classes inheriting from `Person` with built-in country-specific features like tax calculation. The following plugins are available :
- France
    - income tax calculation for salaries (based on gross salary and employment status)
    - rental income tax calculation based on 'micro-foncier' scheme (more schemes to come)

### Example
```js
import { SimpleDate } from 'patrimonium';
import { Frenchman } from 'patrimonium/countries/france';

const person = new Frenchman({
    currentAccount: 50000,
    employments: [{
        salary: () => 30000, // gross annual salary
        status: 'public' // public administration
    }]
});

const atStart = new SimpleDate({ nthMonth: 0 });
const oneYearLater = new SimpleDate({ nthMonth: 12 });
const twoYearsLater = new SimpleDate({ nthMonth: 24 });

person.buyProperty(atStart, {
    price: 200000,
    notaryFees: 7000
});

person.signLoan(atStart, {
    amount: 180000,
    period: 240, // months
    interestRate: 1.35,
    insuranceRate: 0.36
});

person.sellProperty(oneYearLater);

const history = person.getHistory(twoYearsLater); // getting history from the start up to two years later
const balanceSheetOneYearAndAHalfLater = history[18].balanceSheet;
const plStatementOneYearAndAHalfLater = history[18].plStatement;
```

### Limitations
- Multi-currency is not supported.
- Foreign income is not supported but using employment status can be a workaround for foreign salaries.

### Documentation
For more information about all available features, consult Typescript declaration files.

## License
[MIT](https://github.com/brumartins/patrimonium.js/blob/master/LICENSE)
