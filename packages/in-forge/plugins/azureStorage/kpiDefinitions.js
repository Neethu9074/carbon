/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.azureStorage.labelTrTo'),
    metric: 'tr_to',
    formatter: number.detailed
  },
  {
    label: t('in-forge:plugins.azureStorage.labelInAv'),
    metric: 'in_av',
    formatter: bytes.compact
  }
];
