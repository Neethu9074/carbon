/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useCallback } from 'react';

import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam,
  alertsCategory as alertsCategoryMatrixParam,
  applicationId as applicationIdMatrixParam,
  applicationId as matrixApplicationId,
  applicationListPrefix as applicationListMatrixPrefix,
  boundaryScope as matrixBoundaryScope,
  contextScope as matrixContextScope,
  dataSourceMatrixParameter,
  endpointId as matrixEndpointId,
  facetedSearchMatrixParameter,
  hiddenCallsMatrixParameter,
  plugin as matrixPlugin,
  fastQueryModeEnabledMatrixParameter,
  serviceId as matrixServiceId,
  serviceListPrefix as serviceListMatrixPrefix,
  snapshotId as matrixSnapshotId,
  syntheticCalls as matrixSyntheticCalls,
  tagFilters as tagFiltersMatrixParam
} from 'in-applications/navigation/matrix';
import {
  CLOSE_BRACKET as CLOSE_BRACKET_TYPE,
  CONJUNCTION as CONJUNCTION_TYPE,
  joinExpressions,
  OPEN_BRACKET as OPEN_BRACKET_TYPE,
  TAG as TAG_FILTER
} from 'in-components/QueryBuilder/transformation/formModel';
import {
  APPLICATION,
  APPLICATION_INBOUND,
  ENDPOINT,
  entityTypes,
  operators,
  SERVICE
} from 'in-analyze/applicationFilter';
import { categoryGlobal, categoryLocal } from 'in-alerting/smart-alerts/applications/list/constants';
import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { setOrDeleteMatrixKey, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { sanitizeTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { getTagFilterToUrlString } from 'in-analyze/filterBuilder';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import { boundaryScopes } from 'in-applications/constants';
import { emptyArray } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export const applicationsList = '/applications';
export const applicationDashboard = '/application';
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
export const dependencyMapTab = '/map';
export const errorMessagesTab = '/errorMessages';
export const logMessagesTab = '/logMessages';
export const syntheticsTab = '/synthetics';
export const smartAlertsTab = '/alerts';
export const configurationTab = '/configuration';

export const alertsTab = '/alerts';
export const alertsTabListFullyQualified = `${applicationDashboard}${alertsTab}`;
export const alertsTabDetailsFullyQualified = `${alertsTabListFullyQualified}/details`;

export const analyzePath = '/analyze';

export const analyzeTwoParameters = createParameters(analyzePath);

// tagCatalog - if specified, the formModel will be reset if any of its tags is not available in the tag catalog
// setOnClickNotificationMessage - an optional callback which takes a string used to display a notification message on link click
export function getLinkToAnalyze({
  applicationName,
  serviceName,
  endpointName,
  boundaryScope,
  contextScope,
  jumpToSource,
  dataSource,
  groupBy,
  orderBy,
  orderByGroups,
  formModel,
  facets,
  hiddenCalls,
  chartedMetrics,
  fields,
  fastQueryModeEnabled,
  timeConfig,
  tagCatalog,
  setOnClickNotificationMessage,
  resetUndefinedParams
}) {
  return getModifiedUrlStream(params => {
    params.pathname = analyzePath;
    return updateLocationToAnalyze(params, {
      applicationName,
      serviceName,
      endpointName,
      boundaryScope,
      contextScope,
      jumpToSource,
      dataSource,
      groupBy,
      orderBy,
      orderByGroups,
      formModel,
      facets,
      hiddenCalls,
      chartedMetrics,
      fields,
      fastQueryModeEnabled,
      timeConfig,
      tagCatalog,
      setOnClickNotificationMessage,
      resetUndefinedParams
    });
  });
}

export function updateLocationToAnalyze(
  location,
  {
    applicationName,
    serviceName,
    endpointName,
    boundaryScope = boundaryScopes.inbound,
    contextScope,
    jumpToSource,
    dataSource = 'calls',
    groupBy,
    orderBy,
    orderByGroups,
    formModel,
    facets,
    hiddenCalls,
    chartedMetrics,
    fields,
    fastQueryModeEnabled,
    timeConfig,
    tagCatalog,
    setOnClickNotificationMessage,
    resetUndefinedParams = true
  }
) {
  setOrDeleteMatrixParameter(location, dataSourceMatrixParameter, dataSource);
  if (resetUndefinedParams || groupBy !== undefined) {
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.groupBy, groupBy?.groupbyTag ? groupBy : null);
  }
  if (resetUndefinedParams || orderBy !== undefined) {
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderBy, orderBy?.by ? orderBy : null);
  }
  if (resetUndefinedParams || orderByGroups !== undefined) {
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderByGroups, orderByGroups?.by ? orderByGroups : null);
  }
  if (resetUndefinedParams || fields !== undefined) {
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.fields, fields);
  }
  if (resetUndefinedParams || chartedMetrics !== undefined) {
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.chartedMetrics, chartedMetrics);
  }
  if (resetUndefinedParams || hiddenCalls !== undefined) {
    setOrDeleteMatrixParameter(location, hiddenCallsMatrixParameter, hiddenCalls);
  }
  if (resetUndefinedParams || fastQueryModeEnabled !== undefined) {
    setOrDeleteMatrixParameter(location, fastQueryModeEnabledMatrixParameter, fastQueryModeEnabled);
  }
  if (resetUndefinedParams || facets !== undefined) {
    setOrDeleteMatrixParameter(location, facetedSearchMatrixParameter, facets);
  }

  setOrDeleteMatrixParameter(location, analyzeTwoParameters.detailId, null);

  if (timeConfig) {
    setTimeConfig(location, timeConfig);
  }

  let extendingFormModel = [];
  if (applicationName != null) {
    //boundary scope is ignored when context scope is present
    const applicationFilter =
      boundaryScope === boundaryScopes.inbound && !contextScope
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
            entity: contextScope === 'DOWNSTREAM' ? entityTypes.SOURCE : entityTypes.DESTINATION
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
          entity: contextScope === 'DOWNSTREAM' ? entityTypes.SOURCE : entityTypes.DESTINATION
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

  if (resetUndefinedParams || formModel !== undefined || extendingFormModel.length > 0) {
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

    // Trace view only supports AND conjunction. When switching from calls to traces while preserving
    // filters, trace filters are sanitized to only contain valid conjunctions
    if (updatedFormModel != null && dataSource === 'traces') {
      if (updatedFormModel.some(element => element.type === CONJUNCTION_TYPE && element.logicalOperator === or)) {
        updatedFormModel = null;
        setOnClickNotificationMessage?.(
          t('in-applications:analyze.resetUnsupportedTracesFilterContainingOrConjunction')
        );
      } else {
        updatedFormModel = updatedFormModel.filter(
          element => !(element.type === OPEN_BRACKET_TYPE || element.type === CLOSE_BRACKET_TYPE)
        );
      }
    }

    // sanitize all tag filters passed in the formModel, so that the caller doesn't have to care about it
    updatedFormModel = updatedFormModel?.map(element =>
      element.type === TAG_FILTER ? sanitizeTagFilter(element) : element
    );

    updatedFormModel = joinExpressions({ expressions: [extendingFormModel, updatedFormModel ?? emptyArray] });
    setOrDeleteMatrixParameter(
      location,
      analyzeTwoParameters.tagFilterExpression,
      updatedFormModel.length > 0 ? updatedFormModel : null
    );
  }
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

export function useLinkToApplicationDashboard() {
  return useDashboard(applicationDashboard);
}

export function useLinkToServiceDashboard() {
  return useDashboard(serviceDashboard);
}

export function useLinkToEndpointDashboard() {
  return useDashboard(endpointDashboard);
}

function useDashboard(base) {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({
      applicationId,
      serviceId,
      endpointId,
      boundaryScope,
      syntheticCalls,
      tab = summaryTab,
      tabMatrix = {},
      timeConfig
    }) => {
      location.pathname = `${base}${tab}`;
      setOrDeleteMatrixKey(location, base, matrixApplicationId, applicationId);
      setOrDeleteMatrixKey(location, base, matrixServiceId, serviceId);
      setOrDeleteMatrixKey(location, base, matrixEndpointId, endpointId);
      setOrDeleteMatrixKey(location, base, matrixBoundaryScope, boundaryScope);

      if (syntheticCallsEnabled) {
        setOrDeleteMatrixKey(location, base, matrixSyntheticCalls, syntheticCalls);
      }

      if (timeConfig != null) {
        setTimeConfig(location, timeConfig);
      }

      location.matrix[tab] = tabMatrix;

      return createHref(location);
    },
    [base, location, createHref]
  );
}

