import iconSvgPath from 'in-forge/plugins/ceph/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/ceph/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.ceph,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Ceph instance',
    plural: 'Ceph instances'
  }
});
