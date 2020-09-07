import metricDefinitions from 'in-forge/plugins/beeInstanaNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/beeInstanaNode/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/beeInstanaNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.beeInstanaNode,
  pluginName: {
    singular: 'BeeInstana Server',
    plural: 'BeeInstana Servers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'BeeInstana'
  }
});
