/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsElb.labelProcessedBytes'),
    metric: 'processed_bytes',
    formatter: bytes.compact
  },
  {
    label: t('in-forge:plugins.awsElb.labelNewFlowCount'),
    metric: 'new_flow_count',
    formatter: bytes.compact
  }
];
