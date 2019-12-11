import kpiDefinitions from 'in-forge/plugins/vsphereDatacenter';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.vsphereDatacenter,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'vSphere Datacenter',
    plural: 'vSphere Datacenters'
  }
});
