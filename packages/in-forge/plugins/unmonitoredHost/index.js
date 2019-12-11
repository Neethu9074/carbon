import kpiDefinitions from 'in-forge/plugins/unmonitoredHost';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.unmonitoredHost,
  kpiDefinitions,
  metricDefinitions,
  iconSvgPath,
  pluginName: {
    singular: 'Unmonitored Host',
    plural: 'Unmonitored Hosts'
  }
});
