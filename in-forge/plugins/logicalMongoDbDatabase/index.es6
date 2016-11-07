import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/mongoDb/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalMongoDbDatabase,
  icon,
  namesForTypeSearch: ['service'],
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'MongoDB Database',
    plural: 'MongoDB Databases'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
