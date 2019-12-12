import metricDefinitions from 'in-forge/plugins/statsd/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/statsd/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-sdk/unknownIconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.statsd,
  pluginName: {
    singular: 'Statsd',
    plural: 'Statsd'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
