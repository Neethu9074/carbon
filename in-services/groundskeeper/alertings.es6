import {create} from 'reactive-observables';
import {List, fromJS} from 'immutable';


let alerts = List();
const alerts$ = create({emitLatestOnSubscribe: true});

export function getAlerts() {
  return alerts$;
}

export function addOrUpdateAlert(alert) {
  let matchingId = alert.get('id', null);
  if (matchingId == null) {
    matchingId = newId();
  }

  const matchingIndex = getMatchingAlertIndex(matchingId);

  alert = alert.set('id', matchingId);
  if (matchingIndex < 0) {
    alerts = alerts.push(alert);
  } else {
    alerts = alerts.set(matchingIndex, alert);
  }
  alerts$.emit(alerts);
}

export function removeAlert(alertId) {
  const matchingIndex = getMatchingAlertIndex(alertId);
  if (matchingIndex >= 0) {
    alerts = alerts.delete(matchingIndex);
    alerts$.emit(alerts);
  }
}

function getMatchingAlertIndex(id) {
  for (let i = 0, length = alerts.size; i < length; i++) {
    if (alerts.getIn([i, 'id']) === id) {
      return i;
    }
  }
  return -1;
}

let id = 0;
function newId() {
  return id++;
}

// add dummy alerts
addOrUpdateAlert(fromJS({
  data: {
    name: 'Alert No 1',
    enabled: true,
  }
}));
addOrUpdateAlert(fromJS({
  data: {
    name: 'Alert No 2',
    enabled: false,
    misc: 'added by stan',
  }
}));
