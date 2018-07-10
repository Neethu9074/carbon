import { twoZeroModeEnabled } from 'in-services/featureFlags';
import http from 'in-services/http';

export function validate(query, twoZeroModeEnabledActual = twoZeroModeEnabled) {
  return http({
    method: 'GET',
    url: `/api/search/validate`,
    maxRetries: 3,
    queryParams: {
      q: query,
      newApplicationModelEnabled: twoZeroModeEnabledActual
    }
  });
}
