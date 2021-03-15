/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cockpit } from 'in-cockpit/navigation/paths';

export const customDashboardsPath = '/customDashboards';

export const listPath = '/list';
export const listPathFullyQualified = `${customDashboardsPath}${listPath}`;

export const viewPath = '/view';
export const viewPathFullyQualified = `${customDashboardsPath}${viewPath}`;
export const dashboardIdUrlParameter = {
  path: viewPath,
  name: 'dashboardId'
};
export const dashboardTvModeUrlParameter = {
  path: viewPath,
  name: 'tvMode'
};

export function goToCustomDashboardList() {
  mutateUrl(params => {
    params.pathname = cockpit;
  });
}

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
