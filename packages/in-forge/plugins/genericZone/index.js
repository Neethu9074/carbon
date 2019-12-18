import metricDefinitions from 'in-forge/plugins/genericZone/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/genericZone/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/genericZone/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.genericZone,
  pluginName: {
    singular: 'Custom Zone',
    plural: 'Custom Zones'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
