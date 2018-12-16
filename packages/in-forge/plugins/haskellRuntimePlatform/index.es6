import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.haskell,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Haskell Application',
    plural: 'Haskell Applications'
  },
  technologyDescriptor: {
    label: 'Haskell'
  }
});
