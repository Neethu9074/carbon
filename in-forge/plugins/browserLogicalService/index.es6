import { zeroDecimalPlacesPerSecond, msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import { addMapping } from 'in-sdk/kpi';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.browserLogicalService,
  iconSvgPath,
  tableDefinition,
  metricDefinitions,
  metricAggregations: {
    fp: 'stats',
    unl: 'stats',
    red: 'stats',
    apc: 'stats',
    dns: 'stats',
    tcp: 'stats',
    req: 'stats',
    rsp: 'stats',
    pro: 'stats',
    loa: 'stats',
    uncaughtErrors: 'sum',
    xhrCalls: 'sum',
    xhrErrors: 'sum'
  },
  dynamicMetricAggregations: {
    stats: /^endpoint\..*\.(fp|unl|red|apc|dns|tcp|req|rsp|pro|loa)+\.(mean|min|25th|50th|75th|95th|98th|99th|max)+$/i,
    sum: /^endpoint\..*\.(uncaughtErrors|xhrCalls|xhrErrors)+$/i
  },

  pluginName: {
    singular: 'Browser',
    plural: 'Browsers'
  },

  chartWiggleRoom: 20000
});

addMapping(plugins.browserLogicalService, () => [
  {
    metric: 'count',
    label: 'calls/s',
    formatter: zeroDecimalPlaces,
    valueOnlyFormatter: zeroDecimalPlacesPerSecond
  },
  {
    metric: 'duration.mean',
    label: 'load time',
    formatter: msZeroDecimalPlaces,
    valueOnlyFormatter: msZeroDecimalPlaces
  }
]);
