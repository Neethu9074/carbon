import metricDefinitions from 'in-forge/plugins/vault/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/vault/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.vault,
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
