/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsS3.allRequests'),
    metric: 'all_requests',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.awsS3.downloadedTraffic'),
    metric: 'bytes_downloaded',
    formatters: bytes.compact
  }
];
