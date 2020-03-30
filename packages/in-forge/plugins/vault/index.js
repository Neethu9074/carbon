import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import kpiDefinitions from './kpiDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.vault,
  iconSvgPath,
  metricDefinitions,
  kpiDefinitions,
  pluginName: {
    singular: 'Vault Instance',
    plural: 'Vault Instances'
  },
  technologyDescriptor: {
    label: 'Vault'
  }
});
