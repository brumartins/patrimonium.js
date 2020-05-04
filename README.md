# Patrimonium.js
Patrimonium.js is a JavaScript library providing a set of tools to modelize the real estate operations of an individual and their impact on their financial situation.

## Install
Install the package from NPM.
```
npm i patrimoniumjs
```

Patrimonium.js library is exposed under all the module definitions (UMD).

## Use

### Concepts
A `Person` represents an individual with financial capabilities. A series of operations at specific dates can be performed on behalf of this `Person`. A financial `Reporting` composed of `BalanceSheet` and `PLStatement` (profit and loss statement) is also available month-over-month.

A `Person` can be used as a single individual but also as a taxable household composed of multiple individuals.

A `Person` is not attached to a particular country. It means that it is up to the developper to implement some country-specific features, like the income tax calculation.

**Country plugins** serve the purpose of providing additional classes inheriting from `Person` with built-in country-specific features like income tax calculation. The following plugins are available :
- France
    - income tax calculation for salaries (based on gross salary and employment status)
    - rental income tax calculation based on 'micro-foncier' scheme (more schemes to come)

### Example
```js
import { SimpleDate } from 'patrimoniumjs';
import { Frenchman } from 'patrimoniumjs/countries/france';

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
- Multi-currency management is not supported.
- Foreign income management is not supported.

### Documentation
For more information about all available features, consult Typescript declaration files.

## License
[MIT](https://github.com/brumartins/patrimonium.js/blob/master/LICENSE)
