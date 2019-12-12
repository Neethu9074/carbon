import metricDefinitions from 'in-forge/plugins/hadoopYARNNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/hadoopYARNNode/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import iconSvgPath from 'in-forge/plugins/hadoopYARNNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.hadoopYARNNode,
  pluginName: {
    singular: 'Hadoop YARN Node',
    plural: 'Hadoop YARN Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
