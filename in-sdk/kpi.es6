import pbst from 'in-sdk/util/pluginBasedSnapshotTransformation';
import {
  zeroDecimalPlacesPerSecond,
  percentageTwoDecimalPlaces,
  msTwoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';

const defaultKpis = () => [
  {
    metric: 'count',
    label: 'calls',
    formatter: zeroDecimalPlaces,
    valueOnlyFormatter: zeroDecimalPlacesPerSecond,
    timeWindowAggregation: 'adjustedCount'
  },
  {
    metric: 'duration.mean',
    label: 'avg. latency',
    formatter: msTwoDecimalPlaces,
    valueOnlyFormatter: msTwoDecimalPlaces,
    timeWindowAggregation: 'mean'
  },
  {
    metric: 'error_rate',
    label: 'error rate',
    formatter: percentageTwoDecimalPlaces,
    valueOnlyFormatter: percentageTwoDecimalPlaces,
    timeWindowAggregation: 'mean'
  }
];

const transformer = pbst('kpi', defaultKpis);

export const addMapping = transformer.addMapping;
export const getKpis = transformer.get;
