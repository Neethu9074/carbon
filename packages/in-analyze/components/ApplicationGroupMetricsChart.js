import { withProps } from 'recompose';

import GroupMetricsChart, { metricsChartDefinitions } from 'in-analyze/components/GroupMetricsChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';

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

export default withProps(({ filters, metrics, availableMetrics }) => ({
  timeConfig: filters.timeConfig,
  chartDefinitions: countChartDefinitions.concat(metricsChartDefinitions(metrics, availableMetrics))
}))(GroupMetricsChart);
