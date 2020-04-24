export const blueprintConfig = Object.freeze([
  {
    type: 'slowness',
    name: 'Slow Calls',
    headline: 'Automatic Alerts for Slow Calls',
    text:
      'Receive an alert when calls to selected services and endpoints of this Application Perspective are slower than usual.'
  },
  {
    type: 'errorRate',
    name: 'Erroneous Calls',
    headline: 'Automatic Alerts for Erroneous Calls',
    text:
      'Receive an alert when the rate of erroneous calls for selected services and endpoints of this Application Perspective is higher than normal.'
  },
  {
    type: 'logs',
    name: 'Error and Warning Logs',
    headline: 'Automatic Alerts for Error and Warning Logs',
    text:
      'Receive an alert when the number of calls logging matching error and warning messages is higher than expected.'
  },
  {
    type: 'statusCode',
    name: 'HTTP Status Code',
    headline: 'Specific Status Codes',
    text: 'Receive an alert when a known status code is observed.'
  }
]);
