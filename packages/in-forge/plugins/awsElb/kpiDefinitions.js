/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytes } from 'in-services/formatters/number';

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
