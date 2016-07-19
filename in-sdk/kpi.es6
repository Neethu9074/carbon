import pbst from 'in-sdk/util/pluginBasedSnapshotTransformation';
import {
  zeroDecimalPlacesPerSecond,
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
    metric: 'error_count',
    label: 'errors/s',
    formatter: zeroDecimalPlaces,
    valueOnlyFormatter: zeroDecimalPlacesPerSecond
  }
];

const transformer = pbst('kpi', defaultKpis);

export const addMapping = transformer.addMapping;
export const getKpis = transformer.get;
