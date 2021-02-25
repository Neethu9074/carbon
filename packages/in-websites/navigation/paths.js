/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import invariant from 'invariant';

import {
  websiteId as websiteIdMatrixParameter,
  pageId as pageIdMatrixParameter,
  errorId as errorIdMatrixParameter,
  resourceId as resourceIdMatrixParameter,
  xhrId as xhrIdMatrixParameter,
  customEventId as customEventIdMatrixParameter,
  tagFilters as tagFiltersMatrixParameter,
  serializeTagFilters,
  deserializeTagFilters,
  group as groupMatrixParameter,
  serializeGroup,
  beaconType as beaconTypeMatrixParameter,
  pageLoadId as pageLoadIdMatrixParameter,
  beaconId as beaconIdMatrixParameter,
  beaconTimestamp as beaconTimestampMatrixParameter,
  websiteId as websiteIdMatrixParam,
  alertId as alertIdMatrixParam,
  alertCreated as alertCreatedMatrixParam,
  serializeMetrics
} from 'in-websites/navigation/matrix';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { type as TAG_FILTER } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { setOrDeleteMatrixKey, getMatrixParameter } from 'in-stores/navigation/matrix';
import { webMobileQb2AnalyzeEnabled } from 'in-services/featureFlags';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { emptyObject } from 'in-services/fixedObjects';
import { availableFilterTags } from 'in-websites/tags';
import { setTimeConfig } from 'in-stores/time/config';

export const websiteMonitoringPath = '/websiteMonitoring';

export const websitesPath = '/websites';
export const websitesPathFullyQualified = `${websiteMonitoringPath}${websitesPath}`;

export const newWebsitePath = '/new';
export const newWebsitePathFullyQualified = `${websiteMonitoringPath}${newWebsitePath}`;

export const analyzePath = '/analyzeBeacons';
export const analyzePathFullyQualified = `${websiteMonitoringPath}${analyzePath}`;
export const isAnalyzeView = navigationParameters$.map(
  location => location.pathname.indexOf(analyzePathFullyQualified) === 0
);

export const pageLoadViewPath = '/pageLoad';
export const pageLoadViewPathFullyQualified = `${analyzePathFullyQualified}${pageLoadViewPath}`;
export const closePageLoadViewLink = getModifiedUrlStream(params => (params.pathname = analyzePathFullyQualified));

export const detailsPath = '/details';
export const websitePath = '/website';
export const websitePathFullyQualified = `${websiteMonitoringPath}${websitePath}`;
export const summaryTab = '/summary';
export const speedTab = '/speed';
export const errorsTab = '/errors';
export const errorsTabFullyQualified = `${websitePathFullyQualified}${errorsTab}`;
export const resourcesTab = '/resources';
export const resourcesTabFullyQualified = `${websitePathFullyQualified}${resourcesTab}`;
export const ajaxTab = '/ajax';
export const ajaxTabFullyQualified = `${websitePathFullyQualified}${ajaxTab}`;
export const usersTab = '/users';
export const usersTabFullyQualified = `${websitePathFullyQualified}${usersTab}`;
export const customEventsTab = '/customEvents';
export const customEventsTabFullyQualified = `${websitePathFullyQualified}${customEventsTab}`;
export const alertsTab = '/alerts';
export const alertsTabListFullyQualified = `${websitePathFullyQualified}${alertsTab}`;
export const alertsTabDetailsFullyQualified = `${alertsTabListFullyQualified}/details`;

export const configurationTab = '/configuration';
export const configurationTabFullyQualified = `${websitePathFullyQualified}${configurationTab}`;
export const configurationOptions = '/options';
export const configurationOptionsFullyQualified = `${configurationTabFullyQualified}${configurationOptions}`;
export const configurationJsStackTraceTranslation = '/jsStackTraceTranslation';
export const configurationJsStackTraceTranslationFullyQualified = `${configurationTabFullyQualified}${configurationJsStackTraceTranslation}`;
export const configurationAlerts = '/alerts';

