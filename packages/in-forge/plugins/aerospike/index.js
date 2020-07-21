import kpiDefinitions from 'in-forge/plugins/aerospike/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/aerospike/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.aerospike,
  pluginName: {
    singular: 'Aerospike',
    plural: 'Aerospike'
  },
  iconSvgPath,
  kpiDefinitions,
  technologyDescriptor: {
    label: 'Aerospike'
  }
});
