import metricDefinitions from 'in-forge/plugins/varnish/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/varnish/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/varnish/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.varnish,
  pluginName: {
    singular: 'Varnish Node',
    plural: 'Varnish Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
