import metricDefinitions from 'in-forge/plugins/mariaDbDatabase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mariaDbDatabase/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/mariaDbDatabase/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mariaDbDatabase,
  pluginName: {
    singular: 'MariaDB',
    plural: 'MariaDBs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'MariaDB'
  }
});
