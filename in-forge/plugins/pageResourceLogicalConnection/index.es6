import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import iconSvgPath from 'in-forge/plugins/browserLogicalService/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pageResourceLogicalConnection,

  iconSvgPath,
  metricDefinitions,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Page Resource Connection',
    plural: 'Page Resource Connections'
  }
});
