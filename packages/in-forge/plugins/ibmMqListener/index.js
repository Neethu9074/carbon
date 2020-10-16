import kpiDefinitions from 'in-forge/plugins/ibmMqListener/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmMqListener,
  pluginName: {
    singular: 'IBM MQ Listener',
    plural: 'IBM MQ Listeners'
  },
  kpiDefinitions
});
