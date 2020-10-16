import metricDefinitions from 'in-forge/plugins/vsphereHost/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/vsphereHost/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.vsphereHost,
  pluginName: {
    singular: 'vSphere Host',
    plural: 'vSphere Hosts'
  },
  kpiDefinitions,
  metricDefinitions
});
