import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.consul,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Consul Client',
    plural: 'Consul Clients'
  }
});
