import {
  millis,
  number
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


export default [
  {
    metrics: [
      'metrics.requests',
      'metrics.statusCode.1xx',
      'metrics.statusCode.2xx',
      'metrics.statusCode.3xx',
      'metrics.statusCode.4xx',
      'metrics.statusCode.5xx'
    ],
    labels: [
      'All Requests',
      'Requests with Status Code 1xx',
      'Requests with Status Code 2xx',
      'Requests with Status Code 3xx',
      'Requests with Status Code 4xx',
      'Requests with Status Code 5xx'
    ],
    min: 0,
    category: ['Requests'],
    formatter: number
  },
  {
    metric: 'metrics.httpsessions.active',
    label: 'Active Sessions',
    min: 0,
    category: ['Sessions'],
    formatter: number,
    isAvailable(snapshot) {
       return snapshot.getIn(['data', 'httpsessionsMax'], false);
    }
  },
  {
    metric: getMetricMatch('endpoint', '1xx'),
    label: 'Requests with Status Code 1xx',
    min: 0,
    category: ['Endpoints'],
    formatter: millis
  },
  {
    metric: getMetricMatch('endpoint', '2xx'),
    label: 'Requests with Status Code 2xx',
    min: 0,
    category: ['Endpoints'],
    formatter: millis
  },
  {
    metric: getMetricMatch('endpoint', '3xx'),
    label: 'Requests with Status Code 3xx',
    min: 0,
    category: ['Endpoints'],
    formatter: millis
  },
  {
    metric: getMetricMatch('endpoint', '4xx'),
    label: 'Requests with Status Code 4xx',
    min: 0,
    category: ['Endpoints'],
    formatter: millis
  },
  {
    metric: getMetricMatch('endpoint', '5xx'),
    label: 'Requests with Status Code 5xx',
    min: 0,
    category: ['Endpoints'],
    formatter: millis
  },
  {
    metric: getMetricMatch('endpoint'),
    label: 'All Requests',
    min: 0,
    category: ['Endpoints'],
    formatter: millis
  }
];
