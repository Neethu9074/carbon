/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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


