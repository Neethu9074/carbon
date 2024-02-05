/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { themes } from '@instana/design-tokens';

import { createLineWithThreshold } from 'in-alerting/components/Chart/renderer/Renderer';
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
          types: ['lib_legend_line_chart', 'lib_legend_threshold', 'lib_actions_stop', 'lib_actions_stop'],
          colors: [
            themes.default.ids.color.option.blue['400'],
            themes.default.ids.color.option.red['500'],
            themes.default.ids.color.option.orange['500']
          ]
        },
        getMax: (metricsMaxValue: number) => metricsMaxValue * 1.4,
        colors: [
          themes.default.ids.color.option.blue['400'],
          themes.default.ids.color.option.red['500'],
          themes.default.ids.color.option.orange['500']
        ],
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
