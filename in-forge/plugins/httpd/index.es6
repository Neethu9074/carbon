import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.httpd,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Apache httpd',
    plural: 'Apache httpds'
  }
});
