import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.liferay,
  iconSvgPath,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Liferay App',
    plural: 'Liferay Apps'
  }
});
