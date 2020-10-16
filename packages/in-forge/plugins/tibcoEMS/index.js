import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import kpiDefinitions from './kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tibcoEMS,
  metricDefinitions,
  kpiDefinitions,
  pluginName: {
    singular: 'Tibco EMS',
    plural: 'Tibco EMS'
  },
  technologyDescriptor: {
    label: 'Tibco EMS'
  }
});
