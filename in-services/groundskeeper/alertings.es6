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
    entityType: 'host',
    metricName: 'memory.used',
    isTriggering: false,
    severity: 0.5,
    decription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    query: 'zone=PROD',
    condition: '10 minute(s) > 50%'
  }
}));
addOrUpdateAlert(fromJS({
  data: {
    name: 'Alert No 2',
    enabled: false,
    entityType: 'process',
    metricName: 'cpu.load',
    isTriggering: true,
    severity: 1,
    decription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    query: 'zone=PROD',
    condition: 'value > 50%'
  }
}));
