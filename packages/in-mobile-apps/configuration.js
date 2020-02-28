import { getEumAcceptorBaseUrl } from 'in-websites/trackingSnippet';
import config from 'in-services/config';

export function getReportingUrl() {
  return config.mobileEndpoint || getEumAcceptorBaseUrl() + '/mobile';
}
