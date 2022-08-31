/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureFunctionApp.labelReTo'),
    metric: 're_to',
    formatter: number.detailed
  },
  {
    label: t('in-forge:plugins.azureFunctionApp.labelBrAv'),
    metric: 'br_av',
    formatter: bytes.compact
  }
];
