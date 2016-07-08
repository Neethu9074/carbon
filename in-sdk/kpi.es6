import pbst from 'in-sdk/util/pluginBasedSnapshotTransformation';
import {
  msZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';

const defaultKpis = () => [
  {
    metric: 'count',
    label: 'calls/s',
    formatter: zeroDecimalPlaces
  }, {
    metric: 'duration.stats.95th',
    label: 'latency 95th',
    formatter: msZeroDecimalPlaces
  }, {
    metric: 'error_count',
    label: 'errors/s',
    formatter: zeroDecimalPlaces
  }
];

const transformer = pbst('kpi', defaultKpis);

export const addMapping = transformer.addMapping;
export const getKpis = transformer.get;
