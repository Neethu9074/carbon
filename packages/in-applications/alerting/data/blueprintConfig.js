export const blueprintConfig = Object.freeze([
  {
    type: 'errorRate',
    name: 'High Error Rate',
    headline: 'Error Rate is higher than expected',
    text:
      'Receive an alert when the error rate is higher than expected (when compared to your historical data of these services/endpoints)'
  },
  {
    type: 'slowness',
    name: 'Slowness',
    headline: 'Latency is higher than expected',
    text:
      'Receive an alert when the latency is higher (your services/endpoints are slower) than expected (from historical data).'
  },
  {
    type: 'logs',
    name: 'Log Messages',
    headline: 'Specific Log Messages',
    text:
      'Receive an alert when a known log message (that has been monitored before) or a message matching a string pattern is observed.'
  }
]);
