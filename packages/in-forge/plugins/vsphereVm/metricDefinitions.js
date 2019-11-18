import { bytes, bytesTwoDecimalPlaces, msZeroDecimalPlaces, percentage, number } from 'in-services/formatters/number';

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
    formatter: msZeroDecimalPlaces
  },
  {
    metric: 'cpu.ready.summation.milliseconds',
    label: 'CPU Ready',
    formatter: msZeroDecimalPlaces
  },
  {
    metric: 'cpu.wait.summation.milliseconds',
    label: 'CPU Wait',
    formatter: msZeroDecimalPlaces
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
    formatter: bytesTwoDecimalPlaces
  },
  {
    metric: 'mem.swapped.none.bytes',
    label: 'Memory Swapped',
    formatter: bytesTwoDecimalPlaces
  },
  {
    metric: 'mem.granted.none.bytes',
    label: 'Memory Granted',
    formatter: bytesTwoDecimalPlaces
  },
  {
    metric: 'mem.vmmemctl.none.bytes',
    label: 'Memory Vmemctl',
    formatter: bytesTwoDecimalPlaces
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
  }
];
