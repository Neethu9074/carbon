/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['systemLoad'],
    labels: [t('in-forge:plugins.ibmDataPowerAppliance.systemLoad')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerAppliance.systemLoad')],
    formatter: percentage
  },
  {
    metrics: ['cpuUsage'],
    labels: [t('in-forge:plugins.ibmDataPowerAppliance.cpuUsage')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerAppliance.cpuUsage')],
    formatter: percentage
  },
  {
    metrics: ['encryptedFilesystemUsage'],
    labels: [t('in-forge:plugins.ibmDataPowerAppliance.encryptedFilesystemUsage')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerAppliance.encryptedFilesystemUsage')],
    formatter: percentage
  },
  {
    metrics: ['connectionAccepted'],
    labels: [t('in-forge:plugins.ibmDataPowerAppliance.connectionAccepted')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerAppliance.connectionAccepted')],
    formatter: number
  }
];
