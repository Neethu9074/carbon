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
  plugin as matrixPlugin,
  alertsCategory as alertsCategoryMatrixParam,
  dataSourceMatrixParameter,
  previewEnabledMatrixParameter,
  hiddenCallsMatrixParameter
} from 'in-applications/navigation/matrix';
import { sanitizeTagFilter, type as TAG_FILTER } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { categoryGlobal, categoryLocal } from 'in-alerting/smart-alerts/applications/inventory/constants';
import { APPLICATION, APPLICATION_INBOUND, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { setOrDeleteMatrixKey, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
import { createParameters } from 'in-new-components/AnalyzeView/parameters';
import { entityTypes, operators } from 'in-analyze/applicationFilter';
import { getTagFilterToUrlString } from 'in-analyze/filterBuilder';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import { boundaryScopes } from 'in-applications/constants';
import { setTimeConfig } from 'in-stores/time/config';

export const applicationsList = '/applications';
export const applicationDashboard = '/application';
export const newApplicationView = '/application/new';
export const newApplicationWaiterView = '/application/waiter';

export const alertsList = '/alerts';
export const globalAlertDetails = `${alertsList}/details`;

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

export const analyzePath = '/analyze';

export const analyzeTwoParameters = createParameters(analyzePath);

// tagCatalog - if specified, the formModel will be reset if any of its tags is not available in the tag catalog
export function getLinkToAnalyze({
  applicationName,
  serviceName,
  endpointName,
  boundaryScope = boundaryScopes.inbound,
  jumpToSource,
  dataSource = 'calls',
  groupBy,
  orderBy,
  orderByGroups,
  formModel,
  hiddenCalls,
  chartedMetrics,
  fields,
  previewEnabled,
  timeConfig,
  tagCatalog
}) {
  return getModifiedUrlStream(params => {
    params.pathname = analyzePath;

    setOrDeleteMatrixParameter(params, dataSourceMatrixParameter, dataSource);
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.groupBy, groupBy?.groupbyTag ? groupBy : null);
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.orderBy, orderBy?.by ? orderBy : null);
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.orderByGroups, orderByGroups?.by ? orderByGroups : null);
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.fields, fields);
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.chartedMetrics, chartedMetrics);
    setOrDeleteMatrixParameter(params, hiddenCallsMatrixParameter, hiddenCalls);
    setOrDeleteMatrixParameter(params, previewEnabledMatrixParameter, previewEnabled);

    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }

    let extendingFormModel = [];
    if (applicationName != null) {
      const applicationFilter =
        boundaryScope === boundaryScopes.inbound
          ? {
              type: TAG_FILTER,
              name: APPLICATION_INBOUND.name,
              value: applicationName,
              operator: operators.EQUALS
            }
          : {
              type: TAG_FILTER,
              name: APPLICATION.name,
              value: applicationName,
              operator: operators.EQUALS,
              entity: entityTypes.DESTINATION
            };
      extendingFormModel = joinExpressions({ expressions: [extendingFormModel, applicationFilter] });
    }
    if (serviceName != null) {
      extendingFormModel = joinExpressions({
        expressions: [
          extendingFormModel,
          {
            type: TAG_FILTER,
            name: SERVICE.name,
            value: serviceName,
            operator: operators.EQUALS,
            entity: entityTypes.DESTINATION
          }
        ]
      });
    }
    if (endpointName != null) {
      extendingFormModel = joinExpressions({
        expressions: [
          extendingFormModel,
          {
            type: TAG_FILTER,
            name: ENDPOINT.name,
            value: endpointName,
            operator: operators.EQUALS,
            entity: entityTypes.DESTINATION
          }
        ]
      });
    }
    if (jumpToSource) {
      if (jumpToSource === 'application') {
        extendingFormModel = [
          {
            type: TAG_FILTER,
            name: APPLICATION.name,
            value: applicationName,
            operator: operators.EQUALS,
            entity: entityTypes.SOURCE
          }
        ];
      }
      if (jumpToSource === 'service') {
        extendingFormModel = [
          {
            type: TAG_FILTER,
            name: SERVICE.name,
            value: serviceName,
            operator: operators.EQUALS,
            entity: entityTypes.SOURCE
          }
        ];
      }
      if (jumpToSource === 'endpoint') {
        extendingFormModel = [
          {
            type: TAG_FILTER,
            name: ENDPOINT.name,
            value: endpointName,
            operator: operators.EQUALS,
            entity: entityTypes.SOURCE
          }
        ];
      }
    }

    let updatedFormModel = formModel;
    if (tagCatalog && formModel?.length > 0) {
      const availableTags = tagCatalog.tags.map(t => t.name);
      const allTagsSupported = formModel
        .filter(element => element.type === TAG_FILTER)
        .every(tagFilter => availableTags.includes(tagFilter.name));
      if (!allTagsSupported) {
        // reset the provided formModel if it includes unsupported tags
        updatedFormModel = null;
      }
    }
    // sanitize all tag filters passed in the formModel, so that the caller doesn't have to care about it
    updatedFormModel = updatedFormModel?.map(element =>
      element.type === TAG_FILTER ? sanitizeTagFilter(element) : element
    );

    updatedFormModel = joinExpressions({ expressions: [extendingFormModel, updatedFormModel ?? emptyArray] });
    setOrDeleteMatrixParameter(
      params,
      analyzeTwoParameters.tagFilterExpression,
      updatedFormModel.length > 0 ? updatedFormModel : null
    );
  });
}

export const isApplicationsView = getRootPathPredicate(
  applicationsList,
  applicationDashboard,
  servicesList,
  serviceDashboard,
  endpointDashboard,
  alertsList
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
    setOrDeleteMatrixKey(location, alertsTab, alertsCategoryMatrixParam, categoryLocal);
  });
}

export function goToGlobalAlertConfig(alertConfigId, alertConfigVersion, applicationId) {
  mutateUrl(location => {
    fillAlertTabSpecificValues(location, applicationId, alertConfigId, alertConfigVersion);
    setOrDeleteMatrixKey(location, alertsTab, alertsCategoryMatrixParam, categoryGlobal);
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
