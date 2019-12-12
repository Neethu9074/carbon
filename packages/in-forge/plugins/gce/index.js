import metricDefinitions from 'in-forge/plugins/gce/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/gce/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/gce/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.gce,
  pluginName: {
    singular: 'GCE Instance',
    plural: 'GCE Instances'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
