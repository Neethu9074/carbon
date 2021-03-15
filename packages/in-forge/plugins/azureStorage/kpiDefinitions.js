/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
