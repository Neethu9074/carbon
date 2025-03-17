/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { TimeConfig } from '@instana/types';

import { FilterResult } from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';

export interface WidgetProps<T> {
  actions: React.ReactNode;
  config: T;
  title: string;
  dragHandle: React.ReactNode;
  isPreview?: boolean;
  timeConfig: TimeConfig;
  isInModal?: boolean;
  filterResult?: FilterResult;
  widgetId: string;
}
