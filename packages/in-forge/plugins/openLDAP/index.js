import metricDefinitions from 'in-forge/plugins/openLDAP/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/openLDAP/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/openLDAP/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.openLDAP,
  pluginName: {
    singular: 'OpenLDAP Node',
    plural: 'OpenLDAP Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
