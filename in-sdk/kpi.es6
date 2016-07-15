import pbst from 'in-sdk/util/pluginBasedSnapshotTransformation';
import {
  twoDecimalPlacesPerSecond,
  msTwoDecimalPlaces,
  twoDecimalPlaces
} from 'in-services/formatters/number';

const defaultKpis = () => [
  {
    metric: 'count',
    label: 'calls/s',
    formatter: twoDecimalPlaces,
    valueOnlyformatter: twoDecimalPlacesPerSecond
  }, {
    metric: 'duration.mean',
    label: 'avg. latency',
    formatter: msTwoDecimalPlaces,
    valueOnlyformatter: msTwoDecimalPlaces
  }, {
    metric: 'error_count',
    label: 'errors/s',
    formatter: twoDecimalPlaces,
    valueOnlyformatter: twoDecimalPlacesPerSecond
  }
];

const transformer = pbst('kpi', defaultKpis);

export const addMapping = transformer.addMapping;
export const getKpis = transformer.get;
