import metricDefinitions from 'in-forge/plugins/vsphereVm/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/vsphereVm/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/vsphereVm/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.vsphereVm,
  pluginName: {
    singular: 'vSphere VM',
    plural: 'vSphere VMs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
