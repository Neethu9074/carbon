import metricDefinitions from 'in-forge/plugins/jenkins/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/jenkins/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/jenkins/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.jenkins,
  pluginName: {
    singular: 'Jenkins',
    plural: 'Jenkins'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
