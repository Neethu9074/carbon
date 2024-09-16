/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { SloEntityType } from '@instana/types';

import { SloWidgetChartType } from 'in-custom-dashboards/widgets/Slo/constants';

export interface SloWidgetConfiguration {
  entityType: SloEntityType;
  sloId: string;
  chartType: SloWidgetChartType;
}

export interface CreateSloFormSlideState {
  mode?: 'CREATE' | 'EDIT';
  onCloseSlide?: VoidFunction;
}
