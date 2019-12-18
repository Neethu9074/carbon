import metricDefinitions from 'in-forge/plugins/unmonitoredHost/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/unmonitoredHost/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-sdk/unknownIconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.unmonitoredHost,
  pluginName: {
    singular: 'Unmonitored Host',
    plural: 'Unmonitored Hosts'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
