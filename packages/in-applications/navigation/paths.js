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
  subtraceId as matrixSubtraceId,
  facetedSearchMatrixParameter,
  hiddenCallsMatrixParameter,
  hasHttpType as matrixHasHttpType,
  plugin as matrixPlugin,
  fastQueryModeEnabledMatrixParameter,
  serviceId as matrixServiceId,
  serviceListPrefix as serviceListMatrixPrefix,
  snapshotId as matrixSnapshotId,
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
  SUBTRACE,
  entityTypes,
  operators,
  SERVICE
} from 'in-analyze/applicationFilter';
import { categoryGlobal, categoryLocal } from 'in-alerting/smart-alerts/components/list/constants';
import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { setOrDeleteMatrixKey, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { sanitizeTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import { getTagFilterToUrlString } from 'in-analyze/filterBuilder';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
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

export const subtracesList = '/subtraces';
export const subtraceDashboard = '/subtrace';
export const subtraceConfigurationFullyQualified = `${subtraceDashboard}/configuration`;

export const summaryTab = '/summary';
export const dependencyMapTab = '/map';
export const errorMessagesTab = '/errorMessages';
export const logMessagesTab = '/logMessages';
export const syntheticsTab = '/synthetics';
export const smartAlertsTab = '/alerts';
export const configurationTab = '/configuration';
export const endpointsTab = '/endpoints';
export const resourceOptimizationsTab = '/resourceOptimizations';

export const alertsTab = '/alerts';
export const alertsTabListFullyQualified = `${applicationDashboard}${alertsTab}`;
export const alertsTabDetailsFullyQualified = `${alertsTabListFullyQualified}/details`;
export const alertsTabDetails = `${alertsTab}/details`;

export const smartAlertPath = '/applicationSmartalerts';

export const analyzePath = '/analyze';

export const analyzeTwoParameters = createParameters(analyzePath);

// tagCatalog - if specified, the formModel will be reset if any of its tags is not available in the tag catalog
// setOnClickNotificationMessage - an optional callback which takes a string used to display a notification message on link click
export function useLinkToAnalyze() {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({
      applicationName,
      serviceName,
      endpointName,
      subtraceName,
      subtraceId,
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
    }) => {
      const clonedLocation = cloneLocation(location);
      clonedLocation.pathname = analyzePath;

      updateLocationToAnalyze(clonedLocation, {
        applicationName,
        serviceName,
        endpointName,
        subtraceName,
        subtraceId,
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

      return createHref(clonedLocation);
    },
    [location, createHref]
  );
}

export function updateLocationToAnalyze(
  location,
  {
    applicationName,
    serviceName,
    endpointName,
    subtraceName,
    subtraceId,
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

  if (subtraceName != null) {
    extendingFormModel = joinExpressions({
      expressions: [
        extendingFormModel,
        {
          type: TAG_FILTER,
          name: SUBTRACE.name,
          value: subtraceName,
          operator: operators.EQUALS,
          entity: entityTypes.NOT_APPLICABLE
        }
      ]
    });
  }
  if (subtraceId != null) {
    extendingFormModel = joinExpressions({
      expressions: [
        extendingFormModel,
        {
          type: TAG_FILTER,
          name: SUBTRACE.id,
          value: subtraceId,
          operator: operators.EQUALS
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
  alertsList,
  smartAlertPath
);

function useLinkToList(pathName, keyPrefix) {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({ timeConfig, applicationId, serviceId, endpointId, contextScope, tagFilters, snapshotId, plugin }) => {
      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = pathName;
      let tagFilter = null;

      setOrDeleteMatrixKey(clonedLocation, pathName, keyPrefix + matrixApplicationId, applicationId);
      setOrDeleteMatrixKey(clonedLocation, pathName, keyPrefix + matrixServiceId, serviceId);
      setOrDeleteMatrixKey(clonedLocation, pathName, keyPrefix + matrixEndpointId, endpointId);
      setOrDeleteMatrixKey(clonedLocation, pathName, keyPrefix + matrixContextScope, contextScope);
      setOrDeleteMatrixKey(clonedLocation, pathName, keyPrefix + matrixSnapshotId, snapshotId);
      setOrDeleteMatrixKey(clonedLocation, pathName, keyPrefix + matrixPlugin, plugin);

      if (timeConfig != null) {
        setTimeConfig(clonedLocation, timeConfig);
      }

      if (tagFilters) {
        tagFilter = tagFilter || [];
        tagFilter.push(...tagFilters);
      }

      if (tagFilter != null) {
        setOrDeleteMatrixKey(
          clonedLocation,
          pathName,
          keyPrefix + tagFiltersMatrixParam,
          getTagFilterToUrlString(tagFilter)
        );
      }

      return createHref(clonedLocation);
    },
    [location, createHref, pathName, keyPrefix]
  );
}

export function useLinkToApplicationList() {
  return useLinkToList(applicationsList, applicationListMatrixPrefix);
}

export function useLinkToServiceList() {
  return useLinkToList(servicesList, serviceListMatrixPrefix);
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

export function useLinkToSubtraceDashboard() {
  return useDashboard(subtraceDashboard);
}

function useDashboard(base) {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({
      applicationId,
      serviceId,
      endpointId,
      subtraceId,
      boundaryScope,
      tab = summaryTab,
      tabMatrix = {},
      timeConfig
    }) => {
      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = `${base}${tab}`;
      setOrDeleteMatrixKey(clonedLocation, base, matrixApplicationId, applicationId);
      setOrDeleteMatrixKey(clonedLocation, base, matrixServiceId, serviceId);
      setOrDeleteMatrixKey(clonedLocation, base, matrixEndpointId, endpointId);
      setOrDeleteMatrixKey(clonedLocation, base, matrixSubtraceId, subtraceId);
      setOrDeleteMatrixKey(clonedLocation, base, matrixBoundaryScope, boundaryScope);

      if (timeConfig != null) {
        setTimeConfig(clonedLocation, timeConfig);
      }

      clonedLocation.matrix[tab] = tabMatrix;

      return createHref(clonedLocation);
    },
    [base, location, createHref]
  );
}

export const useLinkToEndpointConfiguration = () => {
  const { location, createHref } = useNavigation();

  return hasHttpType => {
    location.pathname = configureEndpointsView;
    setOrDeleteMatrixKey(location, endpointsTab, matrixHasHttpType, hasHttpType);

    return createHref(location);
  };
};

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

export function useNavigationToGlobalAlertConfigWithoutAPDashboard() {
  const { location, navigate } = useNavigation();

  return alertConfigId => {
    location.pathname = globalAlertDetails;
    fillAlertTabSpecificValues(location, null, alertConfigId, null);
    setOrDeleteMatrixKey(location, alertsTab, alertsCategoryMatrixParam, categoryGlobal);

    navigate(location);
  };
}

export function useNavigationToAlertConfig() {
  const { location, navigate } = useNavigation();

  return (alertConfigId, alertConfigVersion, applicationId) => {
    location.pathname = alertsTabDetailsFullyQualified;
    fillAlertTabSpecificValues(location, applicationId, alertConfigId, alertConfigVersion);
    setOrDeleteMatrixKey(location, alertsTab, alertsCategoryMatrixParam, categoryLocal);

    navigate(location);
  };
}

export function useLinkToUngroupedView() {
  const { location, createHref } = useNavigation();
  setOrDeleteMatrixKey(location, analyzePath, 'detailId');
  return createHref(location);
}
