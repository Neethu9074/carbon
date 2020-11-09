import invariant from 'invariant';

import {
  mobileAppId as mobileAppIdMatrixParameter,
  viewId as viewIdMatrixParameter,
  tagFilters as tagFiltersMatrixParameter,
  serializeTagFilters,
  deserializeTagFilters,
  group as groupMatrixParameter,
  serializeGroup,
  beaconType as beaconTypeMatrixParameter,
  sessionId as sessionIdMatrixParameter,
  beaconId as beaconIdMatrixParameter,
  beaconTimestamp as beaconTimestampMatrixParameter,
  httpRequestId as httpRequestIdMatrixParameter,
  serializeMetrics
} from 'in-mobile-apps/navigation/matrix';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey, getMatrixParameter } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { availableFilterTags } from 'in-mobile-apps/tags';
import { setTimeConfig } from 'in-stores/time/config';

export const mobileAppMonitoringPath = '/mobileAppMonitoring';

export const mobileAppsPath = '/mobileApps';
export const mobileAppsPathFullyQualified = `${mobileAppMonitoringPath}${mobileAppsPath}`;

export const newMobileAppPath = '/new';
export const newMobileAppPathFullyQualified = `${mobileAppMonitoringPath}${newMobileAppPath}`;

export const analyzePath = '/analyzeBeacons';
export const analyzePathFullyQualified = `${mobileAppMonitoringPath}${analyzePath}`;
export const isAnalyzeView = navigationParameters$.map(
  location => location.pathname.indexOf(analyzePathFullyQualified) === 0
);

export const detailsPath = '/details';
export const summaryTab = '/summary';

export const sessionViewPath = '/session';
export const sessionViewPathFullyQualified = `${analyzePathFullyQualified}${sessionViewPath}`;
export const closeSessionViewLink = getModifiedUrlStream(params => (params.pathname = analyzePathFullyQualified));

export const mobileAppPath = '/mobileApp';
export const mobileAppPathFullyQualified = `${mobileAppMonitoringPath}${mobileAppPath}`;
export const usersTab = '/users';
export const usersTabFullyQualified = `${mobileAppPathFullyQualified}${usersTab}`;
export const httpRequestsTab = '/httpRequests';
export const httpRequestsTabFullyQualified = `${mobileAppPathFullyQualified}${httpRequestsTab}`;

export const configurationTab = '/configuration';
export const configurationTabFullyQualified = `${mobileAppPathFullyQualified}${configurationTab}`;
export const configurationOptions = '/options';
export const configurationOptionsFullyQualified = `${configurationTabFullyQualified}${configurationOptions}`;

export const linkToMobileApps$ = getModifiedUrlStream(params => {
  params.pathname = mobileAppsPathFullyQualified;
});

export const linkToNewMobileApp$ = getModifiedUrlStream(params => {
  params.pathname = newMobileAppPathFullyQualified;
});

export function getLinkToMobileApp(
  mobileAppId,
  { tabPath = summaryTab, tabParameters, viewId, timeConfig } = emptyObject
) {
  return getModifiedUrlStream(params => {
    params.pathname = `${mobileAppPathFullyQualified}${tabPath}`;
    setOrDeleteMatrixKey(params, mobileAppPath, mobileAppIdMatrixParameter, mobileAppId);

    if (viewId !== undefined) {
      setOrDeleteMatrixKey(params, mobileAppPath, viewIdMatrixParameter, viewId);
    }

    if (tabPath && tabParameters) {
      Object.keys(tabParameters).forEach(name => setOrDeleteMatrixKey(params, tabPath, name, tabParameters[name]));
    }

    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }
  });
}

export function getLinkToAnalyze({
  tagFilters,
  group,
  beaconType,
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

    const filterableTags = availableFilterTags[beaconType];
    if (tagFilters != null) {
      const onlyAllowedTagFilters = tagFilters.filter(t => filterableTags.indexOf(t.name) !== -1);
      setOrDeleteMatrixKey(params, analyzePath, tagFiltersMatrixParameter, serializeTagFilters(onlyAllowedTagFilters));
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
  });
}

export function getLinkToSession({ sessionId, beaconId, beaconTimestamp }) {
  return getModifiedUrlStream(params => {
    params.pathname = `${sessionViewPathFullyQualified}${summaryTab}`;
    setOrDeleteMatrixKey(params, sessionViewPath, sessionIdMatrixParameter, sessionId);
    setOrDeleteMatrixKey(params, sessionViewPath, beaconIdMatrixParameter, beaconId);
    setOrDeleteMatrixKey(params, sessionViewPath, beaconTimestampMatrixParameter, beaconTimestamp);

    // make sure that there is no grouping as otherwise the session cannot be loaded.
    setOrDeleteMatrixKey(params, analyzePath, groupMatrixParameter, serializeGroup({}));
  });
}

export function getLinkToHttpRequest(mobileAppId, { httpRequestId, viewId } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${mobileAppPathFullyQualified}/httpRequests/details`;
    setOrDeleteMatrixKey(params, mobileAppPath, mobileAppIdMatrixParameter, mobileAppId);

    if (viewId !== undefined) {
      setOrDeleteMatrixKey(params, mobileAppPath, viewIdMatrixParameter, viewId);
    }

    setOrDeleteMatrixKey(params, '/details', httpRequestIdMatrixParameter, httpRequestId);
  });
}
