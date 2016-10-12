import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.webSphere,
  icon,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'WebSphere',
    plural: 'WebSpheres'
  },

  namesForTypeSearch: ['websphere'],

  getLabel(s) {
    const data = s.get('data');
    const nodeName = data.get('nodeName');
    const serverName = data.get('serverName');
    if (nodeName && serverName) {
      return 'WebSphere @' + nodeName + '-' + serverName;
    }
    return getFallbackLabel(s);
  }
});


function getFallbackLabel(s) {
  return 'WebSphere #' + s.get('steadyId');
}
