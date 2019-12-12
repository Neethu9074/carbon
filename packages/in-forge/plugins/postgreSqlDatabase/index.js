import metricDefinitions from 'in-forge/plugins/postgreSqlDatabase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/postgreSqlDatabase/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/postgreSqlDatabase/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.postgreSqlDatabase,
  pluginName: {
    singular: 'PostgreSQL DB',
    plural: 'PostgreSQL DBs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'PostgreSQL'
  }
});
