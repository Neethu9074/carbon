/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useCallback } from 'react';
import invariant from 'invariant';

import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam,
  mobileAppId as mobileAppIdMatrixParameter,
  viewId as viewIdMatrixParameter,
  group as groupMatrixParameter,
  serializeGroup,
  beaconType as beaconTypeMatrixParameter,
  sessionId as sessionIdMatrixParameter,
  beaconId as beaconIdMatrixParameter,
  beaconTimestamp as beaconTimestampMatrixParameter,
  httpRequestId as httpRequestIdMatrixParameter,
  customEventId as customEventIdMatrixParameter,
  crashId as crashIdMatrixParameter
} from 'in-mobile-apps/navigation/matrix';
import { setOrDeleteMatrixKey, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { type as TAG_FILTER } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
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
export const crashesTab = '/crashes';
export const crashesTabFullyQualified = `${mobileAppPathFullyQualified}${crashesTab}`;
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
export const configurationSymbolFiles = '/symbolFiles';
export const configurationSymbolFilesFullyQualified = `${configurationTabFullyQualified}${configurationSymbolFiles}`;
export const configurationCustomGeoDetails = '/customGeoDetails';
export const configurationCustomGeoDetailsFullyQualified = `${configurationTabFullyQualified}${configurationCustomGeoDetails}`;

export const alertsTabListFullyQualified = `${mobileAppPathFullyQualified}${alertsTab}`;
export const alertsTabDetailsFullyQualified = `${alertsTabListFullyQualified}/details`;

export const mobileAppSmartAlerts = '/smartAlerts';
export const mobileAppSmartAlertsFullScreenFullyQualified = `${mobileAppMonitoringPath}${mobileAppSmartAlerts}`;

export function useLinkToNewMobileApp() {
  const { location, createHref } = useNavigation();

  location.pathname = newMobileAppPathFullyQualified;

  return createHref(location);
}

export const analyzeTwoParameters = createParameters(analyzePath);

export function useGetLinkToMobileApp(
  mobileAppId,
  { tabPath = summaryTab, tabParameters, viewId, timeConfig } = emptyObject
) {
  const { location, createHref } = useNavigation();

  return linkToMobileApp(location, tabPath, mobileAppId, viewId, tabParameters, timeConfig, createHref);
}

export const useGenerateLinkToMobileApp = () => {
  const { createHref, location } = useNavigation();

  return (mobileAppId, { tabPath = summaryTab, tabParameters, viewId, timeConfig } = emptyObject) => {
    return linkToMobileApp(location, tabPath, mobileAppId, viewId, tabParameters, timeConfig, createHref);
  };
};

function linkToMobileApp(location, tabPath, mobileAppId, viewId, tabParameters, timeConfig, createHref) {
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
export function useLinkToAnalyze() {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({ beaconType, groupBy, formModel, chartedMetrics, fields, tagCatalog, detailId, timeConfig }) => {
      location.pathname = analyzePathFullyQualified;
      if (__DEV__) {
        invariant(groupBy, 'groupBy must be defined when generating analyze links!');
        invariant(beaconType, 'beaconType must be defined when generating analyze links!');
      }

      setOrDeleteMatrixKey(location, analyzePath, beaconTypeMatrixParameter, beaconType);
      setOrDeleteMatrixParameter(location, analyzeTwoParameters.groupBy, groupBy);
      setOrDeleteMatrixParameter(location, analyzeTwoParameters.fields, fields);
      setOrDeleteMatrixParameter(location, analyzeTwoParameters.chartedMetrics, chartedMetrics);
      setOrDeleteMatrixParameter(location, analyzeTwoParameters.detailId, detailId);

      if (timeConfig) {
        setTimeConfig(location, timeConfig);
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
      setOrDeleteMatrixParameter(location, analyzeTwoParameters.tagFilterExpression, updatedFormModel);

      // reset sorting
      setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderBy);
      setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderByGroups);

      return createHref(location);
    },
    [location, createHref]
  );
}

