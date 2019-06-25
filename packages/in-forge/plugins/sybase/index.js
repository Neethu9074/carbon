import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.sybase,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Sybase Server',
    plural: 'Sybase Servers'
  },
  technologyDescriptor: {}
});
