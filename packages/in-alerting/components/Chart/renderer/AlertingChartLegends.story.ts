/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createLineWithThreshold } from 'in-alerting/components/Chart/renderer/Renderer';
import oldTheme from 'in-themes';
import { fixedTimestamp, generateMetrics } from 'in-test/util/generateMetrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { days } from 'in-services/time';

const oneDay = days.toMillis(1);

const granularity = null;

const metricsBarWithBaseline = [generateMetrics(40, 100, oneDay / 6)];

export default {
  component: ResultAwareChart
};

export const ExcludeLegends = {
  args: {
    result: {
      errors: [],
      progress: {
        loading: false
      }
    },
    config: {
      timeConfig: generateTimeframe(oneDay / 6),
      granularity,
      y1: {
        metricIds: ['latency', 'threshold'],
        excludedLabelsFromTooltip: ['Violations'],
        icons: {
          types: ['lib_line_chart', 'lib_threshold', 'lib_actions_stop', 'lib_actions_stop'],
          colors: [oldTheme.lib.colors.lightBlue800, oldTheme.lib.colors.red800, oldTheme.lib.colors.orange800]
        },
        getMax: (metricsMaxValue: number) => metricsMaxValue * 1.4,
        colors: [oldTheme.lib.colors.lightBlue800, oldTheme.lib.colors.red800, oldTheme.lib.colors.orange800],
        renderer: createLineWithThreshold('>', granularity),
        metrics: metricsBarWithBaseline,
        labels: ['Latency', 'Threshold', 'Violations'],
        excludedLabelsFromLegend: ['Threshold']
      }
    }
  }
};

function generateTimeframe(windowSize: number) {
  return {
    windowSize,
    to: fixedTimestamp
  };
}
