/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    key: 'callsAgg',
    label: t('in-components:stack.apkpisLabelCalls'),
    formatter: number.compact
  },
  {
    key: 'erroneousCalls',
    label: t('in-components:stack.apkpisLabelErroneousCalls'),
    formatter: number.compact
  }
];
