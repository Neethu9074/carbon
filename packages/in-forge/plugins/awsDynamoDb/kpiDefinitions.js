/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsDynamoDb.labelProvisionedReadCapacity'),
    metric: 'provisioned_read',
    formatter: number.detailed
  },
  {
    label: t('in-forge:plugins.awsDynamoDb.labelThrottledReadRequestsGet'),
    metric: 'throttled_get',
    formatter: number.compact
  }
];
