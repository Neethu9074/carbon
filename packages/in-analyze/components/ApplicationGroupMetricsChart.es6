import { compose, withProps } from 'recompose';

import { millis, percentage, number } from 'in-services/formatters/number';
import GroupMetricsChart from 'in-analyze/components/GroupMetricsChart';
import Renderer from 'in-components/Chart/renderer/Renderer';

const chartDefinitions = [
  {
    label: 'Latency',
    key: 'latency',
    renderer: Renderer.line,
    formatter: millis.fixed,
    min: 0
  },
  {
    label: 'Calls',
    key: 'calls',
    renderer: Renderer.line,
    aggregation: 'SUM',
    formatter: number.forcedCompact,
    min: 0
  },
  {
    label: 'Traces',
    key: 'traces',
    renderer: Renderer.line,
    aggregation: 'SUM',
    formatter: number.forcedCompact,
    min: 0
  },
  {
    label: 'Errors',
    key: 'errors',
    renderer: Renderer.line,
    aggregation: 'MEAN',
    formatter: percentage,
    min: 0
  }
];

export default compose(
  withProps(({ filters }) => ({
    chartDefinitions,
    timeConfig: filters.get('timeConfig')
  }))
)(GroupMetricsChart);
