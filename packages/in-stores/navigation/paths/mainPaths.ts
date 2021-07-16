/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { navigationParameters$, mutateUrl, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export const homePath = '/';
export const agentsPath = '/agents';
export const settingsPath = '/config';
export const containerPath = '/container';
export const graphPath = '/graph';
export const physicalPath = '/physical';
export const physicalDashboardPath = `${physicalPath}/dashboard`;
export const tablePath = '/table';
export const physicalTablePath = '/table;view=physical;plugin=host';

export function getLinkToCurrentViewWithViewGrouping(view, vg) {
  return getModifiedUrlStream(params => (params.query[view] = vg));
}

export function setCurrentViewWithViewGrouping(view, vg) {
  mutateUrl(params => {
    delete params.query[view];
    params.query[view] = vg;
    return params;
  });
}

export function getActiveView(params) {
  return params.pathname.replace(/\/dashboard($|\/.*)/, '').replace(/^\//, '');
}

export function isTableView(type) {
  return navigationParameters$.map(params => getMatrixParameter(params, tablePath, 'view') === type).distinct();
}

export function isInfrastructurePath(path) {
  return path.indexOf(physicalPath) === 0 || path.indexOf(tablePath) === 0 || path.indexOf(containerPath) === 0;
}
