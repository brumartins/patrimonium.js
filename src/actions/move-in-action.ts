import { PersonAction } from './person-action';
import { SimpleDate } from '../simple-date';
import { PersonSituation } from '../person-situation';

export class MoveInAction implements PersonAction {
    constructor(public date: SimpleDate, private propertyIdx: number = 0) {
        this.date = date;
    }

    execute(situation: PersonSituation): void {
        if (situation.properties.length <= this.propertyIdx) {
            throw new Error(`Invalid operation: no property with index '${this.propertyIdx}'`);
        }

        _moveOut(situation);
        _moveIn(situation, this.propertyIdx);
    }
}

function _moveOut(situation: PersonSituation) {
    const currentPrincipalResidenceIdx = situation.properties.findIndex(p => p.state === 'usedAsPrincipalResidence');
    if (currentPrincipalResidenceIdx > -1) {
        situation.properties[currentPrincipalResidenceIdx].state = 'empty';
    }
}

function _moveIn(situation: PersonSituation, propertyIdx: number) {
    situation.properties[propertyIdx].state = 'usedAsPrincipalResidence';
}