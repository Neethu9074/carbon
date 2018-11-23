import { websiteId as websiteIdMatrixParameter, pageId as pageIdMatrixParameter } from 'in-websites/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';

export const websiteMonitoringPath = '/websiteMonitoring';

export const websitesPath = '/websites';
export const websitesPathFullyQualified = `${websiteMonitoringPath}${websitesPath}`;

export const websitePath = '/website';
export const websitePathFullyQualified = `${websiteMonitoringPath}${websitePath}`;

export const newWebsitePath = '/new';
export const newWebsitePathFullyQualified = `${websiteMonitoringPath}${newWebsitePath}`;

export const analyzePath = '/analyze';
export const analyzePathFullyQualified = `${websiteMonitoringPath}${analyzePath}`;

export const linkToWebsites$ = getModifiedUrlStream(params => {
  params.pathname = websitesPathFullyQualified;
});

export const linkToNewWebsite$ = getModifiedUrlStream(params => {
  params.pathname = newWebsitePathFullyQualified;
});

export function getLinkToWebsite(websiteId, { tabPath = '/summary', tabParameters, pageId } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.pathname = `${websitePathFullyQualified}${tabPath}`;
    setOrDeleteMatrixKey(params, websitePath, websiteIdMatrixParameter, websiteId);

    if (pageId !== undefined) {
      setOrDeleteMatrixKey(params, websitePath, pageIdMatrixParameter, pageId);
    }

    if (tabPath && tabParameters) {
      Object.keys(tabParameters).forEach(name => setOrDeleteMatrixKey(params, tabPath, name, tabParameters[name]));
    }
  });
}
