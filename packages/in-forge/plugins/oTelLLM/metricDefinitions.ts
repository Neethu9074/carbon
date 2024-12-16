/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['llm.status'],
    labels: [t('in-forge:plugins.oTelLLM.llm_status')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    formatter: number
  }
];
