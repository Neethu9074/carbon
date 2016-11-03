import {
  siPrefix,
  millis,
  number,
  bytes
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


export default [
  {
    metrics: [
      'threads.new',
      'threads.runnable',
      'threads.timed-waiting',
      'threads.waiting',
      'threads.blocked',
      'threads.terminated'
    ],
    labels: [
      'New',
      'Runnable',
      'Timed-Waiting',
      'Waiting',
      'Blocked',
      'Terminated'
    ],
    min: 0,
    category: ['Threads'],
    formatter: number
  },
  {
    metric: 'memory.used',
    label: 'Used',
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'memory.max']);
    },
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: getMetricMatch('gc', 'time'),
    label(snapshot, metricMatch) {
      // is that correct ?
      return metricMatch + 'Time';
    },
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('gc', 'inv'),
    label(snapshot, metricMatch) {
      // is that correct ?
      return metricMatch + 'Invocations';
    },
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('jmx'),
    label(snapshot, metricMatch) {
      // is that correct ?
      return metricMatch;
    },
    min: 0,
    formatter: siPrefix
  }

  // I don't have a fucking clue how to translate MemoryPoolsTable because label and max are depending on the name
];
