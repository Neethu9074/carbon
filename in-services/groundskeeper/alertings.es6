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


export function setEnabled(alert, enabled) {
  const modifiedAlert = alert.toJS();
  modifiedAlert.enabled = enabled;
  return http({
    method: 'PUT',
    url: `/api/alerts/${encodeURIComponent(alert.get('id'))}`,
    data: modifiedAlert
  });
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

export function createAlert(id,
                            name = 'New Alert',
                            enabled = false,
                            entityType = '',
                            metricName = '',
                            rollup = 1000,
                            query = '',
                            window = 1000,
                            aggregation = '',
                            conditionOperator = '',
                            conditionValue = 0.0,
                            triggering = false,
                            severity = 0,
                            expirationTime = 60000,
                            text = 'Event title',
                            description = 'Event description') {
  return {
    id: id || generateUniqueShortId(),
    name,
    enabled,
    match: {
      entityType,
      metricName,
      rollup,
      query
    },
    rule: {
      window,
      aggregation,
      conditionOperator,
      conditionValue
    },
    event: {
      triggering,
      severity,
      text,
      description,
      expirationTime
    }
  };
}
