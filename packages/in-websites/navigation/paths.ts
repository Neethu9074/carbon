/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagFilter, TimeConfig } from '@instana/types';

import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam,
  beaconId as beaconIdMatrixParameter,
  beaconTimestamp as beaconTimestampMatrixParameter,
  beaconType as beaconTypeMatrixParameter,
  customEventId as customEventIdMatrixParameter,
  errorId as errorIdMatrixParameter,
  group as groupMatrixParameter,
  pageId as pageIdMatrixParameter,
  pageLoadId as pageLoadIdMatrixParameter,
  resourceId as resourceIdMatrixParameter,
  serializeGroup,
  websiteId as websiteIdMatrixParam,
  websiteId as websiteIdMatrixParameter,
  xhrId as xhrIdMatrixParameter
} from 'in-websites/navigation/matrix';
import {
  AnalyzeTagFilterParameter,
  NavigateToWebsiteParams,
  UseLinkToAnalyzeParams,
  UseLinkToPageLoadParams
} from 'in-websites/navigation/types';
import { setOrDeleteMatrixKey, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { type as TAG_FILTER } from 'in-components/QueryBuilder/transformation/tagFilter';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { Location } from 'in-stores/navigation/types';
import { setTimeConfig } from 'in-stores/time/config';

export const websiteMonitoringPath = '/websiteMonitoring';
export const isWebsitesView = getRootPathPredicate(websiteMonitoringPath);

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
export const configurationPrivacy = '/privacy';
export const configurationPrivacyFullyQualified = `${configurationTabFullyQualified}${configurationPrivacy}`;
export const configurationCustomGeoDetails = '/customGeoDetails';
export const configurationCustomGeoDetailsFullyQualified = `${configurationTabFullyQualified}${configurationCustomGeoDetails}`;
export const configurationJsStackTraceTranslation = '/jsStackTraceTranslation';
export const configurationJsStackTraceTranslationFullyQualified = `${configurationTabFullyQualified}${configurationJsStackTraceTranslation}`;
export const configurationAlerts = '/alerts';

export const websiteSmartAlertsFullScreen = '/websiteSmartAlerts';

export const analyzeTwoParameters = createParameters(analyzePath);

export const useLinkToNewWebsite = () => {
  const { createHref, location } = useNavigation();

  location.pathname = `${newWebsitePathFullyQualified}`;

  const href = createHref(location);

  return href;
};

export const useLinkToWebsite = (
  websiteId?: string,
  { tabPath = summaryTab, tabParameters, pageId, timeConfig }: NavigateToWebsiteParams = {}
) => {
  const { createHref, location } = useNavigation();

  location.pathname = `${websitePathFullyQualified}${tabPath}`;
  setOrDeleteMatrixKey(location, websitePath, websiteIdMatrixParameter, websiteId);

  if (pageId !== undefined) {
    setOrDeleteMatrixKey(location, websitePath, pageIdMatrixParameter, pageId);
  }

  if (tabPath && tabParameters) {
    Object.keys(tabParameters).forEach(name => setOrDeleteMatrixKey(location, tabPath, name, tabParameters[name]));
  }

  if (timeConfig) {
    setTimeConfig(location, timeConfig);
  }

  const href = createHref(location);

  return href;
};

export const useGenerateLinkToWebsite = () => {
  const { createHref, location } = useNavigation();

  return (
    websiteId: string,
    {
      tabPath = summaryTab,
      tabParameters,
      pageId,
      timeConfig
    }: {
      tabPath?: string;
      tabParameters?: Record<string, string>;
      pageId?: string;
      timeConfig?: TimeConfig;
    } = {}
  ) => {
    location.pathname = `${websitePathFullyQualified}${tabPath}`;
    setOrDeleteMatrixKey(location, websitePath, websiteIdMatrixParameter, websiteId);

    if (pageId !== undefined) {
      setOrDeleteMatrixKey(location, websitePath, pageIdMatrixParameter, pageId);
    }

    if (tabPath && tabParameters) {
      Object.keys(tabParameters).forEach(name => setOrDeleteMatrixKey(location, tabPath, name, tabParameters[name]));
    }

    if (timeConfig) {
      setTimeConfig(location, timeConfig);
    }

    return createHref(location);
  };
};
export const useLinkToError = (websiteId: string, { errorId, pageId }: { errorId?: string; pageId?: string } = {}) => {
  const { createHref, location } = useNavigation();

  location.pathname = `${websitePathFullyQualified}/errors/details`;
  setOrDeleteMatrixKey(location, websitePath, websiteIdMatrixParameter, websiteId);

  if (pageId !== undefined) {
    setOrDeleteMatrixKey(location, websitePath, pageIdMatrixParameter, pageId);
  }

  setOrDeleteMatrixKey(location, '/details', errorIdMatrixParameter, errorId);

  return createHref(location);
};

export const useResourceLink = (
  websiteId: string,
  { resourceId, pageId }: { resourceId?: string; pageId?: string } = {}
) => {
  const { createHref, location } = useNavigation();

  location.pathname = `${websitePathFullyQualified}/resources/details`;
  setOrDeleteMatrixKey(location, websitePath, websiteIdMatrixParameter, websiteId);

  if (pageId !== undefined) {
    setOrDeleteMatrixKey(location, websitePath, pageIdMatrixParameter, pageId);
  }

  setOrDeleteMatrixKey(location, '/details', resourceIdMatrixParameter, resourceId);

  return createHref(location);
};

export const useXhrRequestLink = (websiteId: string, { xhrId, pageId }: { xhrId?: string; pageId?: string } = {}) => {
  const { createHref, location } = useNavigation();

  location.pathname = `${websitePathFullyQualified}/ajax/details`;
  setOrDeleteMatrixKey(location, websitePath, websiteIdMatrixParameter, websiteId);

  if (pageId !== undefined) {
    setOrDeleteMatrixKey(location, websitePath, pageIdMatrixParameter, pageId);
  }

  setOrDeleteMatrixKey(location, '/details', xhrIdMatrixParameter, xhrId);

  return createHref(location);
};
export function useCustomEventLink(
  websiteId: string,
  { customEventId, pageId }: { customEventId?: string; pageId?: string } = {}
) {
  const { createHref, location } = useNavigation();

  location.pathname = `${websitePathFullyQualified}/customEvents/details`;
  setOrDeleteMatrixKey(location, websitePath, websiteIdMatrixParameter, websiteId);

  if (pageId !== undefined) {
    setOrDeleteMatrixKey(location, websitePath, pageIdMatrixParameter, pageId);
  }

  setOrDeleteMatrixKey(location, '/details', customEventIdMatrixParameter, customEventId);

  return createHref(location);
}

export const useLinkToAnalyze = (params: Partial<UseLinkToAnalyzeParams>) => {
  const { createHref, location } = useNavigation();

  //Do not replicate this behavior with returning null in other link hooks - it's there due to legacy code
  if (!params) return null;

  const { beaconType, groupBy, formModel, chartedMetrics, fields, timeConfig, tagCatalog, detailId } = params;

  setOrDeleteMatrixKey(location, analyzePath, beaconTypeMatrixParameter, beaconType);
  setOrDeleteMatrixParameter(location, analyzeTwoParameters.groupBy, groupBy);
  setOrDeleteMatrixParameter(location, analyzeTwoParameters.fields, fields);
  setOrDeleteMatrixParameter(location, analyzeTwoParameters.chartedMetrics, chartedMetrics);
  setOrDeleteMatrixParameter(location, analyzeTwoParameters.detailId, detailId);

  if (formModel) {
    let tagFilterExpression: FormModelElement[] | null = [...formModel];
    if (tagCatalog && tagFilterExpression?.length > 0) {
      const availableTags = tagCatalog.tags.map(t => t.name);
      const allTagsSupported = tagFilterExpression
        .filter(element => element.type === TAG_FILTER)
        .every(tagFilter => availableTags.includes((tagFilter as TagFilter).name));
      if (!allTagsSupported) {
        tagFilterExpression = null;
      }
    }
    setOrDeleteMatrixParameter(
      location,
      analyzeTwoParameters.tagFilterExpression as AnalyzeTagFilterParameter,
      tagFilterExpression
    );
  }

  // reset sorting
  setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderBy);
  setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderByGroups);

  if (timeConfig) {
    setTimeConfig(location, timeConfig);
  }

  const href = createHref({ ...location, pathname: analyzePathFullyQualified });

  if (!groupBy || !beaconType) return null;

  return href;
};

