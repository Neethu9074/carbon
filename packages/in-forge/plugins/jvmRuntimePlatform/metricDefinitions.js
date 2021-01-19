/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getCustomMetricMatch, getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { siPrefix, micros, millis, number, bytes, percentage } from 'in-services/formatters/number';

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
    metrics: ['memory.usedPercentage'],
    labels: ['Used percentage'],
    min: 0,
    max: 1,
    category: ['Memory'],
    formatter: percentage
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
    metric: getDynamicMetricMatch('gc', 'time', 'Garbage Collector'),
    label: getLabel('Time'),
    category: ['GC'],
    min: 0,
    formatter: millis.forcedFixedCompact
  },
  {
    metric: getDynamicMetricMatch('gc', 'inv', 'Garbage Collector'),
    label: getLabel('Invocations'),
    category: ['GC'],
    min: 0,
    formatter: number
  },
  {
    metric: getCustomMetricMatch('jmx'),
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
    metric: getDynamicMetricMatch('pools', null, 'Pool'),
    label: getLabel('Pool'),
    category: ['Pools'],
    formatter: bytes
  }
];
