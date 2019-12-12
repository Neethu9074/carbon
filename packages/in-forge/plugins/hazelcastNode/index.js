import metricDefinitions from 'in-forge/plugins/hazelcastNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/hazelcastNode/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import iconSvgPath from 'in-forge/plugins/hazelcastNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.hazelcastNode,
  pluginName: {
    singular: 'Hazelcast Node',
    plural: 'Hazelcast Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
