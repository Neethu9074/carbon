/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
