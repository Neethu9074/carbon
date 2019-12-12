import metricDefinitions from 'in-forge/plugins/endpoint/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/endpoint/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/endpoint/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.endpoint,
  pluginName: {
    singular: 'Endpoint',
    plural: 'Endpoints'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity.get('label', 'Endpoint');
  }
});
