import { withProps } from 'recompose';

import GroupMetricsChart, { metricsChartDefinitions } from 'in-analyze/components/GroupMetricsChart';
import { latencyDistributionBase10Enabled } from 'in-services/featureFlags';
import { number, millis } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';

const countChartDefinitions = [
  {
    label: 'Count',
    key: 'calls_SUM',
    renderer: Renderer.stackedBar,
    aggregation: 'SUM',
    formatter: number.forcedCompact,
    min: 0
  },
  {
    label: 'Count',
    key: 'traces_SUM',
    renderer: Renderer.stackedBar,
    aggregation: 'SUM',
    formatter: number.forcedCompact,
    min: 0
  }
];

const latencyDistributionChartDefinition = [
  {
    label: 'Latency (distribution)',
    key: 'calls_DISTRIBUTION',
    renderer: Renderer.bar,
    aggregation: 'DISTRIBUTION',
    formatter: millis.forcedCompactOnMs,
    min: 0
  }
];

export default withProps(({ filters, metrics, availableMetrics }) => ({
  timeConfig: filters.timeConfig,
  chartDefinitions: (latencyDistributionBase10Enabled ? latencyDistributionChartDefinition : [])
    .concat(metricsChartDefinitions(metrics, availableMetrics))
    .concat(countChartDefinitions)
}))(GroupMetricsChart);
