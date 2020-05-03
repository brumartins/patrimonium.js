import { PersonAction } from './person-action';
import { SimpleDate } from '../simple-date';
import { PropertyPurchase } from "../property-purchase";
import { Property } from "../property";
import { PersonSituation } from '../person-situation';

export class BuyPropertyAction implements PersonAction {
    public purchase: PropertyPurchase;

    constructor(public date: SimpleDate, purchase: PropertyPurchase) {
        this.purchase = _clonePropertyPurchase(purchase);
    }

    execute(situation: PersonSituation): void {
        situation.currentAccount -= (this.purchase.price + this.purchase.notaryFees);
        situation.properties.push(_toProperty(this.purchase));
    }
}

function _toProperty(purchase: PropertyPurchase): Property {
    return {
        purchasePrice: purchase.price,
        currentWorth: purchase.price,
        recurrentExpenses: {
            residenceTax: purchase.recurrentExpenses?.residenceTax ?? 0,
            propertyTax: purchase.recurrentExpenses?.propertyTax ?? 0,
            maintenanceFees: purchase.recurrentExpenses?.maintenanceFees ?? 0,
        },
        rent: purchase.rent ?? 0,
        state: 'empty',
        growthRate: purchase.growthRate ?? 0
    };
}

function _clonePropertyPurchase(purchase: PropertyPurchase): PropertyPurchase {
    return {
        price: purchase?.price ?? 0,
        notaryFees: purchase?.notaryFees ?? 0,
        recurrentExpenses: {
            residenceTax: purchase?.recurrentExpenses?.residenceTax ?? 0,
            propertyTax: purchase?.recurrentExpenses?.propertyTax ?? 0,
            maintenanceFees: purchase?.recurrentExpenses?.maintenanceFees ?? 0,
        },
        rent: purchase?.rent ?? 0,
        growthRate: purchase?.growthRate ?? 0
    }
}