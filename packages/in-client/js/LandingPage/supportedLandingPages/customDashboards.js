import { viewPathFullyQualified, dashboardIdUrlParameter } from 'in-custom-dashboards/navigation/url';
import { setLandingPage as setLandingPageInPersistence } from 'in-client/js/LandingPage/persistence';
import { customDashboardsEnabled } from 'in-services/featureFlags';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const enabled = customDashboardsEnabled;
export const persistencePrefix = 'customDashboard:';

export function resolve(location, pageKey) {
  const customDashboardId = pageKey.substring(persistencePrefix.length);
  location.pathname = viewPathFullyQualified;
  setOrDeleteMatrixKey(location, dashboardIdUrlParameter.path, dashboardIdUrlParameter.name, customDashboardId);
}

export function setLandingPage(customDashboardId) {
  setLandingPageInPersistence(getPageKey(customDashboardId));
}

export function isLandingPage(pageKey, customDashboardId) {
  return pageKey === getPageKey(customDashboardId);
}

function getPageKey(customDashboardId) {
  return persistencePrefix + customDashboardId;
}
