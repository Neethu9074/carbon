import iconSvgPath from 'in-forge/plugins/pCFOrganization/iconPath';
import kpiDefinitions from 'in-forge/plugins/pCFOrganization';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFOrganization,
  iconSvgPath,
  kpiDefinitions,
  pluginName: {
    singular: 'Cloud Foundry Organization',
    plural: 'Cloud Foundry Organizations'
  }
});
