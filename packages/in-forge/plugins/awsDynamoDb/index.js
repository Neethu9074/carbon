import metricDefinitions from 'in-forge/plugins/awsDynamoDb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsDynamoDb/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/awsDynamoDb/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsDynamoDb,
  pluginName: {
    singular: 'AWS DynamoDB Table',
    plural: 'AWS DynamoDB Tables'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'dyndb_table_name'], '');
  }
});
