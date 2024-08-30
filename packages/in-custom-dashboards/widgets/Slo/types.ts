/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { SloWidgetChartType } from 'in-custom-dashboards/widgets/Slo/constants';

export interface SloWidgetConfiguration {
  sloId: string;
  chartType: SloWidgetChartType;
}
