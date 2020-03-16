import { create } from 'reactive-observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignal = create().emit(true);

export const getCustomDashboards = memoize(getCustomDashboardsInternal, () => '', 60000);
function getCustomDashboardsInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/custom-dashboard`
      })
    )
  );
}

export function addCustomDashboard(customDashboard) {
  return createObservable(
    http({
      method: 'POST',
      maxRetries: 3,
      url: `/api/custom-dashboard`,
      headers: getCsrfHeader(),
      data: customDashboard
    }).map(res => {
      if (res?.body?.id) {
        refreshSignal.emit(res.body.id);
      }
      return res;
    })
  );
}

export const getCustomDashboard = memoize(getCustomDashboardInternal, customDashboardId => customDashboardId, 60000);
function getCustomDashboardInternal(customDashboardId) {
  return refreshSignal
    .startWith(customDashboardId)
    .filter(id => id === customDashboardId)
    .flatMap(() =>
      createObservable(
        http({
          method: 'GET',
          maxRetries: 3,
          url: `/api/custom-dashboard/${encodeURIComponent(customDashboardId)}`,
          headers: getCsrfHeader()
        })
      )
    );
}

export function updateCustomDashboard(customDashboard) {
  return createObservable(
    http({
      method: 'PUT',
      maxRetries: 3,
      url: `/api/custom-dashboard/${encodeURIComponent(customDashboard.id)}`,
      headers: getCsrfHeader(),
      data: customDashboard
    }).map(v => {
      refreshSignal.emit(customDashboard.id);
      return v;
    })
  );
}

export function removeCustomDashboard(id) {
  return createObservable(
    http({
      method: 'DELETE',
      maxRetries: 3,
      url: `/api/custom-dashboard/${encodeURIComponent(id)}`,
      headers: getCsrfHeader()
    }).map(v => {
      refreshSignal.emit(id);
      return v;
    })
  );
}
