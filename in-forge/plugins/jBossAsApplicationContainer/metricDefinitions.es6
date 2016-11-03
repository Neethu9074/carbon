import {
  millis,
  number
} from 'in-services/formatters/number';


export default [
  {
    metric: /^sessions\.(.*)\.activeSessions$/i,
    label: 'Active Sessions',
    min: 0,
    formatter: number
  },
  {
    metric: /^servlets\.(.*)\.avgResponseTime$/i,
    label: 'Average Response Time',
    min: 0,
    formatter: millis
  },
  {
    metric: /^servlets\.(.*)\.requests$/i,
    label: 'Requests',
    min: 0,
    formatter: number
  },
  {
    metric: /^connectors\.(.*)\.avgResponseTime$/i,
    label: 'Average Response Time',
    min: 0,
    formatter: millis
  },
  {
    metric: /^connectors\.(.*)\.requests$/i,
    label: 'Requests',
    min: 0,
    formatter: number
  },
  {
    metric: /^connectors\.(.*)\.errors$/i,
    label: 'Errors',
    min: 0,
    formatter: number
  }
];
