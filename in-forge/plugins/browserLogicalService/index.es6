import { zeroDecimalPlacesPerSecond, msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addKeywordOperator } from 'in-sdk/search/registry';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import { addMapping } from 'in-sdk/kpi';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.browserLogicalService,

  iconSvgPath,
  namesForTypeSearch: ['service', 'eum', 'browser'],
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
    loa: 'stats'
  },

  pluginName: {
    singular: 'Browser',
    plural: 'Browsers'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
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

addKeywordOperator({
  context: 'trace',
  type: 'string',
  keyword: 'browser',
  field: 'data.page.userAgent.browser.name'
});

addKeywordOperator({
  context: 'trace',
  type: 'string',
  keyword: 'country',
  field: 'data.page.geo.country'
});

addKeywordOperator({
  context: 'trace',
  type: 'string',
  keyword: 'os',
  field: 'data.page.userAgent.os.name'
});
