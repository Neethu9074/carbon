export function getApplicationIdTagFilter({ applicationId, boundaryScope }) {
  return Object.freeze({
    name: boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id',
    operator: 'EQUALS',
    stringValue: applicationId
  });
}
