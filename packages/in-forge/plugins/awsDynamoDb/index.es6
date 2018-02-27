import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsDynamoDb,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS DynamoDb Table',
    plural: 'AWS DynamoDb Tables'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'dyndb_table_name'], '');
  }
});
