import iconSvgPath from 'in-forge/plugins/pageResourceLogicalService/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pageResourceLogicalConnection,

  iconSvgPath,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Page Resource Connection',
    plural: 'Page Resource Connections'
  }
});
