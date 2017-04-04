import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.tomcat,

  iconSvgPath,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(plugins.tomcat, 'Tomcat Server', 'Tomcat Servers');

addSearchableEntityType('tomcat', plugins.tomcat);
