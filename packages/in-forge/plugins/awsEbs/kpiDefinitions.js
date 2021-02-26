/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsEbs.labelReadBytes'),
    metric: 'read_bytes',
    formatter: bytes.compact
  },
  {
    label: t('in-forge:plugins.awsEbs.labelReadOperations'),
    metric: 'read_ops',
    formatter: number.compact
  }
];
