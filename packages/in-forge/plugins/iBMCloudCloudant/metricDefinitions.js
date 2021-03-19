/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { identity } from 'in-services/formatters/string';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['http_requests_total'],
    labels: [t('in-forge:plugins.iBMCloudCloudant.labelHTTPRequestsTotal')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['name'],
    labels: [t('in-forge:plugins.iBMCloudCloudant.labelName')],
    min: 0,
    formatter: identity
  }
];
