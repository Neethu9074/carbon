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
    label: 'calls/s',
    formatter: zeroDecimalPlaces,
    valueOnlyFormatter: zeroDecimalPlacesPerSecond
  }, {
    metric: 'duration.mean',
    label: 'avg. latency',
    formatter: msTwoDecimalPlaces,
    valueOnlyFormatter: msTwoDecimalPlaces
  }, {
    metric: 'error_rate',
    label: 'error rate',
    formatter: percentageTwoDecimalPlaces,
    valueOnlyFormatter: percentageTwoDecimalPlaces
  }
];

const transformer = pbst('kpi', defaultKpis);

export const addMapping = transformer.addMapping;
export const getKpis = transformer.get;
