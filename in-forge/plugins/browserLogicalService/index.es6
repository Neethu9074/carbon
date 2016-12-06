import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.browserLogicalService,
  icon,
  namesForTypeSearch: ['service', 'eum', 'browser'],
  tableDefinition,
  metricDefinitions,
  metricAggregations: {

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
