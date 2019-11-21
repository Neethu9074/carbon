import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/service/iconPath';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.service,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Service',
    plural: 'Services'
  },

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity.get('label', 'Service');
  }
});
