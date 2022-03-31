/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { TimeShift } from 'in-types';
import theme from 'in-themes';

export function getChartTestMetrics(
  locations: [],
  testMetricConfig: Metric,
  timeShiftConfig: TimeShift,
  metric: string
) {
  const testMetrics = [];

  for (let i = 0; i < locations.length; i++) {
    let test = {
      config: testMetricConfig,
      metric: metric,
      label: `${locations[i]}`,
      color: theme.lib.colors.chart.strokeColors25[i],
      defaultDisabled: !timeShiftConfig.offset
    };
    testMetrics.push(test);
  }

  return testMetrics;
}
