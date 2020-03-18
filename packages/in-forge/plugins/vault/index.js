import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.vault,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Vault',
    plural: 'Vaults'
  },
  technologyDescriptor: {
    label: 'Vault'
  }
});
