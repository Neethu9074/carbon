import React from 'react';

import stairway, { hourlyBudgetMetricId } from 'in-custom-dashboards/widgets/Slo/renderer/stairway';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import theme from 'in-themes';

export default function Chart({ result, timeConfig, consumed, hourlyBudget, budget }) {
  let metrics = [consumed, hourlyBudget];
  if (hourlyBudget === null || hourlyBudget.length === 0) {
    // TODO replace with a more elegant way, by moving this feature into the renderer
    metrics = [consumed, consumed.map(timeValue => [timeValue[0], budget])];
  }
  return (
    <ResultAwareChart
      cardUseMaxAvailableHeight={false}
      withoutPadding={false}
      customHeight={50}
      result={result}
      config={{
        granularity: 3600 * 1000,
        timeConfig: timeConfig,
        y1: {
          metricIds: ['consumed', hourlyBudgetMetricId],
          labels: ['Spent', 'Budget'],
          icons: {
            types: ['lib_flame', 'lib_actions_stop']
          },
          colors: [theme.lib.colors.blue800, theme.lib.colors.red800],
          renderer: stairway,
          metrics: [...metrics]
        }
      }}
    />
  );
}
