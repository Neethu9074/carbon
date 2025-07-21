/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

import { TimeConfig } from '@instana/types';

import { propTypeTimeConfig } from 'in-stores/time/config';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

export const chartViewConfigPropType = PropTypes.shape({
  label: PropTypes.string,
  timeConfig: propTypeTimeConfig.isRequired
});

export interface ChartViewConfigItem {
  label: string;
  timeConfig: TimeConfig;
}

export const chartViewConfig24hours: ChartViewConfigItem = {
  label: t('in-alerting:components.chart.chartViewConfigsLast24Hours'),
  timeConfig: {
    autoRefresh: false,
    windowSize: days.toMillis(1)
  }
};

export const chartViewConfig7days: ChartViewConfigItem = {
  label: t('in-alerting:components.chart.chartViewConfigsLast7Days'),
  timeConfig: {
    autoRefresh: false,
    windowSize: days.toMillis(7)
  }
};
/**
 * View configuration for charts supporting to show the data in different time frames.
 */
export const chartViewConfigs: readonly ChartViewConfigItem[] = Object.freeze([
  chartViewConfig24hours,
  chartViewConfig7days
]);

export function createDefaultChartConfig(timeConfig: TimeConfig): { timeConfig: TimeConfig } {
  return {
    timeConfig
  };
}
