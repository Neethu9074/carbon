import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.phpfpm,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'PHP-FPM Runtime',
    plural: 'PHP-FPM Runtimes'
  }
});