export const useGenerateLinkToAnalyze = () => {
  const { createHref, location } = useNavigation();

  return ({
    beaconType,
    groupBy,
    formModel,
    chartedMetrics,
    fields,
    timeConfig,
    tagCatalog,
    detailId
  }: Partial<UseLinkToAnalyzeParams> = {}) => {
    location.pathname = analyzePathFullyQualified;

    setOrDeleteMatrixKey(location, analyzePath, beaconTypeMatrixParameter, beaconType);
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.groupBy, groupBy);
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.fields, fields);
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.chartedMetrics, chartedMetrics);
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.detailId, detailId);

    if (formModel) {
      let tagFilterExpression: FormModelElement[] | null = [...formModel];
      if (tagCatalog && tagFilterExpression?.length > 0) {
        const availableTags = tagCatalog.tags.map(t => t.name);
        const allTagsSupported = tagFilterExpression
          .filter(element => element.type === TAG_FILTER)
          .every(tagFilter => availableTags.includes((tagFilter as TagFilter).name));
        if (!allTagsSupported) {
          tagFilterExpression = null;
        }
      }
      setOrDeleteMatrixParameter(
        location,
        analyzeTwoParameters.tagFilterExpression as AnalyzeTagFilterParameter,
        tagFilterExpression
      );
    }

    // reset sorting
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderBy);
    setOrDeleteMatrixParameter(location, analyzeTwoParameters.orderByGroups);

    if (timeConfig) {
      setTimeConfig(location, timeConfig);
    }

    return createHref(location);
  };
};

