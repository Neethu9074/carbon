import metricDefinitions from 'in-forge/plugins/etcd/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/etcd/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/etcd/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.etcd,
  pluginName: {
    singular: 'Etcd Node',
    plural: 'Etcd Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
