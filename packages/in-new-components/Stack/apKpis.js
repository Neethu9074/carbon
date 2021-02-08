/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    key: 'callsAgg',
    label: t('in-new-components:stack.apkpisLabelCalls'),
    formatter: number.compact
  },
  {
    key: 'erroneousCalls',
    label: t('in-new-components:stack.apkpisLabelErroneousCalls'),
    formatter: number.compact
  }
];