export function useLinkToPageLoad({ pageLoadId, beaconId, beaconTimestamp }: UseLinkToPageLoadParams) {
  const { createHref, location } = useNavigation();

  location.pathname = `${pageLoadViewPathFullyQualified}/summary`;
  setOrDeleteMatrixKey(location, pageLoadViewPath, pageLoadIdMatrixParameter, pageLoadId);
  setOrDeleteMatrixKey(location, pageLoadViewPath, beaconIdMatrixParameter, beaconId);
  setOrDeleteMatrixKey(location, pageLoadViewPath, beaconTimestampMatrixParameter, beaconTimestamp);

  // make sure that there is no grouping as otherwise the page load cannot be loaded.
  setOrDeleteMatrixKey(location, analyzePath, groupMatrixParameter, serializeGroup({}));

  return createHref(location);
}

export function useGenerateLinkToPageLoad() {
  const { createHref, location } = useNavigation();

  return ({ pageLoadId, beaconId, beaconTimestamp }: UseLinkToPageLoadParams) => {
    location.pathname = `${pageLoadViewPathFullyQualified}/summary`;
    setOrDeleteMatrixKey(location, pageLoadViewPath, pageLoadIdMatrixParameter, pageLoadId);
    setOrDeleteMatrixKey(location, pageLoadViewPath, beaconIdMatrixParameter, beaconId);
    setOrDeleteMatrixKey(location, pageLoadViewPath, beaconTimestampMatrixParameter, beaconTimestamp);

    // make sure that there is no grouping as otherwise the page load cannot be loaded.
    setOrDeleteMatrixKey(location, analyzePath, groupMatrixParameter, serializeGroup({}));

    return createHref(location);
  };
}

export const useAlertConfigLink = (alertConfigId: string, websiteId: string, alertConfigVersion?: number) => {
  const { createHref, location } = useNavigation();
  fillAlertTabSpecificValues(location, websiteId, alertConfigId, alertConfigVersion);
  return createHref(location);
};

export const useGetAlertConfigLink = () => {
  const { createHref, location } = useNavigation();

  return (alertConfigId: string, websiteId: string, alertConfigVersion?: number) => {
    fillAlertTabSpecificValues(location, websiteId, alertConfigId, alertConfigVersion);
    return createHref(location);
  };
};

function fillAlertTabSpecificValues(
  params: Location,
  websiteId: string,
  alertConfigId: string,
  alertConfigVersion?: number
) {
  params.pathname = alertsTabDetailsFullyQualified;
  setOrDeleteMatrixKey(params, websitePath, websiteIdMatrixParam, websiteId);
  setOrDeleteMatrixKey(params, alertsTab, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(params, alertsTab, alertCreatedMatrixParam, alertConfigVersion);
}
