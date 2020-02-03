import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
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

export function getCustomDashboardLink(customDashboardId) {
  return getModifiedUrlStream(params => {
    params.pathname = viewPathFullyQualified;
    setOrDeleteMatrixKey(params, dashboardIdUrlParameter.path, dashboardIdUrlParameter.name, customDashboardId);
  });
}

export function getNewCustomDashboardLink() {
  return getModifiedUrlStream(params => {
    params.pathname = newPathFullyQualified;
  });
}
