import {create} from 'reactive-observables';
import {Set, fromJS} from 'immutable';


let alerts = Set();
const alerts$ = create({emitLatestOnSubscribe: true});

export function getAlerts() {
  return alerts$;
}

export function addAlert({id}) {
  alerts = alerts.add(fromJS({
    id
  }));
  alerts$.emit(alerts);
}
