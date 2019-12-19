import metricDefinitions from 'in-forge/plugins/hadoopYARN/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/hadoopYARN/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import iconSvgPath from 'in-forge/plugins/hadoopYARN/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.hadoopYARN,
  pluginName: {
    singular: 'Hadoop YARN',
    plural: 'Hadoop YARNs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
