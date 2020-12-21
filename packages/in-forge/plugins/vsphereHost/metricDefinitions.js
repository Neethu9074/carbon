import { bytes, millis, percentage, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: 'cpu.usage.maximum.percent',
    label: 'CPU Usage',
    formatter: percentage.detailed
  },
  {
    metric: 'cpu.readiness.average.percent',
    label: 'CPU Readiness',
    formatter: percentage.detailed
  },
  {
    metric: 'cpu.system.summation.milliseconds',
    label: 'CPU System',
    formatter: millis.compact
  },
  {
    metric: 'cpu.ready.summation.milliseconds',
    label: 'CPU Ready',
    formatter: millis.compact
  },
  {
    metric: 'cpu.wait.summation.milliseconds',
    label: 'CPU Wait',
    formatter: millis.compact
  },
  {
    metric: 'cpu.latency.average.percent',
    label: 'CPU Latency',
    formatter: percentage.detailed
  },
  {
    metric: 'mem.usage.average.percent',
    label: 'Memory Usage',
    formatter: percentage.detailed
  },
  {
    metric: 'mem.active.none.bytes',
    label: 'Memory Active',
    formatter: bytes.detailed
  },
  {
    metric: 'mem.swapped.none.bytes',
    label: 'Memory Swapped',
    formatter: bytes.detailed
  },
  {
    metric: 'mem.granted.none.bytes',
    label: 'Memory Granted',
    formatter: bytes.detailed
  },
  {
    metric: 'mem.vmmemctl.none.bytes',
    label: 'Memory Vmemctl',
    formatter: bytes.detailed
  },
  {
    metric: 'net.received.average.bytesPerSecond',
    label: 'Bytes received',
    formatter: bytes.perSecond
  },
  {
    metric: 'net.transmitted.average.bytesPerSecond',
    label: 'Bytes transmitted',
    formatter: bytes.perSecond
  },
  {
    metric: 'net.bytestotal.average.bytesPerSecond',
    label: 'Total bytes',
    formatter: bytes.perSecond
  },
  {
    metric: 'net.packetsRx.summation.number',
    label: 'Packets received',
    formatter: number.compact
  },
  {
    metric: 'net.packetsTx.summation.number',
    label: 'Packets transmitted',
    formatter: number.compact
  },
  {
    metric: 'net.packetsTotal.summation.number',
    label: 'Total packets',
    formatter: number.compact
  },

  // Datastore metrics
  {
    metric: getDynamicMetricMatch('datastore.datastoreReadIops.number.latest', null, 'Filesystem ID'),
    label: 'IOPS Read',
    min: 0,
    category: ['Datastore'],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('datastore.datastoreWriteIops.number.latest', null, 'Filesystem ID'),
    label: 'IOPS Write',
    min: 0,
    category: ['Datastore'],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('datastore.datastoreTotalIops.number.latest', null, 'Filesystem ID'),
    label: 'IOPS Total',
    min: 0,
    category: ['Datastore'],
    formatter: number.compact
  },

  {
    metric: getDynamicMetricMatch('datastore.numberReadAveraged.number.average', null, 'Filesystem ID'),
    label: 'Read/s',
    min: 0,
    category: ['Datastore'],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('datastore.numberWriteAveraged.number.average', null, 'Filesystem ID'),
    label: 'Write/s',
    min: 0,
    category: ['Datastore'],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('datastore.datastoreReadBytes.number.latest', null, 'Filesystem ID'),
    label: 'Byte Read/s',
    min: 0,
    category: ['Datastore'],
    formatter: bytes.compact
  },
  {
    metric: getDynamicMetricMatch('datastore.datastoreWriteBytes.number.latest', null, 'Filesystem ID'),
    label: 'Byte Write/s',
    min: 0,
    category: ['Datastore'],
    formatter: bytes.compact
  },

  {
    metric: getDynamicMetricMatch('datastore.datastoreNormalReadLatency.number.latest', null, 'Filesystem ID'),
    label: 'Latency Read',
    min: 0,
    category: ['Datastore'],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('datastore.datastoreNormalWriteLatency.number.latest', null, 'Filesystem ID'),
    label: 'Latency Write',
    min: 0,
    category: ['Datastore'],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('datastore.datastoreNormalTotalLatency.number.latest', null, 'Filesystem ID'),
    label: 'Latency Total',
    min: 0,
    category: ['Datastore'],
    formatter: number.compact
  }
];
