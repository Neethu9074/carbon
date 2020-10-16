import metricDefinitions from 'in-forge/plugins/jbossDataGrid/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/jbossDataGrid/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.jbossDataGrid,
  pluginName: {
    singular: 'JBoss Data Grid',
    plural: 'JBoss Data Grids'
  },
  kpiDefinitions,
  metricDefinitions
});
