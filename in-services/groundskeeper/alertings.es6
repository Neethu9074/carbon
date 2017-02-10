import {create} from 'reactive-observables';
import {List, fromJS} from 'immutable';


let alerts = List();
const alerts$ = create({emitLatestOnSubscribe: true});

export function getAlerts() {
  return alerts$;
}

export function getAlert(alertId) {
  const index = getMatchingAlertIndex(alertId);
  if (index >= 0) {
    return alerts.get(index);
  }
  return null;
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
  return String(id++);
}

// add dummy alerts
addOrUpdateAlert(fromJS({
  data: {
    name: 'Alert No 1',
    enabled: true,
    entityType: 'host',
    metricName: 'memory.used',
    isTriggering: false,
    rollup: 5000,
    aggregation: 'max',
    window: 60000,
    threshold: '<=',
    thresholdValue: 0.2,
    severity: 5,
    eventText: 'This text will be shown in events',
    description: 'You can also use markdown here \n * Absolute change: **99%** \n * Confidence: **100.00%**',
    query: 'zone=PROD',
  }
}));
addOrUpdateAlert(fromJS({
  data: {
    name: 'Alert No 2',
    enabled: false,
    entityType: 'process',
    metricName: 'cpu.load',
    isTriggering: true,
    rollup: 10000,
    aggregation: 'mean',
    window: 1000,
    threshold: '!=',
    thresholdValue: 100.0,
    severity: 10,
    eventText: 'This text will be shown in events',
    description: 'You can also use markdown here \n * Absolute change: **99%** \n * Confidence: **100.00%**',
    query: 'zone=PROD',
  }
}));
