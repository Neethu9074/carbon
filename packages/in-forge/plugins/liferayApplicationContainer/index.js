import kpiDefinitions from 'in-forge/plugins/liferayApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.liferayApplicationContainer,
  pluginName: {
    singular: 'Liferay App',
    plural: 'Liferay Apps'
  },
  kpiDefinitions,
  getCodeView,
  supportsCodeView
});
