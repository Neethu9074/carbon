import { withProps } from 'recompose';
import { find } from 'lodash';

import GroupMetricsChart from 'in-analyze/components/GroupMetricsChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { aggregationLabels } from 'in-stores/metric/metric';
import { number } from 'in-services/formatters/number';

const countChartDefinition = {
  label: 'Count',
  key: 'beaconCount_SUM',
  renderer: Renderer.stackedBar,
  aggregation: 'SUM',
  formatter: number.forcedCompact,
  min: 0
};

export default withProps(({ metrics, availableMetrics }) => ({
  groupNameProcessor: v => JSON.parse(v),
  chartDefinitions: [countChartDefinition].concat(
    metrics.map(({ metric, aggregation }) => {
      let label = `${metric} (${aggregation})`;
      let renderer = Renderer.line;
      let formatter = number;
      let min;

      const metricDefinition = find(availableMetrics, m => m.metric === metric);
      if (metricDefinition) {
        label = metricDefinition.label;
        renderer = metricDefinition.preferredRenderer;
        formatter = metricDefinition.formatter;
        min = metricDefinition.min;

        if (metricDefinition.supportedAggregations.length > 1) {
          label += ` (${aggregationLabels[aggregation]})`;
        }
      }

      return {
        label,
        key: `${metric}_${aggregation}`,
        renderer,
        aggregation,
        formatter,
        min
      };
    })
  )
}))(GroupMetricsChart);
