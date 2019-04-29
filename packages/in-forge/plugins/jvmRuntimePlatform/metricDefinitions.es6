import { siPrefix, micros, millis, number, bytes } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['threads.new', 'threads.runnable', 'threads.timed-waiting', 'threads.waiting', 'threads.blocked'],
    labels: ['New', 'Runnable', 'Timed-Waiting', 'Waiting', 'Blocked'],
    min: 0,
    category: ['Threads'],
    formatter: number
  },
  {
    metric: 'suspension.time',
    label: 'Time',
    min: 0,
    category: ['Suspension'],
    formatter: micros
  },
  {
    metrics: ['memory.used', 'memory.free'],
    labels: ['Used', 'Free'],
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
      // TODO: use correct labeling
      return metricMatch + 'Time';
    },
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('gc', 'inv'),
    label(snapshot, metricMatch) {
      // TODO: use correct labeling
      return metricMatch + 'Invocations';
    },
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('jmx'),
    label(snapshot, metricMatch) {
      // TODO: use correct labeling
      return metricMatch;
    },
    min: 0,
    formatter: siPrefix
  },
  {
    metric: 'threads.deadlocked',
    label: 'Number of threads deadlocked',
    formatter: number
  },
  {
    metric: getMetricMatch('pools', 'Perm Gen'),
    label(snapshot, metricMatch) {
      return metricMatch + ' Perm Gen';
    },
    formatter: bytes
  }
  // TODO: Implement MemoryPoolsTable metricss
];
