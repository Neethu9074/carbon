import { navigationParameters$, mutateUrl, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export const homePath = '/';
export const agentsPath = '/agents';
export const applicationsPath = '/application';
export const asciiContainerPath = '/ascii/container';
export const asciiLogicalPath = '/ascii/logical';
export const asciiPhysicalPath = '/ascii/physical';
export const cockpitPath = '/cockpit';
export const settingsPath = '/config';
export const containerPath = '/container';
export const eventsPath = '/events';
export const graphPath = '/graph';
export const logicalPath = '/logical';
export const physicalPath = '/physical';
export const tablePath = '/table';
export const physicalTablePath = '/table;view=physical;plugin=host';
export const logicalTablePath = '/table;view=logical;plugin=service';
export const tracesPath = '/traces';
export const websitePath = '/website';
export const newWebsitePath = '/website/new';

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
