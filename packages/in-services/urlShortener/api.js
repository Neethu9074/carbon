import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function generateShortUrl(url) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/shortUrls`,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    queryParams: {
      url
    }
  });
}
