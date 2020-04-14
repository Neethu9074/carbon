import kpiDefinitions from 'in-forge/plugins/tanzuFoundation/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/tanzuFoundation/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tanzuFoundation,
  pluginName: {
    singular: 'Tanzu Foundation',
    plural: 'Tanzu Foundations'
  },
  iconSvgPath,
  kpiDefinitions
});
