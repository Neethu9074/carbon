import metricDefinitions from 'in-forge/plugins/instanaAgent/metricDefinitions';
import tableDefinition from 'in-forge/plugins/instanaAgent/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/instanaAgent/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/instanaAgent/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.instanaAgent,
  pluginName: {
    singular: 'Instana Agent',
    plural: 'Instana Agents'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  tableDefinition
});