export const linkToWebsites$ = getModifiedUrlStream(params => {
  params.pathname = websitesPathFullyQualified;
});

export const linkToNewWebsite$ = getModifiedUrlStream(params => {
  params.pathname = newWebsitePathFullyQualified;
});

export function getLinkToWebsite(websiteId, { tabPath = summaryTab, tabParameters, pageId, timeConfig } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${websitePathFullyQualified}${tabPath}`;
    setOrDeleteMatrixKey(params, websitePath, websiteIdMatrixParameter, websiteId);

    if (pageId !== undefined) {
      setOrDeleteMatrixKey(params, websitePath, pageIdMatrixParameter, pageId);
    }

    if (tabPath && tabParameters) {
      Object.keys(tabParameters).forEach(name => setOrDeleteMatrixKey(params, tabPath, name, tabParameters[name]));
    }

    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }
  });
}

export function getLinkToError(websiteId, { errorId, pageId } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${websitePathFullyQualified}/errors/details`;
    setOrDeleteMatrixKey(params, websitePath, websiteIdMatrixParameter, websiteId);

    if (pageId !== undefined) {
      setOrDeleteMatrixKey(params, websitePath, pageIdMatrixParameter, pageId);
    }

    setOrDeleteMatrixKey(params, '/details', errorIdMatrixParameter, errorId);
  });
}

export function getLinkToResource(websiteId, { resourceId, pageId } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${websitePathFullyQualified}/resources/details`;
    setOrDeleteMatrixKey(params, websitePath, websiteIdMatrixParameter, websiteId);

    if (pageId !== undefined) {
      setOrDeleteMatrixKey(params, websitePath, pageIdMatrixParameter, pageId);
    }

    setOrDeleteMatrixKey(params, '/details', resourceIdMatrixParameter, resourceId);
  });
}

export function getLinkToXhrRequest(websiteId, { xhrId, pageId } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${websitePathFullyQualified}/ajax/details`;
    setOrDeleteMatrixKey(params, websitePath, websiteIdMatrixParameter, websiteId);

    if (pageId !== undefined) {
      setOrDeleteMatrixKey(params, websitePath, pageIdMatrixParameter, pageId);
    }

    setOrDeleteMatrixKey(params, '/details', xhrIdMatrixParameter, xhrId);
  });
}

