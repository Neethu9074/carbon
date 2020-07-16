import { percentage } from 'in-services/formatters/number';
import { millis } from 'in-services/formatters/number';

export const blueprintConfig = Object.freeze([
  {
    type: 'slowness',
    blacklistedTagFilters: ['call.latency'],
    name: 'Slow Calls',
    headline: 'Automatic Alerts for Slow Calls',
    text:
      'Receive an alert when calls to selected services and endpoints of this Application Perspective are slower than usual.',
    baselineEnabled: true,
    metric: 'latency',
    metricFormat: millis.forcedFixedCompact,
    aggregation: undefined, // is not fixed and can be changed via config-attributes
    isRuleComplete: () => true
  },
  {
    type: 'errorRate',
    blacklistedTagFilters: ['call.erroneous', 'call.error.count', 'call.error.message'],
    name: 'Erroneous Calls',
    headline: 'Automatic Alerts for Erroneous Calls',
    text:
      'Receive an alert when the rate of erroneous calls for selected services and endpoints of this Application Perspective is higher than normal.',
    baselineEnabled: false,
    metric: 'errors',
    metricFormat: percentage.detailed,
    aggregation: 'MEAN',
    isRuleComplete: () => true
  },
  {
    type: 'logs',
    blacklistedTagFilters: ['log.message', 'log.level'],
    name: 'Error and Warning Logs',
    headline: 'Automatic Alerts for Error and Warning Logs',
    text:
      'Receive an alert when the number of calls logging matching error and warning messages is higher than expected.',
    baselineEnabled: false,
    metric: 'calls',
    aggregation: 'SUM',
    isRuleComplete: alertRule => !!alertRule.message,
    incompleteRuleMessage: 'Please select a Log Message to see when this alert triggers'
  },
  {
    type: 'statusCode',
    blacklistedTagFilters: ['call.http.status'],
    name: 'HTTP Status Codes',
    headline: 'Automatic Alerts for HTTP Status Codes',
    text: 'Receive an alert every time when matching HTTP Status Codes occur more often than usual.',
    baselineEnabled: false,
    metric: 'calls',
    aggregation: 'SUM',
    isRuleComplete: alertRule => !!(alertRule.statusCodeStart && alertRule.statusCodeEnd),
    incompleteRuleMessage: 'Please select a Status Code to see when this alert triggers'
  }
]);

export function getBlueprintConfig(alertType) {
  return blueprintConfig.find(blueprint => blueprint.type === alertType);
}

export function blacklistedTagFiltersOfAlertType(alertType) {
  const config = getBlueprintConfig(alertType);
  if (config) {
    return [...config.blacklistedTagFilters];
  }
  return [];
}
