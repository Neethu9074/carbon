/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export const sloMetrics = {
  ERROR_BUDGET_REMAINING: {
    label: t('in-custom-dashboards:widgets.srcSlo.formComponent.errorBudgetRemaining'),
    formatter: number.compact
  },
  STATUS: { label: t('in-custom-dashboards:widgets.srcSlo.formComponent.status'), formatter: percentage }
} as const;

export type SloMetric = keyof typeof sloMetrics;
