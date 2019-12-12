import metricDefinitions from 'in-forge/plugins/mySqlDatabase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mySqlDatabase/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/mySqlDatabase/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mySqlDatabase,
  pluginName: {
    singular: 'MySQL DB',
    plural: 'MySQL DBs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'MySQL'
  }
});
