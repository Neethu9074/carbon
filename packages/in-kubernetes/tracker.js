import { track, KUBERNETES_DASHBOARD_TAB_CHANGE } from 'in-services/tracking/tracking';

export const clusterTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'cluster' });
};

export const deploymentTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'deployment' });
};

export const deploymentConfigTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'deploymentConfig' });
};

export const daemonSetTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'daemonSet' });
};

export const statefulSetTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'statefulSet' });
};

export const namespaceTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'namespace' });
};

export const nodeTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'node' });
};

export const cronJobTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'cronJob' });
};

export const podTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'pod' });
};

export const serviceTabChange = e => {
  track(KUBERNETES_DASHBOARD_TAB_CHANGE, { ...e, dashboard: 'service' });
};
