import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import iconSvgPath from 'in-sdk/unknownIconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.logicalBatchConnection,

  iconSvgPath,
  metricDefinitions,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Batch Connection',
    plural: 'Batch Connections'
  }
});
