/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

import { propTypeTimeConfig } from 'in-stores/time/config';
import { days } from 'in-services/time';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

export const chartViewConfigPropType = PropTypes.shape({
  label: PropTypes.string,
  timeConfig: propTypeTimeConfig.isRequired
});

/**
 * View configuration for charts supporting to show the data in different time frames.
 */
export const chartViewConfigs = Object.freeze([
  {
    label: t('in-alerting:components.chart.chartViewConfigsLast24Hours'),
    timeConfig: {
      windowSize: days.toMillis(1)
    }
  },
  {
    label: t('in-alerting:components.chart.chartViewConfigsLast7Days'),
    timeConfig: {
      windowSize: days.toMillis(7)
    }
  }
]);

export function createDefaultChartConfig(timeConfig: TimeConfig): { timeConfig: TimeConfig } {
  return {
    timeConfig
  };
}
