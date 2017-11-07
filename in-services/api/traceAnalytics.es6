import http from 'in-services/http';

export function getTraceAnalytics({ traceIds }) {
  return http({
    method: 'POST',
    url: `/api/traces/analyze`,
    timeout: 60000,
    data: {
      traceIds
    }
  }).map(response => response.body);
}
