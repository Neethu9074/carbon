import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const customDashboardsPath = '/customDashboards';

export const listPath = '/list';
export const listPathFullyQualified = `${customDashboardsPath}${listPath}`;

export const viewPath = '/view';
export const viewPathFullyQualified = `${customDashboardsPath}${viewPath}`;
export const dashboardIdUrlParameter = {
  path: viewPath,
  name: 'dashboardId'
};

export const newPath = '/new';
export const newPathFullyQualified = `${customDashboardsPath}${newPath}`;
export const duplicationSourceIdUrlParameter = {
  path: newPath,
  name: 'sourceId'
};

export function goToCustomDashboard(customDashboardId) {
  mutateUrl(params => {
    params.pathname = viewPathFullyQualified;
    setOrDeleteMatrixKey(params, dashboardIdUrlParameter.path, dashboardIdUrlParameter.name, customDashboardId);
  });
}

export function getCustomDashboardLink(customDashboardId) {
  return getModifiedUrlStream(params => {
    params.pathname = viewPathFullyQualified;
    setOrDeleteMatrixKey(params, dashboardIdUrlParameter.path, dashboardIdUrlParameter.name, customDashboardId);
  });
}

export function getNewCustomDashboardLink(sourceId) {
  return getModifiedUrlStream(params => {
    params.pathname = newPathFullyQualified;
    setOrDeleteMatrixKey(params, duplicationSourceIdUrlParameter.path, duplicationSourceIdUrlParameter.name, sourceId);
  });
}
