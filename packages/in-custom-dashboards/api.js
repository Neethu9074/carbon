import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

// We memoize the get API calls so that development of the views is easy. In order to trigger
// a cache invalidation of the memoization logic we raise the mutationCounter when a custom
// dashboard is added, updated or removed.
let mutationCounter = 0;

export const getCustomDashboards = memoize(getCustomDashboardsInternal, () => String(mutationCounter), 3000);
function getCustomDashboardsInternal() {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: `/api/custom-dashboard`
    })
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
    }).map(v => {
      mutationCounter++;
      return v;
    })
  );
}

export const getCustomDashboard = memoize(
  getCustomDashboardInternal,
  customDashboardId => customDashboardId + '$' + mutationCounter,
  3000
);
function getCustomDashboardInternal(customDashboardId) {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: `/api/custom-dashboard/${encodeURIComponent(customDashboardId)}`,
      headers: getCsrfHeader()
    })
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
      mutationCounter++;
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
      mutationCounter++;
      return v;
    })
  );
}
