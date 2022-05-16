/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureFunctionApp.labelRqTo'),
    metric: 'rq_to',
    formatter: number.detailed
  },
  {
    label: t('in-forge:plugins.azureFunctionApp.labelBrAv'),
    metric: 'br_av',
    formatter: bytes.compact
  }
];
