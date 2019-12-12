import metricDefinitions from 'in-forge/plugins/glassfishApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/glassfishApplicationContainer/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/glassfishApplicationContainer/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.glassfishApplicationContainer,
  pluginName: {
    singular: 'Glassfish',
    plural: 'Glassfish'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Glassfish'
  }
});
