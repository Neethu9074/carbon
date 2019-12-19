import metricDefinitions from 'in-forge/plugins/f5/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/f5/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/f5/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.f5,
  pluginName: {
    singular: 'F5',
    plural: 'F5'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
