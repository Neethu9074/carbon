/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { kiloBytesTwoDecimalPlaces, percentage, kiloBytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'vmCpuUsage',
    label: t('in-windowshypervisor:cpuUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'vmMemoryUsage',
    label: t('in-windowshypervisor:memoryUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'totalDiskStorage',
    label: t('in-windowshypervisor:dashboards.vm.totalDiskStorage'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'avgCPU',
    label: t('in-windowshypervisor:dashboards.vm.cpu'),
    formatter: percentage.detailed
  },
  {
    metric: 'avgRAM',
    label: t('in-windowshypervisor:dashboards.vm.ram'),
    formatter: percentage.detailed
  },
  {
    metric: 'networkInbound',
    label: t('in-windowshypervisor:dashboards.vm.networkInboundBytes'),
    formatter: kiloBytes.detailed
  },
  {
    metric: 'networkOutbound',
    label: t('in-windowshypervisor:dashboards.vm.networkOutboundBytes'),
    formatter: kiloBytes.detailed
  }
];
