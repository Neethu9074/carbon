/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number, bytes, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['calls_count'],
    labels: [t('in-forge:plugins.ibmCloudClinicalData.labelCallsCount')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['request_size_bytes'],
    labels: [t('in-forge:plugins.ibmCloudClinicalData.labelRequestSizeBytes')],
    min: 0,
    formatter: bytes.detailed
  },
  {
    metrics: ['time_seconds'],
    labels: [t('in-forge:plugins.ibmCloudClinicalData.labelTimeSeconds')],
    min: 0,
    formatter: seconds.fixedCompact
  }
];