export function getLinkToCustomEvent(websiteId, { customEventId, pageId } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${websitePathFullyQualified}/customEvents/details`;
    setOrDeleteMatrixKey(params, websitePath, websiteIdMatrixParameter, websiteId);

    if (pageId !== undefined) {
      setOrDeleteMatrixKey(params, websitePath, pageIdMatrixParameter, pageId);
    }

    setOrDeleteMatrixKey(params, '/details', customEventIdMatrixParameter, customEventId);
  });
}

export function getLinkToAnalyze({
  tagFilters,
  group,
  formModel,
  beaconType,
  timeConfig,
  showGraph = false,
  metrics,
  focusedMetric,
  focusedMetricAggregation
}) {
  return getModifiedUrlStream(params => {
    params.pathname = analyzePathFullyQualified;
    if (__DEV__) {
      invariant(group, 'group must be defined when generating analyze links!');
      invariant(beaconType, 'beaconType must be defined when generating analyze links!');
    }
    setOrDeleteMatrixKey(params, analyzePath, groupMatrixParameter, serializeGroup(group));
    setOrDeleteMatrixKey(params, analyzePath, beaconTypeMatrixParameter, beaconType);

    const filterableTags = availableFilterTags[beaconType];

    if (webMobileQb2AnalyzeEnabled) {
      // UA2
      setOrDeleteMatrixKey(params, analyzePath, 'groupBy', serializeGroup(group));
      setOrDeleteMatrixKey(params, analyzePath, 'orderBy');
      setOrDeleteMatrixKey(params, analyzePath, 'orderByGroups');
      setOrDeleteMatrixKey(params, analyzePath, 'fields');
      if (formModel?.length > 0) {
        const isFormModelValid = formModel
          .filter(element => element.type === TAG_FILTER)
          .every(tagFilter => filterableTags.includes(tagFilter.name));
        if (!isFormModelValid) {
          // reset query builder
          setOrDeleteMatrixKey(params, analyzePath, 'tagFilterExpression');
        } else {
          setOrDeleteMatrixKey(params, analyzePath, 'tagFilterExpression', serializeTagFilters(formModel));
        }
      }
      setOrDeleteMatrixKey(params, analyzePath, 'chartedMetrics');
    } else {
      // UA1

      // reset sorting
      setOrDeleteMatrixKey(params, analyzePath, 'orderBy');
      setOrDeleteMatrixKey(params, analyzePath, 'orderDirection');

      // reset metrics
      setOrDeleteMatrixKey(params, analyzePath, 'metrics');

      if (showGraph) {
        setOrDeleteMatrixKey(params, analyzePath, 'showGraph', true);
      }

      if (metrics !== undefined) {
        setOrDeleteMatrixKey(params, analyzePath, 'metrics', serializeMetrics(metrics));
      }

      if (focusedMetric !== undefined && focusedMetricAggregation !== undefined) {
        if (focusedMetric && focusedMetricAggregation) {
          setOrDeleteMatrixKey(params, analyzePath, 'focusedMetric', `${focusedMetric}_${focusedMetricAggregation}`);
        } else {
          setOrDeleteMatrixKey(params, analyzePath, 'focusedMetric');
        }
      }

      if (tagFilters != null) {
        const onlyAllowedTagFilters = tagFilters.filter(t => filterableTags.indexOf(t.name) !== -1);
        setOrDeleteMatrixKey(
          params,
          analyzePath,
          tagFiltersMatrixParameter,
          serializeTagFilters(onlyAllowedTagFilters)
        );
      } else {
        const existingTagFiltersStr = getMatrixParameter(params, analyzePath, tagFiltersMatrixParameter);
        if (existingTagFiltersStr) {
          const existingTagFilters = deserializeTagFilters(existingTagFiltersStr);
          const onlyAllowedTagFilters = existingTagFilters.filter(t => filterableTags.indexOf(t.name) !== -1);
          setOrDeleteMatrixKey(
            params,
            analyzePath,
            tagFiltersMatrixParameter,
            serializeTagFilters(onlyAllowedTagFilters)
          );
        }
      }
    }

    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }
  });
}

export function getLinkToPageLoad({ pageLoadId, beaconId, beaconTimestamp }) {
  return getModifiedUrlStream(params => {
    params.pathname = `${pageLoadViewPathFullyQualified}/summary`;
    setOrDeleteMatrixKey(params, pageLoadViewPath, pageLoadIdMatrixParameter, pageLoadId);
    setOrDeleteMatrixKey(params, pageLoadViewPath, beaconIdMatrixParameter, beaconId);
    setOrDeleteMatrixKey(params, pageLoadViewPath, beaconTimestampMatrixParameter, beaconTimestamp);

    // make sure that there is no grouping as otherwise the page load cannot be loaded.
    setOrDeleteMatrixKey(params, analyzePath, groupMatrixParameter, serializeGroup({}));
  });
}

export function goToAlertConfig(alertConfigId, alertConfigVersion, websiteId) {
  mutateUrl(location => {
    fillAlertTabSpecificValues(location, websiteId, alertConfigId, alertConfigVersion);
  });
}

export function getAlertConfig(alertConfigId, websiteId) {
  return getModifiedUrlStream(params => {
    fillAlertTabSpecificValues(params, websiteId, alertConfigId, null);
  });
}

function fillAlertTabSpecificValues(params, websiteId, alertConfigId, alertConfigVersion) {
  params.pathname = alertsTabDetailsFullyQualified;
  setOrDeleteMatrixKey(params, websitePath, websiteIdMatrixParam, websiteId);
  setOrDeleteMatrixKey(params, alertsTab, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(params, alertsTab, alertCreatedMatrixParam, alertConfigVersion);
}
