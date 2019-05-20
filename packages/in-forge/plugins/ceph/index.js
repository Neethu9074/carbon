import iconSvgPath from 'in-forge/plugins/ceph/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ceph,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Ceph instance',
    plural: 'Ceph instances'
  }
});
