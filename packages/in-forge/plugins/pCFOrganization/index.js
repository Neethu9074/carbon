import kpiDefinitions from 'in-forge/plugins/pCFOrganization/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/pCFOrganization/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFOrganization,
  pluginName: {
    singular: 'Cloud Foundry Organization',
    plural: 'Cloud Foundry Organizations'
  },
  iconSvgPath,
  kpiDefinitions
});
