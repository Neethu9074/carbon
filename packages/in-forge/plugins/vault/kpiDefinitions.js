/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.vault.titleSecretsCreated'),
    metric: 'secret.create.count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.vault.titleSecretsRead'),
    metric: 'secret.read.count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.vault.titleTokensLookup'),
    metric: 'ttoken.lookup.count',
    formatters: number.compact
  }
];
