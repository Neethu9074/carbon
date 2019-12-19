import metricDefinitions from 'in-forge/plugins/msiis/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/msiis/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/msiis/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.msiis,
  pluginName: {
    singular: 'Internet Information Server',
    plural: 'Internet Information Servers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
