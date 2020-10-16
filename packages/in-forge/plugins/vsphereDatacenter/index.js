import kpiDefinitions from 'in-forge/plugins/vsphereDatacenter/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.vsphereDatacenter,
  pluginName: {
    singular: 'vSphere Datacenter',
    plural: 'vSphere Datacenters'
  },
  kpiDefinitions
});
