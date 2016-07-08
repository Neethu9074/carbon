import pbst from 'in-sdk/util/pluginBasedSnapshotTransformation';
import {
  msTwoDecimalPlaces,
  twoDecimalPlaces
} from 'in-services/formatters/number';

const defaultKpis = () => [
  {
    metric: 'count',
    label: 'calls/s',
    formatter: twoDecimalPlaces
  }, {
    metric: 'duration.stats.95th',
    label: 'latency 95th',
    formatter: msTwoDecimalPlaces
  }, {
    metric: 'error_count',
    label: 'errors/s',
    formatter: twoDecimalPlaces
  }
];

const transformer = pbst('kpi', defaultKpis);

export const addMapping = transformer.addMapping;
export const getKpis = transformer.get;
