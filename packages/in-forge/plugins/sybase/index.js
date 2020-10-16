import metricDefinitions from 'in-forge/plugins/sybase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/sybase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.sybase,
  pluginName: {
    singular: 'Sybase Server',
    plural: 'Sybase Servers'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Sybase'
  }
});
