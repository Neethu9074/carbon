import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/awsDynamoDb/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsDynamoDb,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  pluginName: {
    singular: 'AWS DynamoDB Table',
    plural: 'AWS DynamoDB Tables'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'dyndb_table_name'], '');
  }
});
