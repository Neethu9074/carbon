import iconSvgPath from 'in-forge/plugins/application/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.application,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Application',
    plural: 'Applications'
  },

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity.get('label', 'Application');
  }
});
