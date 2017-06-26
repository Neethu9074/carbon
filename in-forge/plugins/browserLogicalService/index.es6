import { zeroDecimalPlacesPerSecond, msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { eumViewEnabled } from 'in-services/featureFlags';
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
    fp: 'mean',
    unl: 'mean',
    red: 'mean',
    apc: 'mean',
    dns: 'mean',
    tcp: 'mean',
    req: 'mean',
    rsp: 'mean',
    pro: 'mean',
    loa: 'mean',
    uncaughtErrors: 'sum',
    xhrCalls: 'sum',
    xhrErrors: 'sum'
  },
  dynamicMetricAggregations: {
    mean: /^endpoint\..*\.(fp|unl|red|apc|dns|tcp|req|rsp|pro|loa)$/i,
    sum: /^endpoint\..*\.(uncaughtErrors|xhrCalls|xhrErrors)$/i
  },
  isNewDashboard: eumViewEnabled,

  pluginName: {
    singular: 'Website',
    plural: 'Websites'
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
