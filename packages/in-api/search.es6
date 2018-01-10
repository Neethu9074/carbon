import http from 'in-services/http';

export function validate(query) {
  return http({
    method: 'GET',
    url: `/api/search/validate`,
    maxRetries: 3,
    queryParams: {
      q: query
    }
  });
}
