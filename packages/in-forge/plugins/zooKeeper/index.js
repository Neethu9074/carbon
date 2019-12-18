import metricDefinitions from 'in-forge/plugins/zooKeeper/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/zooKeeper/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/zooKeeper/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.zooKeeper,
  pluginName: {
    singular: 'ZooKeeper',
    plural: 'ZooKeepers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
