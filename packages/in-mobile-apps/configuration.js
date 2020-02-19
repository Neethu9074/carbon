import { getEumAcceptorBaseUrl } from 'in-websites/trackingSnippet';

export function getReportingUrl() {
  return getEumAcceptorBaseUrl() + '/mobile';
}
