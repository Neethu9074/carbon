export function getApplicationIdTagFilter({ applicationId, boundaryScope }) {
  return Object.freeze({
    name: boundaryScope === 'INBOUND' ? 'application.id' : 'boundary.application.id',
    operator: 'EQUALS',
    stringValue: applicationId
  });
}
