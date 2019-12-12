import metricDefinitions from 'in-forge/plugins/application/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/application/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/application/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.application,
  pluginName: {
    singular: 'Application',
    plural: 'Applications'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity.get('label', 'Application');
  }
});
