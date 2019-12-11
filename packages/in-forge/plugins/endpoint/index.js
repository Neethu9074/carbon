import iconSvgPath from 'in-forge/plugins/endpoint/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/endpoint/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.endpoint,

  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  pluginName: {
    singular: 'Endpoint',
    plural: 'Endpoints'
  },

  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity.get('label', 'Endpoint');
  }
});
