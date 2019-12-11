import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/etcd/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.etcd,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Etcd Node',
    plural: 'Etcd Nodes'
  }
});
