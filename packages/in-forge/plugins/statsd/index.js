import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/statsd';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.statsd,
  kpiDefinitions,
  metricDefinitions,
  iconSvgPath,
  pluginName: {
    singular: 'Statsd',
    plural: 'Statsd'
  }
});
