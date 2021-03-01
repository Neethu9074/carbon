/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import invariant from 'invariant';

import {
  mobileAppId as mobileAppIdMatrixParameter,
  viewId as viewIdMatrixParameter,
  group as groupMatrixParameter,
  serializeGroup,
  beaconType as beaconTypeMatrixParameter,
  sessionId as sessionIdMatrixParameter,
  beaconId as beaconIdMatrixParameter,
  beaconTimestamp as beaconTimestampMatrixParameter,
  httpRequestId as httpRequestIdMatrixParameter
} from 'in-mobile-apps/navigation/matrix';
import { setOrDeleteMatrixKey, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { type as TAG_FILTER } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { createParameters } from 'in-new-components/AnalyzeView/parameters';
import { emptyObject } from 'in-services/fixedObjects';
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

export const analyzeTwoParameters = createParameters(analyzePath);

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

// tagCatalog - if specified, the formModel will be reset if any of its tags is not available in the tag catalog
export function getLinkToAnalyze({ beaconType, groupBy, formModel, chartedMetrics, fields, tagCatalog }) {
  return getModifiedUrlStream(params => {
    params.pathname = analyzePathFullyQualified;
    if (__DEV__) {
      invariant(groupBy, 'groupBy must be defined when generating analyze links!');
      invariant(beaconType, 'beaconType must be defined when generating analyze links!');
    }

    setOrDeleteMatrixKey(params, analyzePath, beaconTypeMatrixParameter, beaconType);
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.groupBy, groupBy);
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.fields, fields);
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.chartedMetrics, chartedMetrics);

    let updatedFormModel = formModel;
    if (tagCatalog && updatedFormModel?.length > 0) {
      const availableTags = tagCatalog.tags.map(t => t.name);
      const allTagsSupported = updatedFormModel
        .filter(element => element.type === TAG_FILTER)
        .every(tagFilter => availableTags.includes(tagFilter.name));
      if (!allTagsSupported) {
        updatedFormModel = null;
      }
    }
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.tagFilterExpression, updatedFormModel);

    // reset sorting
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.orderBy);
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.orderByGroups);
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
