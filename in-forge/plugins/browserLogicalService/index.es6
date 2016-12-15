import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import {
  zeroDecimalPlacesPerSecond,
  msZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import {addMapping} from 'in-sdk/kpi';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.browserLogicalService,
  icon,
  namesForTypeSearch: ['service', 'eum', 'browser'],
  tableDefinition,
  metricDefinitions,
  metricAggregations: {},

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
  }, {
    metric: 'duration.mean',
    label: 'load time',
    formatter: msZeroDecimalPlaces,
    valueOnlyFormatter: msZeroDecimalPlaces
  }
]);
