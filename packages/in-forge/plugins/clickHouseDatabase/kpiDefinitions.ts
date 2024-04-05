/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.clickhouseDatabase.labelQueryThread'),
    metric: 'QueryThread',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.clickhouseDatabase.labelQueryPreempted'),
    metric: 'QueryPreempted',
    formatter: number.compact
  }
];
