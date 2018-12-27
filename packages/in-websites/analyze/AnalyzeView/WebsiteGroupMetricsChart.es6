import { withProps } from 'recompose';

import GroupMetricsChart from 'in-analyze/components/GroupMetricsChart';
import { millis, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';

const chartDefinitions = [
  {
    label: 'Duration',
    key: 'beaconDuration',
    renderer: Renderer.stackedArea,
    aggregation: 'MEAN',
    formatter: millis.fixed,
    min: 0
  },
  {
    label: 'Count',
    key: 'beaconCount',
    renderer: Renderer.stackedBar,
    aggregation: 'SUM',
    formatter: number.forcedCompact,
    min: 0
  }
];

export default withProps({
  chartDefinitions
})(GroupMetricsChart);
