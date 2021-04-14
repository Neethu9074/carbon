/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: 'API Calls',
    metric: t('in-forge:plugins.ibmCloudClinicalData.labelCallsCount'),
    formatter: number.compact
  },
  {
    label: 'Request Size',
    metric: t('in-forge:plugins.ibmCloudClinicalData.labelRequestSizeBytes'),
    formatter: bytes.detailed
  }
];
