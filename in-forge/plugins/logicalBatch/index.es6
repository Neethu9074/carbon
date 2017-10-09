import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import iconSvgPath from 'in-forge/plugins/batchServiceInstance/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.logicalBatch,

  iconSvgPath,
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'Batch Job',
    plural: 'Batch Jobs'
  },

  chartWiggleRoom: 20000
});
