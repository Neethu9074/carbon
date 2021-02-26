/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsKinesis.titleGetRecords'),
    metric: 'get_records_records',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.awsKinesis.titlePutRecords'),
    metric: 'put_records_records',
    formatter: number.compact
  }
];
