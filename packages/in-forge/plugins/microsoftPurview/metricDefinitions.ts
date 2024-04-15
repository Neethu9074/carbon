/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { bytesZeroDecimalPlaces, number, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['dataMapStorageSize'],
    labels: [t('in-forge:plugins.microsoftPurview.labelDataMapStorageSize')],
    category: [t('in-forge:plugins.microsoftPurview.labelDataMap')],
    formatter: bytesZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['dataMapCapacityUnits'],
    labels: [t('in-forge:plugins.microsoftPurview.labelDataMapCapacityUnits')],
    category: [t('in-forge:plugins.microsoftPurview.labelDataMap')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['scanCancelled'],
    labels: [t('in-forge:plugins.microsoftPurview.labelScanCancelled')],
    category: [t('in-forge:plugins.microsoftPurview.labelScans')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['scanFailed'],
    labels: [t('in-forge:plugins.microsoftPurview.labelScanFailed')],
    category: [t('in-forge:plugins.microsoftPurview.labelScans')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['scanCompleted'],
    labels: [t('in-forge:plugins.microsoftPurview.labelScanCompleted')],
    category: [t('in-forge:plugins.microsoftPurview.labelScans')],
    formatter: number.compact,
    min: 0
  },
  {
    metrics: ['scanTimeTaken'],
    labels: [t('in-forge:plugins.microsoftPurview.labelScanTimeTaken')],
    category: [t('in-forge:plugins.microsoftPurview.labelScans')],
    formatter: seconds.fixedCompact,
    min: 0
  }
];
