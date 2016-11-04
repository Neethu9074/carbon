import {
  percentage,
  number,
  millis,
  bytes
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


export default [
  {
    metric: getMetricMatch('frontendStats', 'reqRate'),
    label: 'Requests',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'reqErrors'),
    label: 'Request Errors',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'deniedReq'),
    label: 'Denied Requests',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'sessionRate'),
    label: 'Sessions',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'sessionUtilization'),
    label: 'Session Usage',
    min: 0,
    formatter: percentage
  },
  {
    metric: getMetricMatch('frontendStats', 'clientErrors'),
    label: 'Client Errors',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'serverErrors'),
    label: 'Server Errors',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'bytesSent'),
    label: 'Bytes Sent',
    min: 0,
    formatter: bytes
  },
  {
    metric: getMetricMatch('frontendStats', 'bytesReceived'),
    label: 'Bytes Received',
    min: 0,
    formatter: bytes
  },
  {
    metric: getMetricMatch('frontendStats', 'avgResponseTime'),
    label: 'Average Response Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('frontendStats', 'avgQueueTime'),
    label: 'Average Queue Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('frontendStats', 'queueSize'),
    label: 'Queue Size',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'reqConnErrors'),
    label: 'Connection Errors',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'errorRes'),
    label: 'Response Errors',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'connRetries'),
    label: 'Connection Retries',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'deniedRes'),
    label: 'Denied Responses',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('frontendStats', 'reDispatchedReq'),
    label: 'Re-Dispatched Requests',
    min: 0,
    formatter: number
  }
];
