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
  httpRequestId as httpRequestIdMatrixParameter,
  customEventId as customEventIdMatrixParameter
} from 'in-mobile-apps/navigation/matrix';
// eslint-disable-next-line import/no-deprecated
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { type as TAG_FILTER } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const mobileAppMonitoringPath = '/mobileAppMonitoring';
export const isMobileAppsView = getRootPathPredicate(mobileAppMonitoringPath);

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
export const alertsTab = '/alerts';

export const sessionViewPath = '/session';
export const sessionViewPathFullyQualified = `${analyzePathFullyQualified}${sessionViewPath}`;
export function useCloseSessionViewLink() {
  const { location, createHref } = useNavigation();

  location.pathname = analyzePathFullyQualified;

  return createHref(location);
}

export const mobileAppPath = '/mobileApp';
export const mobileAppPathFullyQualified = `${mobileAppMonitoringPath}${mobileAppPath}`;
export const usersTab = '/users';
export const usersTabFullyQualified = `${mobileAppPathFullyQualified}${usersTab}`;
export const httpRequestsTab = '/httpRequests';
export const httpRequestsTabFullyQualified = `${mobileAppPathFullyQualified}${httpRequestsTab}`;
export const customEventsTab = '/customEvents';
export const customEventsTabFullyQualified = `${mobileAppPathFullyQualified}${customEventsTab}`;

export const configurationTab = '/configuration';
export const configurationTabFullyQualified = `${mobileAppPathFullyQualified}${configurationTab}`;
export const configurationOptions = '/options';
export const configurationOptionsFullyQualified = `${configurationTabFullyQualified}${configurationOptions}`;
export const configurationPrivacy = '/privacy';
export const configurationPrivacyFullyQualified = `${configurationTabFullyQualified}${configurationPrivacy}`;
export const configurationCustomGeoDetails = '/customGeoDetails';
export const configurationCustomGeoDetailsFullyQualified = `${configurationTabFullyQualified}${configurationCustomGeoDetails}`;

export const alertsTabListFullyQualified = `${mobileAppPathFullyQualified}${alertsTab}`;
export const alertsTabDetailsFullyQualified = `${alertsTabListFullyQualified}/details`;

export function useLinkToNewMobileApp() {
  const { location, createHref } = useNavigation();

  location.pathname = newMobileAppPathFullyQualified;

  return createHref(location);
}

export const analyzeTwoParameters = createParameters(analyzePath);

export function getLinkToMobileApp(
  mobileAppId,
  { tabPath = summaryTab, tabParameters, viewId, timeConfig } = emptyObject
) {
  // eslint-disable-next-line import/no-deprecated
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

export function useGetLinkToMobileApp(
  mobileAppId,
  { tabPath = summaryTab, tabParameters, viewId, timeConfig } = emptyObject
) {
  const { location, createHref } = useNavigation();

  location.pathname = `${mobileAppPathFullyQualified}${tabPath}`;
  setOrDeleteMatrixKey(location, mobileAppPath, mobileAppIdMatrixParameter, mobileAppId);

  if (viewId !== undefined) {
    setOrDeleteMatrixKey(location, mobileAppPath, viewIdMatrixParameter, viewId);
  }

  if (tabPath && tabParameters) {
    Object.keys(tabParameters).forEach(name => setOrDeleteMatrixKey(location, tabPath, name, tabParameters[name]));
  }

  if (timeConfig) {
    setTimeConfig(location, timeConfig);
  }

  return createHref(location);
}

// tagCatalog - if specified, the formModel will be reset if any of its tags is not available in the tag catalog
export function getLinkToAnalyze({
  beaconType,
  groupBy,
  formModel,
  chartedMetrics,
  fields,
  tagCatalog,
  detailId,
  timeConfig
}) {
  // eslint-disable-next-line import/no-deprecated
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
    setOrDeleteMatrixParameter(params, analyzeTwoParameters.detailId, detailId);

    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }

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
  // eslint-disable-next-line import/no-deprecated
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
  // eslint-disable-next-line import/no-deprecated
  return getModifiedUrlStream(params => {
    params.pathname = `${mobileAppPathFullyQualified}/httpRequests/details`;
    setOrDeleteMatrixKey(params, mobileAppPath, mobileAppIdMatrixParameter, mobileAppId);

    if (viewId !== undefined) {
      setOrDeleteMatrixKey(params, mobileAppPath, viewIdMatrixParameter, viewId);
    }

    setOrDeleteMatrixKey(params, '/details', httpRequestIdMatrixParameter, httpRequestId);
  });
}

export function getLinkToCustomEvent(mobileAppId, { customEventId, viewId } = emptyObject) {
  // eslint-disable-next-line import/no-deprecated
  return getModifiedUrlStream(params => {
    params.pathname = `${mobileAppPathFullyQualified}/customEvents/details`;
    setOrDeleteMatrixKey(params, mobileAppPath, mobileAppIdMatrixParameter, mobileAppId);

    if (viewId !== undefined) {
      setOrDeleteMatrixKey(params, mobileAppPath, viewIdMatrixParameter, viewId);
    }

    setOrDeleteMatrixKey(params, '/details', customEventIdMatrixParameter, customEventId);
  });
}
