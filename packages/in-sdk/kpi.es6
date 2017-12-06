import pbst from 'in-sdk/util/pluginBasedSnapshotTransformation';
import {
  zeroDecimalPlacesPerSecond,
  percentageTwoDecimalPlaces,
  msTwoDecimalPlaces,
  ms,
  percentage,
  number
} from 'in-services/formatters/number';

const defaultKpis = () => [
  {
    metric: 'count',
    label: 'calls',
    formatter: number,
    valueOnlyFormatter: zeroDecimalPlacesPerSecond,
    timeWindowAggregation: 'sum'
  },
  {
    metric: 'duration.mean',
    label: 'avg. latency',
    formatter: ms,
    valueOnlyFormatter: msTwoDecimalPlaces,
    timeWindowAggregation: 'mean'
  },
  {
    metric: 'error_rate',
    label: 'error rate',
    formatter: percentage,
    valueOnlyFormatter: percentageTwoDecimalPlaces,
    timeWindowAggregation: 'mean'
  }
];

const transformer = pbst('kpi', defaultKpis);

export const addMapping = transformer.addMapping;
export const getKpis = transformer.get;