export function useLinkToSession() {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({ sessionId, beaconId, beaconTimestamp }) => {
      location.pathname = `${sessionViewPathFullyQualified}${summaryTab}`;
      setOrDeleteMatrixKey(location, sessionViewPath, sessionIdMatrixParameter, sessionId);
      setOrDeleteMatrixKey(location, sessionViewPath, beaconIdMatrixParameter, beaconId);
      setOrDeleteMatrixKey(location, sessionViewPath, beaconTimestampMatrixParameter, beaconTimestamp);

      // make sure that there is no grouping as otherwise the session cannot be loaded.
      setOrDeleteMatrixKey(location, analyzePath, groupMatrixParameter, serializeGroup({}));

      return createHref(location);
    },
    [location, createHref]
  );
}

export function useLinkToCrash() {
  const { location, createHref } = useNavigation();

  return useCallback(
    (mobileAppId, { crashId, viewId } = emptyObject) => {
      location.pathname = `${mobileAppPathFullyQualified}/crashes/details`;
      setOrDeleteMatrixKey(location, mobileAppPath, mobileAppIdMatrixParameter, mobileAppId);

      if (viewId !== undefined) {
        setOrDeleteMatrixKey(location, mobileAppPath, viewIdMatrixParameter, viewId);
      }

      setOrDeleteMatrixKey(location, '/details', crashIdMatrixParameter, crashId);

      return createHref(location);
    },
    [location, createHref]
  );
}

export function useLinkToHttpRequest() {
  const { location, createHref } = useNavigation();

  return useCallback(
    (mobileAppId, { httpRequestId, viewId } = emptyObject) => {
      location.pathname = `${mobileAppPathFullyQualified}/httpRequests/details`;
      setOrDeleteMatrixKey(location, mobileAppPath, mobileAppIdMatrixParameter, mobileAppId);

      if (viewId !== undefined) {
        setOrDeleteMatrixKey(location, mobileAppPath, viewIdMatrixParameter, viewId);
      }

      setOrDeleteMatrixKey(location, '/details', httpRequestIdMatrixParameter, httpRequestId);

      return createHref(location);
    },
    [location, createHref]
  );
}

export function useLinkToCustomEvent() {
  const { location, createHref } = useNavigation();

  return useCallback(
    (mobileAppId, { customEventId, viewId } = emptyObject) => {
      location.pathname = `${mobileAppPathFullyQualified}/customEvents/details`;
      setOrDeleteMatrixKey(location, mobileAppPath, mobileAppIdMatrixParameter, mobileAppId);

      if (viewId !== undefined) {
        setOrDeleteMatrixKey(location, mobileAppPath, viewIdMatrixParameter, viewId);
      }

      setOrDeleteMatrixKey(location, '/details', customEventIdMatrixParameter, customEventId);

      return createHref(location);
    },
    [location, createHref]
  );
}

export const useGetAlertConfigLink = () => {
  const { createHref, location } = useNavigation();

  return (alertConfigId, mobileAppId, alertConfigVersion) => {
    fillAlertTabSpecificValues(location, mobileAppId, alertConfigId, alertConfigVersion);
    return createHref(location);
  };
};

function fillAlertTabSpecificValues(params, mobileAppId, alertConfigId, alertConfigVersion) {
  params.pathname = alertsTabDetailsFullyQualified;
  setOrDeleteMatrixKey(params, mobileAppPath, mobileAppIdMatrixParameter, mobileAppId);
  setOrDeleteMatrixKey(params, alertsTab, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(params, alertsTab, alertCreatedMatrixParam, alertConfigVersion);
}

export const useNavigationToAlertConfig = () => {
  const { navigate, location } = useNavigation();

  return (alertConfigId, mobileAppId, alertConfigVersion) => {
    fillAlertTabSpecificValues(location, mobileAppId, alertConfigId, alertConfigVersion);
    return navigate(location);
  };
};
