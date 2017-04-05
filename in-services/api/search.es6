import http from 'in-services/http';

export function validate(query) {
  return http({
    method: 'GET',
    url: `/api/search/validate`,
    queryParams: {
      q: query
    }
  });
}
