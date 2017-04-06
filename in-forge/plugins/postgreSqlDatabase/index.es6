import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.postgresql,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'PostgreSQL DB',
    plural: 'PostgreSQL DBs'
  }
});
