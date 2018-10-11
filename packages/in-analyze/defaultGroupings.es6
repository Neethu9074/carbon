export function getDefaultGrouping(isTracesDataSource) {
  return isTracesDataSource ? { name: 'trace.endpoint.name', value: '' } : { name: 'endpoint.name', value: '' };
}
