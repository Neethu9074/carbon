/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export const SloWidgetChartVariant = Object.freeze({
  INDICATOR: 'INDICATOR',
  ERROR_BUDGET: 'ERROR_BUDGET'
} as const);
export type SloWidgetChartType = keyof typeof SloWidgetChartVariant;
export const SloWidgetChartTypes = Object.freeze(Object.values(SloWidgetChartVariant));
