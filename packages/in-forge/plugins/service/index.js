import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/service/iconPath';
import kpiDefinitions from 'in-forge/plugins/service';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.service,
  iconSvgPath,
  kpiDefinitions,
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
