/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, bytes, millis } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'all_requests',
      'get_requests',
      'put_requests',
      'delete_requests',
      'head_requests',
      'post_requests',
      'list_requests'
    ],
    labels: [
      t('in-forge:plugins.awsS3.allRequests'),
      t('in-forge:plugins.awsS3.getRequests'),
      t('in-forge:plugins.awsS3.putRequests'),
      t('in-forge:plugins.awsS3.deleteRequests'),
      t('in-forge:plugins.awsS3.headRequests'),
      t('in-forge:plugins.awsS3.postRequests'),
      t('in-forge:plugins.awsS3.listRequests')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['bytes_downloaded', 'bytes_uploaded'],
    labels: [t('in-forge:plugins.awsS3.downloaded'), t('in-forge:plugins.awsS3.uploaded')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['4xx_errors', '5xx_errors'],
    labels: [
      ('in-forge:plugins.awsS3.clientHttp4Xx', 'Client HTTP 4xx'),
      ('in-forge:plugins.awsS3.serverHttp5Xx', 'Server HTTP 5xx')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['first_byte_latency', 'total_request_latency'],
    labels: [t('in-forge:plugins.awsS3.firstByteLatency'), t('in-forge:plugins.awsS3.totalRequestLatency')],
    min: 0,
    formatter: millis
  }
];
