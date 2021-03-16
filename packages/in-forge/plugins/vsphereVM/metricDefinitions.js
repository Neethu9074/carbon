/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, millis, percentage, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpu.usage.maximum.percent',
    label: t('in-forge:plugins.vsphereHost.labelCPUUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'cpu.readiness.average.percent',
    label: t('in-forge:plugins.vsphereHost.labelCPUReadiness'),
    formatter: percentage.detailed
  },
  {
    metric: 'cpu.system.summation.milliseconds',
    label: t('in-forge:plugins.vsphereHost.labelCPUSystem'),
    formatter: millis.compact
  },
  {
    metric: 'cpu.ready.summation.milliseconds',
    label: t('in-forge:plugins.vsphereHost.labelCPUReady'),
    formatter: millis.compact
  },
  {
    metric: 'cpu.wait.summation.milliseconds',
    label: t('in-forge:plugins.vsphereHost.labelCPUWait'),
    formatter: millis.compact
  },
  {
    metric: 'cpu.latency.average.percent',
    label: t('in-forge:plugins.vsphereHost.labelCPULatency'),
    formatter: percentage.detailed
  },
  {
    metric: 'mem.usage.average.percent',
    label: t('in-forge:plugins.vsphereHost.labelMemoryUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'mem.active.none.bytes',
    label: t('in-forge:plugins.vsphereHost.labelMemoryActive'),
    formatter: bytes.detailed
  },
  {
    metric: 'mem.swapped.none.bytes',
    label: t('in-forge:plugins.vsphereHost.labelMemorySwapped'),
    formatter: bytes.detailed
  },
  {
    metric: 'mem.granted.none.bytes',
    label: t('in-forge:plugins.vsphereHost.labelMemoryGranted'),
    formatter: bytes.detailed
  },
  {
    metric: 'mem.vmmemctl.none.bytes',
    label: t('in-forge:plugins.vsphereHost.labelMemoryVmemctl'),
    formatter: bytes.detailed
  },
  {
    metric: 'net.received.average.bytesPerSecond',
    label: t('in-forge:plugins.vsphereHost.labelBytesReceived'),
    formatter: bytes.perSecond
  },
  {
    metric: 'net.transmitted.average.bytesPerSecond',
    label: t('in-forge:plugins.vsphereHost.labelBytesTransmitted'),
    formatter: bytes.perSecond
  },
  {
    metric: 'net.bytestotal.average.bytesPerSecond',
    label: t('in-forge:plugins.vsphereHost.labelTotalBytes'),
    formatter: bytes.perSecond
  },
  {
    metric: 'net.packetsRx.summation.number',
    label: t('in-forge:plugins.vsphereHost.labelPacketsReceived'),
    formatter: number.compact
  },
  {
    metric: 'net.packetsTx.summation.number',
    label: t('in-forge:plugins.vsphereHost.labelPacketsTransmitted'),
    formatter: number.compact
  },
  {
    metric: 'net.packetsTotal.summation.number',
    label: t('in-forge:plugins.vsphereHost.labelTotalPackets'),
    formatter: number.compact
  }
];
