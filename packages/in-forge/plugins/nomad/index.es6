import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.nomad,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Nomad Client',
    plural: 'Nomad Clients'
  }
});
