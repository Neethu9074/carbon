/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, millis, percentage, number } from 'in-services/formatters/number';

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
  }
];
