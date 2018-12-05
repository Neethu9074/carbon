import invariant from 'invariant';

import {
  websiteId as websiteIdMatrixParameter,
  pageId as pageIdMatrixParameter,
  errorId as errorIdMatrixParameter,
  tagFilters as tagFiltersMatrixParameter,
  serializeTagFilters,
  deserializeTagFilters,
  group as groupMatrixParameter,
  serializeGroup,
  beaconType as beaconTypeMatrixParameter,
  pageLoadId as pageLoadIdMatrixParameter,
  beaconId as beaconIdMatrixParameter
} from 'in-websites/navigation/matrix';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey, getMatrixParameter } from 'in-stores/navigation/matrix';
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

export const websitePath = '/website';
export const websitePathFullyQualified = `${websiteMonitoringPath}${websitePath}`;
export const errorsTab = '/errors';
export const errorsTabFullyQualified = `${websitePathFullyQualified}${errorsTab}`;

export const linkToWebsites$ = getModifiedUrlStream(params => {
  params.pathname = websitesPathFullyQualified;
});

export const linkToNewWebsite$ = getModifiedUrlStream(params => {
  params.pathname = newWebsitePathFullyQualified;
});

export function getLinkToWebsite(websiteId, { tabPath = '/summary', tabParameters, pageId, timeConfig } = emptyObject) {
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

export function getLinkToAnalyze({ tagFilters, group, beaconType }) {
  return getModifiedUrlStream(params => {
    params.pathname = analyzePathFullyQualified;
    if (__DEV__) {
      invariant(group, 'group must be defined when generating analyze links!');
      invariant(beaconType, 'beaconType must be defined when generating analyze links!');
    }
    setOrDeleteMatrixKey(params, analyzePath, groupMatrixParameter, serializeGroup(group));
    setOrDeleteMatrixKey(params, analyzePath, beaconTypeMatrixParameter, beaconType);

    // reset raw beacon sorting
    setOrDeleteMatrixKey(params, analyzePath, 'beacons.orderBy');
    setOrDeleteMatrixKey(params, analyzePath, 'beacons.orderDirection');

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

export function getLinkToPageLoad({ pageLoadId, beaconId }) {
  return getModifiedUrlStream(params => {
    params.pathname = `${pageLoadViewPathFullyQualified}/summary`;
    setOrDeleteMatrixKey(params, pageLoadViewPath, pageLoadIdMatrixParameter, pageLoadId);
    setOrDeleteMatrixKey(params, pageLoadViewPath, beaconIdMatrixParameter, beaconId);
  });
}
