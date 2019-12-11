import metricDefinitions from 'in-forge/plugins/jenkins/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';
import kpiDefinitions from 'in-forge/plugins/jenkins/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.jenkins,
  kpiDefinitions,
  metricDefinitions,
  iconSvgPath,
  pluginName: {
    singular: 'Jenkins',
    plural: 'Jenkins'
  }
});
