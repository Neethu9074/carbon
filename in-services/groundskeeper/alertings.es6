import {fromJS} from 'immutable';

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
    data: {
      id: alert.get('id'),
      name: alert.get('name')
    }
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
