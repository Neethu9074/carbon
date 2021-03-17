/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  applicationId as matrixApplicationId,
  serviceId as matrixServiceId,
  endpointId as matrixEndpointId,
  boundaryScope as matrixBoundaryScope,
  syntheticCalls as matrixSyntheticCalls,
  contextScope as matrixContextScope,
  applicationId as applicationIdMatrixParam,
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam,
  serviceListPrefix as serviceListMatrixPrefix,
  applicationListPrefix as applicationListMatrixPrefix,
  tagFilters as tagFiltersMatrixParam,
  snapshotId as matrixSnapshotId,
  plugin as matrixPlugin
} from 'in-applications/navigation/matrix';
import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
import { getTagFilterToUrlString } from 'in-analyze/filterBuilder';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const applicationsList = '/applications';
export const applicationDashboard = '/application';
export const newApplicationView = '/application/new';
export const newApplicationWaiterView = '/application/waiter';

export const globalAlertsList = '/applicationAlerts';

export const servicesList = '/services';
export const newServiceView = '/services/configure/new';
export const configureSyntheticEndpointsView = '/services/configure/syntheticEndpoints';
export const serviceDashboard = '/service';
export const endpointDashboard = '/endpoint';
export const configureEndpointsView = '/service/endpoints/configure';

export const summaryTab = '/summary';
export const errorMessagesTab = '/errorMessages';
export const logMessagesTab = '/logMessages';

export const alertsTab = '/alerts';
export const alertsTabListFullyQualified = `${applicationDashboard}${alertsTab}`;
export const alertsTabDetailsFullyQualified = `${alertsTabListFullyQualified}/details`;

export const isApplicationsView = getRootPathPredicate(
  applicationsList,
  applicationDashboard,
  servicesList,
  serviceDashboard,
  endpointDashboard,
  globalAlertsList
);

export function getApplicationList({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  contextScope,
  tagFilters,
  snapshotId,
  plugin
}) {
  return getModifiedUrlStream(params => {
    params.pathname = applicationsList;
    let tagFilter = null;

    setOrDeleteMatrixKey(params, applicationsList, applicationListMatrixPrefix + matrixApplicationId, applicationId);
    setOrDeleteMatrixKey(params, applicationsList, applicationListMatrixPrefix + matrixServiceId, serviceId);
    setOrDeleteMatrixKey(params, applicationsList, applicationListMatrixPrefix + matrixEndpointId, endpointId);
    setOrDeleteMatrixKey(params, applicationsList, applicationListMatrixPrefix + matrixContextScope, contextScope);
    setOrDeleteMatrixKey(params, applicationsList, applicationListMatrixPrefix + matrixSnapshotId, snapshotId);
    setOrDeleteMatrixKey(params, applicationsList, applicationListMatrixPrefix + matrixPlugin, plugin);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    if (tagFilters) {
      tagFilter = tagFilter || [];
      tagFilter.push(...tagFilters);
    }

    if (tagFilter != null) {
      setOrDeleteMatrixKey(
        params,
        applicationsList,
        applicationListMatrixPrefix + tagFiltersMatrixParam,
        getTagFilterToUrlString(tagFilter)
      );
    }
  });
}

export function getServiceList({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  contextScope,
  tagFilters,
  snapshotId,
  plugin
}) {
  return getModifiedUrlStream(params => {
    params.pathname = servicesList;
    let tagFilter = null;

    setOrDeleteMatrixKey(params, servicesList, serviceListMatrixPrefix + matrixApplicationId, applicationId);
    setOrDeleteMatrixKey(params, servicesList, serviceListMatrixPrefix + matrixServiceId, serviceId);
    setOrDeleteMatrixKey(params, servicesList, serviceListMatrixPrefix + matrixEndpointId, endpointId);
    setOrDeleteMatrixKey(params, servicesList, serviceListMatrixPrefix + matrixContextScope, contextScope);
    setOrDeleteMatrixKey(params, servicesList, serviceListMatrixPrefix + matrixSnapshotId, snapshotId);
    setOrDeleteMatrixKey(params, servicesList, serviceListMatrixPrefix + matrixPlugin, plugin);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    if (tagFilters) {
      tagFilter = tagFilter || [];
      tagFilter.push(...tagFilters);
    }

    if (tagFilter != null) {
      setOrDeleteMatrixKey(
        params,
        servicesList,
        serviceListMatrixPrefix + tagFiltersMatrixParam,
        getTagFilterToUrlString(tagFilter)
      );
    }
  });
}

export function getApplicationDashboard(
  applicationId,
  { serviceId, endpointId, boundaryScope, tab, tabMatrix, timeConfig, syntheticCalls } = emptyObject
) {
  return getDashboard({
    base: applicationDashboard,
    applicationId,
    serviceId,
    endpointId,
    boundaryScope,
    tab,
    tabMatrix,
    timeConfig,
    syntheticCalls
  });
}

export function getServiceDashboard(
  serviceId,
  { applicationId, endpointId, boundaryScope, tab, tabMatrix, timeConfig, syntheticCalls } = emptyObject
) {
  return getDashboard({
    base: serviceDashboard,
    applicationId,
    serviceId,
    endpointId,
    boundaryScope,
    tab,
    tabMatrix,
    timeConfig,
    syntheticCalls
  });
}

export function getEndpointDashboard(
  endpointId,
  { applicationId, serviceId, boundaryScope, syntheticCalls, tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
    base: endpointDashboard,
    applicationId,
    endpointId,
    serviceId,
    boundaryScope,
    syntheticCalls,
    tab,
    tabMatrix,
    timeConfig
  });
}

function getDashboard({
  base,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  syntheticCalls,
  tab = summaryTab,
  tabMatrix = {},
  timeConfig
}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${base}${tab}`;
    setOrDeleteMatrixKey(params, base, matrixApplicationId, applicationId);
    setOrDeleteMatrixKey(params, base, matrixServiceId, serviceId);
    setOrDeleteMatrixKey(params, base, matrixEndpointId, endpointId);
    setOrDeleteMatrixKey(params, base, matrixBoundaryScope, boundaryScope);

    if (syntheticCallsEnabled) {
      setOrDeleteMatrixKey(params, base, matrixSyntheticCalls, syntheticCalls);
    }

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    params.matrix[tab] = tabMatrix;
  });
}

export function goToAlertConfig(alertConfigId, alertConfigVersion, applicationId) {
  mutateUrl(location => {
    fillAlertTabSpecificValues(location, applicationId, alertConfigId, alertConfigVersion);
  });
}

export function getAlertConfig(alertConfigId, applicationId) {
  return getModifiedUrlStream(params => {
    fillAlertTabSpecificValues(params, applicationId, alertConfigId, null);
  });
}

function fillAlertTabSpecificValues(params, applicationId, alertConfigId, alertConfigVersion) {
  params.pathname = alertsTabDetailsFullyQualified;
  setOrDeleteMatrixKey(params, applicationDashboard, applicationIdMatrixParam, applicationId);
  setOrDeleteMatrixKey(params, alertsTab, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(params, alertsTab, alertCreatedMatrixParam, alertConfigVersion);
}
