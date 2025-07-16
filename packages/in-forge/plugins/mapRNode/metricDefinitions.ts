/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { percentagePlain, number, kiloBytes, megaBytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.utilization'],
    labels: [t('in-forge:plugins.maprNode.utilization')],
    min: 0,
    formatter: percentagePlain.compact
  },
  {
    metrics: ['metrics.disk.diskReads'],
    labels: [t('in-forge:plugins.maprNode.diskReads')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['metrics.disk.diskWrites'],
    labels: [t('in-forge:plugins.maprNode.diskWrites')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['metrics.disk.diskReadKB'],
    labels: [t('in-forge:plugins.maprNode.diskReadKB')],
    min: 0,
    formatter: kiloBytes.detailed
  },
  {
    metrics: ['metrics.disk.diskWriteKB'],
    labels: [t('in-forge:plugins.maprNode.diskWriteKB')],
    min: 0,
    formatter: kiloBytes.detailed
  },
  {
    metrics: ['metrics.disk.usedSpacePercent'],
    labels: [t('in-forge:plugins.maprNode.usedSpacePercent')],
    min: 0,
    formatter: percentagePlain.compact
  },
  {
    metrics: ['metrics.disk.diskTotalSpace'],
    labels: [t('in-forge:plugins.maprNode.totalSpace')],
    min: 0,
    formatter: megaBytes.detailed
  },
  {
    metrics: ['metrics.disk.diskUsedSpace'],
    labels: [t('in-forge:plugins.maprNode.usedSpace')],
    min: 0,
    formatter: megaBytes.detailed
  },
  {
    metrics: ['metrics.disk.diskAvailableSpace'],
    labels: [t('in-forge:plugins.maprNode.availableSpace')],
    min: 0,
    formatter: megaBytes.detailed
  }
];
