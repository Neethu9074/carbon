import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/haskellRuntimePlatform/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.haskellRuntimePlatform,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Haskell Application',
    plural: 'Haskell Applications'
  },
  technologyDescriptor: {
    label: 'Haskell'
  }
});