export function useLinkToAlertConfig() {
  const { location, createHref } = useNavigation();

  return (alertConfigId, alertConfigVersion, applicationId) => {
    location.pathname = alertsTabDetailsFullyQualified;
    fillAlertTabSpecificValues(location, applicationId, alertConfigId, alertConfigVersion);
    setOrDeleteMatrixKey(location, alertsTab, alertsCategoryMatrixParam, categoryLocal);

    return createHref(location);
  };
}

export function useLinkToGlobalAlertConfigWithAPDashboard() {
  const { location, createHref } = useNavigation();

  return (alertConfigId, alertConfigVersion, applicationId) => {
    location.pathname = alertsTabDetailsFullyQualified;
    fillAlertTabSpecificValues(location, applicationId, alertConfigId, alertConfigVersion);
    setOrDeleteMatrixKey(location, alertsTab, alertsCategoryMatrixParam, categoryGlobal);

    return createHref(location);
  };
}

export function useAlertConfig() {
  const { location, createHref } = useNavigation();

  return (alertConfigId, applicationId) => {
    location.pathname = alertsTabDetailsFullyQualified;
    fillAlertTabSpecificValues(location, applicationId, alertConfigId, null);

    return createHref(location);
  };
}

export function useLinkToGlobalAlertConfigWithoutAPDashboard() {
  const { location, createHref } = useNavigation();

  return alertConfigId => {
    location.pathname = globalAlertDetails;
    fillAlertTabSpecificValues(location, null, alertConfigId, null);
    setOrDeleteMatrixKey(location, alertsTab, alertsCategoryMatrixParam, categoryGlobal);

    return createHref(location);
  };
}

function fillAlertTabSpecificValues(params, applicationId, alertConfigId, alertConfigVersion) {
  setOrDeleteMatrixKey(params, applicationDashboard, applicationIdMatrixParam, applicationId);
  setOrDeleteMatrixKey(params, alertsTab, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(params, alertsTab, alertCreatedMatrixParam, alertConfigVersion);
}
