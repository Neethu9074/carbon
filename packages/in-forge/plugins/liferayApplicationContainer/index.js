import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/liferayApplicationContainer/kpiDefinitions';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.liferayApplicationContainer,
  iconSvgPath,
  supportsCodeView,
  getCodeView,
  kpiDefinitions,
  pluginName: {
    singular: 'Liferay App',
    plural: 'Liferay Apps'
  }
});
