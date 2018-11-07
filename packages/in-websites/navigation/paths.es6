import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { websiteId as websiteIdMatrixParameter } from 'in-websites/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';

export const websiteMonitoringPath = '/websiteMonitoring';

export const websitesPath = '/websites';
export const websitesPathFullyQualified = `${websiteMonitoringPath}${websitesPath}`;

export const websitePath = '/website';
export const websitePathFullyQualified = `${websiteMonitoringPath}${websitePath}`;

export const isWebsiteMonitoringView = getRootPathPredicate(websiteMonitoringPath);

export const linkToWebsites = getModifiedUrlStream(params => {
  params.pathname = `${websitesPathFullyQualified}`;
});

export function getLinkToWebsite(websiteId, { tabPath = '' } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${websitePathFullyQualified}${tabPath}`;

    if (websiteId !== undefined) {
      setOrDeleteMatrixKey(params, websitePath, websiteIdMatrixParameter, websiteId);
    }
  });
}
