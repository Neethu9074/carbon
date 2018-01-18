import { ms, number } from 'in-services/formatters/number';

export default [
  {
    metric: 'count',
    label: 'Page Loads',
    category: ['Page Loads'],
    min: 0,
    formatter: number
  },
  {
    metric: 'duration.mean',
    label: 'Mean Load Time',
    category: ['Page Loads'],
    min: 0,
    formatter: ms
  },

  {
    metrics: ['duration.50th', 'duration.90th', 'duration.95th', 'duration.98th', 'duration.99th'],
    labels: ['Load Time 50th', 'Load Time 90th', 'Load Time 95th', 'Load Time 98th', 'Load Time 99th'],
    category: ['Page Loads'],
    min: 0,
    formatter: ms,
    isPercentile: true
  },
  {
    metrics: ['unl', 'red', 'apc', 'dns', 'tcp', 'ssl', 'req', 'rsp', 'dom', 'chi', 'bac', 'fro', 'fp'],
    labels: [
      'Unload Time ',
      'Redirect Time ',
      'AppCache Time ',
      'DNS Time ',
      'TCP Time ',
      'SSL Time ',
      'Request Time ',
      'Response Time ',
      'DOM Processing Time ',
      'Children Time ',
      'Backend Time ',
      'Frontend Time ',
      'First Paint Time '
    ],
    category: ['Page Load Breakdown'],
    min: 0,
    formatter: ms
  },
  {
    metric: 'uncaughtErrors',
    label: 'Errors',
    category: ['Errors'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['xhrCalls', 'xhrErrors'],
    labels: ['Calls', 'Errors'],
    category: ['AJAX / XMLHttpRequest'],
    min: 0,
    formatter: number
  }
];
