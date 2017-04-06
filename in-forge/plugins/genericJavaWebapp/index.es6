import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.javaWebApp,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'JVM Web App',
    plural: 'JVM Web Apps'
  }
});
