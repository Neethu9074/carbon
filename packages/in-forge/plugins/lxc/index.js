import metricDefinitions from 'in-forge/plugins/lxc/metricDefinitions';
import tableDefinition from 'in-forge/plugins/lxc/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/lxc/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.lxc,
  iconSvgPath,
  metricDefinitions,
  tableDefinition,

  pluginName: {
    singular: 'LXC Container',
    plural: 'LXC Containers'
  }
});
