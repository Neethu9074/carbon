import {fromJS} from 'immutable';

import {generateUniqueShortId} from 'in-services/util/id';
import http from 'in-services/http';


export function getAlerts() {
  return http({
    method: 'GET',
    url: `/api/alerts`
  })
  .map(response => fromJS(response.body));
}


export function getAlert(alertId) {
  return http({
    method: 'GET',
    url: `/api/alerts/${encodeURIComponent(alertId)}`
  })
  .map(response => fromJS(response.body));
}


export function saveAlert(alert) {
  return http({
    method: 'PUT',
    url: `/api/alerts/${encodeURIComponent(alert.get('id'))}`,
    data: alert.toJS()
  })
  .map(response => fromJS(response.body));
}


export function deleteAlert(alertId) {
  return http({
    method: 'DELETE',
    url: `/api/alerts/${encodeURIComponent(alertId)}`
  })
  .map(response => fromJS(response.body));
}

export function newEmptyAlert() {
  return {
    id: generateUniqueShortId(),
    name: 'New Alert',
    enabled: false,
    match: {
      entityType: '',
      metricName: '',
      rollup: 1000,
      query: ''
    },
    rule: {
      window: 1000,
      aggregation: '',
      conditionOperator: '',
      conditionValue: 0.0
    },
    event: {
      triggering: false,
      severity: 0,
      text: 'This text will be shown in events',
      description: ''
    }
  };
}
