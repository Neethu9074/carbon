import { siPrefix, micros, millis, number, bytes } from 'in-services/formatters/number';
import { getMetricMatch, getMetricMatchDefinition } from 'in-sdk/metrics/metricDefinitions';

function getLabel(postfix) {
  return (snapshot, match) => (match?.length > 1 ? `${match[1]} ${postfix}` : postfix);
}

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
    metric: getMetricMatchDefinition('gc', 'time', 'Garbage Collection'),
    label: getLabel('Time'),
    category: ['GC'],
    min: 0,
    formatter: millis.forcedFixedCompact
  },
  {
    metric: getMetricMatchDefinition('gc', 'inv', 'Garbage Collection'),
    label: getLabel('Invocations'),
    category: ['GC'],
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('jmx'), // custom metric
    label(snapshot, metricMatch) {
      return metricMatch;
    },
    min: 0,
    formatter: siPrefix
  },
  {
    metric: 'threads.deadlocked',
    label: 'Number of threads deadlocked',
    category: ['Threads'],
    formatter: number
  },
  {
    metric: getMetricMatchDefinition('pools', 'Perm Gen', 'Pool'),
    label: getLabel('Perm Gen'),
    category: ['Pools'],
    formatter: bytes
  }
  // TODO: Implement MemoryPoolsTable metricss
];
