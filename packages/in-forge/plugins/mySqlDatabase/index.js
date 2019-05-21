import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.mySqlDatabase,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'MySQL DB',
    plural: 'MySQL DBs'
  },
  technologyDescriptor: {
    label: 'MySQL'
  }
});
