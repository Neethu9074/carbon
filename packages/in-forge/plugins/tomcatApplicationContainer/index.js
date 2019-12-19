import metricDefinitions from 'in-forge/plugins/tomcatApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/tomcatApplicationContainer/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/tomcatApplicationContainer/iconPath';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tomcatApplicationContainer,
  pluginName: {
    singular: 'Tomcat',
    plural: 'Tomcats'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'Tomcat'
  }
});
