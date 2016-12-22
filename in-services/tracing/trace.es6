import http from 'in-services/http';


export function getTraceById(id) {
  return http({
    method: 'GET',
    url: `/api//trace/${id}`
  })
  .map(response => response.body);
}
