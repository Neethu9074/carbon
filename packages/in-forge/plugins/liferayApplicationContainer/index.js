import kpiDefinitions from 'in-forge/plugins/liferayApplicationContainer/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/liferayApplicationContainer/iconPath';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.liferayApplicationContainer,
  pluginName: {
    singular: 'Liferay App',
    plural: 'Liferay Apps'
  },
  iconSvgPath,
  kpiDefinitions,
  getCodeView,
  supportsCodeView
});
