/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { bytes, number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpuUsage'],
    labels: [t('in-forge:plugins.powerVCHypervisor.cpuUsage')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['memoryUsage'],
    labels: [t('in-forge:plugins.powerVCHypervisor.memoryUsage')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['instanceCount'],
    labels: [t('in-forge:plugins.powerVCHypervisor.instanceCount')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['storageUsage'],
    labels: [t('in-forge:plugins.powerVCHypervisor.storageUsage')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['currentWorkload'],
    labels: [t('in-forge:plugins.powerVCHypervisor.currentWorkload')],
    min: 0,
    formatter: number
  }
];
