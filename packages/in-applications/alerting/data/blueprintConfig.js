export const blueprintConfig = Object.freeze([
  {
    type: 'slowness',
    blacklistedTagFilters: ['call.latency'],
    name: 'Slow Calls',
    headline: 'Automatic Alerts for Slow Calls',
    text:
      'Receive an alert when calls to selected services and endpoints of this Application Perspective are slower than usual.'
  },
  {
    type: 'errorRate',
    blacklistedTagFilters: ['call.erroneous', 'call.error.count', 'call.error.message'],
    name: 'Erroneous Calls',
    headline: 'Automatic Alerts for Erroneous Calls',
    text:
      'Receive an alert when the rate of erroneous calls for selected services and endpoints of this Application Perspective is higher than normal.'
  },
  {
    type: 'logs',
    blacklistedTagFilters: ['log.message', 'log.level'],
    name: 'Error and Warning Logs',
    headline: 'Automatic Alerts for Error and Warning Logs',
    text:
      'Receive an alert when the number of calls logging matching error and warning messages is higher than expected.'
  },
  {
    type: 'statusCode',
    blacklistedTagFilters: ['call.http.status'],
    name: 'HTTP Status Codes',
    headline: 'Automatic Alerts for HTTP Status Codes',
    text: 'Receive an alert every time when matching HTTP Status Codes occur more often than usual.'
  }
]);

export function blacklistedTagFiltersOfAlertType(type) {
  const config = blueprintConfig.find(blueprint => blueprint.type === type);
  if (config) {
    return [...config.blacklistedTagFilters];
  }
  return [];
}
