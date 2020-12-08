import { getCorrectIdToUseForTransitionPhase } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/idChooser';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getApiTokens() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/api-tokens`
  }).map(response => response.body);
}

export function getApiToken(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/api-tokens/${encodeURIComponent(id)}`
  }).map(response => response.body);
}

export function createApiToken(apiToken) {
  return http({
    method: 'POST',
    headers: getCsrfHeader(),
    maxRetries: 0,
    url: `/api/settings/api-tokens`,
    data: apiToken
  }).map(response => response.body);
}

export function saveApiToken(apiToken) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    // Deprecated: Fallback can be safely removed after release-195. Also see backend type ApiToken.
    url: `/api/settings/api-tokens/${encodeURIComponent(
      getCorrectIdToUseForTransitionPhase(apiToken.internalId, apiToken.id)
    )}`,
    data: apiToken
  }).map(response => response.body);
}

export function deleteApiToken(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/api-tokens/${encodeURIComponent(id)}`
  });
}
