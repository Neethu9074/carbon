import kpiDefinitions from 'in-forge/plugins/postgreSqlDatabase';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.postgreSqlDatabase,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'PostgreSQL DB',
    plural: 'PostgreSQL DBs'
  },
  technologyDescriptor: {
    label: 'PostgreSQL'
  }
});
