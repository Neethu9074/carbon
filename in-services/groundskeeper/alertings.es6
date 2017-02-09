import {create} from 'reactive-observables';
import {List, fromJS} from 'immutable';


let alerts = List();
const alerts$ = create({emitLatestOnSubscribe: true});

export function getAlerts() {
  return alerts$;
}

export function addOrUpdateAlert(alert) {
  const matchingId = alert.get('id');
  let matchingIndex = -1;
  for (let i = 0, length = alerts.size; i < length; i++) {
    if (alerts.getIn([i, 'id']) === matchingId) {
      matchingIndex = i;
      break;
    }
  }

  if (matchingIndex < 0) {
    alerts = alerts.push(alert);
  } else {
    alerts = alerts.set(matchingIndex, alert);
  }
  alerts$.emit(alerts);
}


// add dummy alerts
addOrUpdateAlert(fromJS({
  id: '42',
  name: 'Alert No 1',
  enabled: true,
  data: {}
}));
addOrUpdateAlert(fromJS({
  id: '4711',
  name: 'Alert No 2',
  enabled: false,
  misc: 'added by stan',
  data: {}
}));
